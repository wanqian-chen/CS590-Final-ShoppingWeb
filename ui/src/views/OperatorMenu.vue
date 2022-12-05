<template>
  <div class="mx-3 my-3">
    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>

    <div class="accordion" role="tablist">
      <b-card no-body class="mb-1" v-for="(value, key) in possibleAll">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-1 variant="info">{{key}}</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <!-- <b-card-text>{{value}}</b-card-text> -->
            <div v-for="item in value">
              {{item}}
            </div>
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