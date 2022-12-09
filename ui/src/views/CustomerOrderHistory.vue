<template>
    <div class="mx-3 my-3">
      <h2>Orders</h2>
      <b-button @click="refresh" class="mb-2">Refresh</b-button>
      <b-table v-if="customer" :items="customer?.orders" :fields="fields">
        <template #cell(order)="cellScope">
          <div v-for="(ingredients, item, index) in cellScope.value">
            {{item}} with 
            <span v-for="ingredient in ingredients">
              '{{ingredient}}' 
            </span>
          </div>
        </template>
      </b-table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { watch, ref, inject, Ref } from 'vue'
  import { CustomerWithOrders } from "../../../server/data"
  
  const customer: Ref<CustomerWithOrders | null> = ref(null)
  const user: Ref<any> = inject("user")!
  
  const draftOrderIngredients: Ref<string[]> = ref([])
  const possibleIngredients: Ref<string[]> = ref([])
  
  const draftOrderTeas: Ref<string[]> = ref([])
  const possibleTeas: Ref<string[]> = ref([])

  const fields = [
    "_id",
    "customerId",
    "state",
    {
      key: "order",
      label: "Order Item"
    }
  ]
  
  async function refresh() {
    possibleIngredients.value = await (await fetch("/api/possible-ingredients")).json()
    possibleTeas.value = await (await fetch("/api/possible-teas")).json()
  
    if (user.value) {
      customer.value = await (await fetch("/api/customer")).json()
      draftOrderIngredients.value = (await (await fetch("/api/customer/draft-order")).json())?.ingredients || []
    }
  }
  watch(user, refresh, { immediate: true })
  
  async function save() {
    await fetch(
      "/api/customer/draft-order",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ ingredients: draftOrderIngredients.value, teas: draftOrderTeas.value })
      }
    )
  }
  
  async function submit() {
    await fetch(
      "/api/customer/submit-draft-order",
      { method: "POST" }
    )
    await refresh()
  }
  </script>