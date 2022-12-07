<template>
  <div class="mx-3 my-3">
    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-button @click="refresh" class="mb-2">Add a new item</b-button>
    <b-button @click="editModeSwitch" class="mb-2">Edit Mode</b-button>

    <div class="accordion" role="tablist">
      <b-card no-body class="mb-1" v-for="menuItem in menu">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-1 variant="info">{{menuItem.itemId}}</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <!-- <b-card-text>{{value}}</b-card-text> -->
            <div v-for="choice in menuItem.ingredientChoices">
              <!-- <b-button @click="updateIngredient(menuItem.itemId, choice)" class="mb-2">Revise</b-button> -->
              <b-form-input v-if="mode.edit" v-model="choice" type="text"></b-form-input>
              <b-button v-if="mode.edit" @click="refresh" class="mb-2">-</b-button>
              <b-card-text v-if="!mode.edit">{{choice}}</b-card-text>
            </div>
            <b-button @click="refresh" class="mb-2">Add an ingredient</b-button>
          </b-card-body>
        </b-collapse>
      </b-card>
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
  edit: false
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

async function updateIngredient(menuItem: string, choice: string) {
  await fetch(
    "/api/order/" + encodeURIComponent(menuItem) + "/" + encodeURIComponent(choice),
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
</script>