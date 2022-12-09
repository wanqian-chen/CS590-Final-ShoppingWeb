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
  
    if (user.value) {
      customer.value = await (await fetch("/api/customer")).json()
    }
  }
  watch(user, refresh, { immediate: true })
  
  </script>