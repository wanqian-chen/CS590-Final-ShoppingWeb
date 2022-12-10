<template>
  <div class="mx-3 my-3">
    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-form-checkbox id="edit-mode-switch" v-model="mode.edit" @change="refresh" class="mb-2" switch>Edit Mode</b-form-checkbox>

    <div class="accordion" role="tablist">
      <b-card no-body class="mb-1" v-for="menuItem in menu">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle="('accordion-'+menuItem.itemId)" variant="info">{{menuItem.itemId}}</b-button>
          <b-button :id="('menu-delete-item-'+menuItem.itemId)" v-if="mode.edit" @click="deleteItem(menuItem.itemId)" class="ml-2" variant="outline-danger">Delete Item</b-button>
        </b-card-header>
        <b-collapse :id="('accordion-'+menuItem.itemId)" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <div v-for="choice in menuItem.ingredientChoices">
              <b-form-input :id="('ingredient-'+choice)" v-if="mode.edit" v-model="choice" @focus="saveOrigin(String(choice))" @blur="reviseIngredient(menuItem.itemId, String(choice))" type="text"></b-form-input>
              <b-button :id="('menu-delete-ingredient-'+choice)" v-if="mode.edit" @click="deleteIngredient(menuItem.itemId, choice)" class="mt-2 mb-4" variant="outline-danger">Delete the ingredient</b-button>
              <b-card-text v-if="!mode.edit">{{choice}}</b-card-text>
            </div>

            <div v-if="(mode.edit && !mode.addNew)">
              <b-button :id="('menu-add-ingredient-'+menuItem.itemId)" v-if="menuItem.itemId != draft.reviseItem" @click="addIngredient(menuItem.itemId)" class="mb-2" variant="outline-primary">Add an ingredient</b-button>
              <b-form-input id="input-ingredient" v-if="menuItem.itemId == draft.reviseItem" v-model="draft.reviseIngredient" placeholder="Add an ingredient"></b-form-input>
              <b-button id="menu-save-ingredient" v-if="menuItem.itemId == draft.reviseItem" @click="save(String('revise'))" class="mb-2 mt-2 mr-2">Save</b-button>
              <b-button id="menu-cancel-ingredient" v-if="menuItem.itemId == draft.reviseItem" @click="reset" class="mb-2 mt-2">Cancel</b-button>
            </div>

          </b-card-body>
        </b-collapse>
      </b-card>
    </div>

    <div v-if="mode.edit">
      <b-button id="menu-add-item" v-if="!mode.addNew" @click="startAdding" class="mb-2 mt-4" variant="outline-primary">Add an item</b-button>
      <div v-if="(mode.addNew)" class="mt-4">
        <b-form-input id="input-item" v-model="draft.newItem" placeholder="Input a new item"></b-form-input>
        <b-button id="menu-save-item" @click="save(String('add'))" class="mb-2 mt-2 mr-2">Save</b-button>
        <b-button id="menu-cancel-item" @click="reset" class="mb-2 mt-2">Cancel</b-button>
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
  reviseIngredient: "",
  originIngredient: ""
}

async function refresh() {

  if (user.value) {
    operator.value = await (await fetch("/api/operator/")).json()
  }
  orders.value = await (await fetch("/api/orders/")).json()
  menu.value = await (await fetch("/api/menu/")).json()
}
watch(user, refresh, { immediate: true })

async function saveOrigin(origin: string) {
  draft.originIngredient = origin
}

async function startAdding() {
  mode.addNew = true
  await refresh()
}

async function reset() {
  draft.newItem = ""
  draft.reviseItem = ""
  draft.reviseIngredient = ""
  draft.originIngredient = ""
  mode.addNew = false
  await refresh()
}

async function reviseIngredient(itemId: string, ingredient: string) {
  draft.reviseItem = itemId
  draft.reviseIngredient = ingredient

  await fetch(
  "/api/menurevise",
  {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      mode: "modify",
      draft: draft
    })
  }
  )

  await reset()
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