<template>
  <div class="mx-3 my-3">
    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table v-if="customer" :items="customer.orders" />
    
    <h2>Your Cart</h2>
    <div v-for="(ingredients, item, index) in draftOrderAll">
      <span>{{(index+1)}}. </span>
      <span>{{item}} with </span>
      <span v-for="i in ingredients">
        {{i}}
      </span>
      <span v-if="index != Object.keys(draftOrderAll).length">, </span>
    </div>

    <div>
      <b-form-select @change="refresh" v-model="draftOrder.selectedItem" :options="menu" value-field="itemId" text-field="itemId" class="mb-3">
        <!-- This slot appears above the options from 'options' prop -->
        <template #first>
          <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
        </template>
      </b-form-select>
    </div>

    <div v-for="menuItem in menu" class="mb-3">
      <div v-if="(menuItem.itemId == draftOrder.selectedItem)">
        <b-form-checkbox-group v-model="draftOrder.selectedIngredients" :options="menuItem.ingredientChoices" />
      </div>
    </div>

    <div class="mt-2">
      <b-button @click="addToCart">Add to cart</b-button>
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
import Vue, { watch, ref, inject, Ref } from 'vue'
import { CustomerWithOrders, MenuItem,  } from "../../../server/data"

const customer: Ref<CustomerWithOrders | null> = ref(null)
const user: Ref<any> = inject("user")!

const draftOrderIngredients: Ref<string[]> = ref([])
const possibleIngredients: Ref<string[]> = ref([])

const draftOrderTeas: Ref<string[]> = ref([])
const possibleTeas: Ref<string[]> = ref([])

let draftOrderAll = {}
const possibleAll: Ref<Object> = ref({})

const menu: Ref<MenuItem[]> = ref([])
const draftOrder = {
  selectedItem: "",
  selectedIngredients: []
}

async function refresh() {
  possibleIngredients.value = await (await fetch("/api/possible-ingredients")).json()
  possibleTeas.value = await (await fetch("/api/possible-teas")).json()
  possibleAll.value = await (await fetch("/api/possible-all")).json()
  menu.value = await (await fetch("/api/menu/")).json()

  if (user.value) {
    customer.value = await (await fetch("/api/customer")).json()
    // draftOrderIngredients.value = (await (await fetch("/api/customer/draft-order")).json())?.ingredients || []
    draftOrderIngredients.value = (await (await fetch("/api/customer/draft-order")).json())?.allOrders || {}
  }
}
watch(user, refresh, { immediate: true })

async function addToCart() {
  Vue.set(draftOrderAll, draftOrder.selectedItem, draftOrder.selectedIngredients)
  
  await refresh()
}

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