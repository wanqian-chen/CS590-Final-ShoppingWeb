<template>
  <div class="mx-3 my-3">
    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-button @click="editModeSwitch" class="mb-2">Edit Mode</b-button>
    <!-- <b-button v-if="mode.edit" @click="addNewItem" class="mb-2">Add a new item</b-button> -->

    <div class="accordion" role="tablist">
      <b-card no-body class="mb-1" v-for="menuItem in menu">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle="('accordion-'+menuItem.itemId)" variant="info">{{menuItem.itemId}}</b-button>
          <b-button v-if="mode.edit" @click="deleteItem(menuItem.itemId)" class="mb-2">Delete Item</b-button>
        </b-card-header>
        <b-collapse :id="('accordion-'+menuItem.itemId)" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <!-- <b-card-text>{{value}}</b-card-text> -->
            <div v-for="choice in menuItem.ingredientChoices">
              <!-- <b-button @click="updateIngredient(menuItem.itemId, choice)" class="mb-2">Revise</b-button> -->
              <b-form-input v-if="mode.edit" v-model="choice" type="text"></b-form-input>
              <b-button v-if="mode.edit" @click="deleteIngredient(menuItem.itemId, choice)" class="mb-2">-</b-button>
              <b-card-text v-if="!mode.edit">{{choice}}</b-card-text>
            </div>

            <div v-if="(mode.edit && !mode.addNew)">
              <b-button v-if="menuItem.itemId != draft.reviseItem" @click="addIngredient(menuItem.itemId)" class="mb-2">Add an ingredient</b-button>
              <b-form-input v-if="menuItem.itemId == draft.reviseItem" v-model="draft.reviseIngredient" placeholder="Add an ingredient"></b-form-input>
              <b-button v-if="menuItem.itemId == draft.reviseItem" @click="save(String('revise'))" class="mb-2">Save</b-button>
              <b-button v-if="menuItem.itemId == draft.reviseItem" @click="reset" class="mb-2">Cancel</b-button>
            </div>

          </b-card-body>
        </b-collapse>
      </b-card>
    </div>

    <div v-if="mode.edit">
      <b-button v-if="!mode.addNew" @click="startAdding" class="mb-2">Add an item</b-button>
      <div v-if="(mode.addNew)">
        <!-- <h3>Add a new item:</h3> -->
        <b-form-input v-model="draft.newItem" placeholder="Input a new item"></b-form-input>
        <b-button @click="save(String('add'))" class="mb-2">Save</b-button>
        <b-button @click="reset" class="mb-2">Cancel</b-button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">

import Vue, { watch, ref, Ref, inject } from 'vue'
import { Operator, Order, MenuItem } from "../../../server/data"

const operator: Ref<Operator | null> = ref(null)
const orders: Ref<Order[]> = ref([])
const menu: Ref<MenuItem[]> = ref([])

const draftOrderAll: Ref<Object> = ref({})
const possibleAll: Ref<Object> = ref({})

const user: Ref<any> = inject("user")!

const mode = {
  edit: false,
  addNew: false
}

const draft = {
  newItem: "",
  reviseItem: "",
  reviseIngredient: ""
}

async function refresh() {
  possibleAll.value = await (await fetch("/api/possible-all")).json()

  if (user.value) {
    operator.value = await (await fetch("/api/operator/")).json()
  }
  orders.value = await (await fetch("/api/orders/")).json()
  menu.value = await (await fetch("/api/menu/")).json()
}
watch(user, refresh, { immediate: true })

async function addNewItem(menuItem: string, choice: string) {
  await fetch(
    "/api/menurevise/" + encodeURIComponent(menuItem) + "/" + encodeURIComponent(choice),
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        choice: "a"
      })
    }
  )
  await refresh()
}

async function editModeSwitch() {
  mode.edit = !mode.edit
  await refresh()
}

async function startAdding() {
  mode.addNew = true
  await refresh()
}

async function reset() {
  draft.newItem = ""
  draft.reviseItem = ""
  draft.reviseIngredient = ""
  mode.addNew = false
  await refresh()
}

async function addIngredient(menuItem: string) {
  draft.reviseItem = menuItem
  draft.reviseIngredient = ""
  await refresh()
}

async function deleteIngredient(itemId: string, ingredientId: string) {
  await fetch(
  "/api/menudelete/ingredient",
  {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      itemId,
      ingredientId
    })
  }
  )

  await refresh()
}

async function deleteItem(itemId: string) {
  await fetch(
  "/api/menudelete/item",
  {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      itemId
    })
  }
  )

  await refresh()
}

async function save(mode: string) {
  await fetch(
  "/api/menurevise",
  {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      mode,
      draft: draft
    })
  }
  )

  await reset()
}

</script>