
<template>
    <v-app>
         <app-navigation></app-navigation>
         <v-main transition="slide-x-transition">
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
import AppNavigation from '@/components/AppNavigation';
//import HomePage from './components/HomePage.vue';
export default {
  name: 'App',
  components: {
       AppNavigation,
       //HomePage
   }
}
</script>

<style>
</style>
