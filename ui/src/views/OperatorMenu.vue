<template>
  <div class="mx-3 my-3">
    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <!-- <b-table :items="orders" :fields="fields">
      <template #cell(operatorId)="cellScope">
        <span v-if="cellScope.value">
          {{ cellScope.value }}
          <b-button @click="updateOrder(cellScope.item._id, 'done')" v-if="cellScope.value === user?.preferred_username && cellScope.item.state !== 'done'">
            Done
          </b-button>
        </span>
        <b-button v-else @click="updateOrder(cellScope.item._id, 'blending')">Start Blending</b-button>
      </template>
    </b-table> -->

    <div class="accordion" role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-1 variant="info">Accordion 1</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>I start opened because <code>visible</code> is <code>true</code></b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>

    <div v-for="(value, key) in possibleAll">
    <b-button v-b-toggle="('collapse-'+key)" variant="primary">{{key}}</b-button>
    <b-collapse :id="('collapse-'+key)" class="mt-2">
      <b-card>
        <b-form-checkbox-group v-model="draftOrderAll[key]" :options="value" />
      </b-card>
    </b-collapse>
    </div>
  </div>

</template>

<script setup lang="ts">
import { watch, ref, Ref, inject } from 'vue'
import { Operator, Order } from "../../../server/data"

const operator: Ref<Operator | null> = ref(null)
const orders: Ref<Order[]> = ref([])

const draftOrderAll: Ref<Object> = ref({})
const possibleAll: Ref<Object> = ref({})

const user: Ref<any> = inject("user")!

async function refresh() {
  possibleAll.value = await (await fetch("/api/possible-all")).json()

  if (user.value) {
    operator.value = await (await fetch("/api/operator/")).json()
  }
  orders.value = await (await fetch("/api/orders/")).json()
}
watch(user, refresh, { immediate: true })

const fields = ["_id", "customerId", "state", "ingredients", "operatorId"]

async function updateOrder(orderId: string, state: string) {
  await fetch(
    "/api/order/" + encodeURIComponent(orderId),
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        operatorId: user.value.preferred_username,
        state,
      })
    }
  )
  await refresh()
}
</script>