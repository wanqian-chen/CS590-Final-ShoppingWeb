<template>
  <div class="mx-3 my-3">
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <!-- <b-table :items="orders" /> -->
    <b-table :items="orders" :fields="fields">
      <template #cell(order.value)="cellScope">
        <div v-for="(ingredients, item) in cellScope.value">
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
import { onMounted, ref, Ref } from 'vue'
import { Order } from "../../../server/data"

const orders: Ref<Order[]> = ref([])

const fields = [
  "_id",
  "customerId",
  "state",
  {
    key: "order.value",
    label: "Order Item"
  },
  "operatorId"
]

async function refresh() {
  orders.value = await (await fetch("/api/orders")).json()
}
onMounted(refresh)
</script>