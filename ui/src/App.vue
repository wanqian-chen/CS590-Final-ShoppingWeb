<template>
  <div>
    <b-navbar toggleable="lg" type="dark" :variant="user?.roles?.includes('operator') ? 'info' : 'primary'">
      <b-navbar-brand href="#">
        <span v-if="user?.name">Welcome, {{ user.name }}</span>
        <span v-else>Smoothie Stand</span>
      </b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item href="/">All Orders</b-nav-item>
        <b-nav-item id="order-now" v-if="user?.roles?.includes('customer')" href="/customer">Order Now</b-nav-item>
        <b-nav-item id="history-orders" v-if="user?.roles?.includes('customer')" href="/customer/history">History Orders</b-nav-item>
        <b-nav-item id="work-screen" v-if="user?.roles?.includes('operator')" href="/operator">My Work Screen</b-nav-item>
        <b-nav-item id="menu" v-if="user?.roles?.includes('operator')" href="/operator/menu">Menu</b-nav-item>
        <b-nav-item id="login" v-if="user?.name == null" href="/api/login">Login</b-nav-item>
        <b-nav-item id="logout" v-if="user?.name" @click="logout">Logout</b-nav-item>
        <form method="POST" action="/api/logout" id="logoutForm" />
      </b-navbar-nav>
    </b-navbar>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'

const user = ref({} as any)
provide("user", user)

onMounted(async () => {
  user.value = await (await fetch("/api/user")).json()
})

function logout() {
  ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
}
</script>