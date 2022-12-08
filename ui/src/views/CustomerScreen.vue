<template>
  <div class="mx-3 my-3">
    <h2>Orders</h2>
    <b-button id="refresh" @click="refresh" class="mb-2">Refresh</b-button>
    <b-table v-if="customer" :items="customer.orders" />
    
    <h2>Draft Order</h2>
    Check the ingredients you want:
    <b-form-checkbox-group v-model="draftOrderIngredients" :options="possibleIngredients" />
    <b-form-checkbox-group v-model="draftOrderTeas" :options="possibleTeas" />

    <b-button v-b-toggle.collapse-1 variant="primary">Toggle Collapse</b-button>
    <b-collapse id="collapse-1" class="mt-2">
      <b-card>
        <b-form-checkbox-group v-model="draftOrderTeas" :options="possibleTeas" />
        <!-- <p class="card-text">Collapse contents Here</p> -->
        <!-- <b-button v-b-toggle.collapse-1-inner size="sm">Toggle Inner Collapse</b-button>
        <b-collapse id="collapse-1-inner" class="mt-2">
          <b-card>Hello!</b-card>
        </b-collapse> -->
      </b-card>
    </b-collapse>

    <div v-for="(value, key) in possibleAll">
      <b-button v-b-toggle="('collapse-'+key)" variant="primary">{{key}}</b-button>
      <b-collapse :id="('collapse-'+key)" class="mt-2">
        <b-card>
          <b-form-checkbox-group v-model="draftOrderAll[key]" :options="value" />
        </b-card>
      </b-collapse>
    </div>

    <div class="mt-2">
      <b-button @click="save">Save</b-button>
    </div>
    <div class="mt-2">
      <b-button @click="submit">Submit</b-button>
      Note: must save before submitting
    </div>
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

const draftOrderAll: Ref<Object> = ref({})
const possibleAll: Ref<Object> = ref({})

async function refresh() {
  possibleIngredients.value = await (await fetch("/api/possible-ingredients")).json()
  possibleTeas.value = await (await fetch("/api/possible-teas")).json()
  possibleAll.value = await (await fetch("/api/possible-all")).json()

  if (user.value) {
    customer.value = await (await fetch("/api/customer")).json()
    // draftOrderIngredients.value = (await (await fetch("/api/customer/draft-order")).json())?.ingredients || []
    draftOrderIngredients.value = (await (await fetch("/api/customer/draft-order")).json())?.allOrders || {}
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
      // body: JSON.stringify({ ingredients: draftOrderIngredients.value, teas: draftOrderTeas.value })
      body: JSON.stringify({ allOrders: draftOrderAll })
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