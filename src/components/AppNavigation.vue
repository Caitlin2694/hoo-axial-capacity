<template>
  <v-app-bar app color="primary">
        <v-toolbar-title class="white--text">LOGO</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="goToHomePage()" class="ma-2">Home</v-btn>
        <v-btn @click="goToCalculator()" class="ma-2">Calculator</v-btn>
  </v-app-bar>
</template>

<script>
export default {
    name: 'AppNavigation',
    methods: {
      goToCalculator() {
        this.$router.push({path:'calculator'});
      },
      goToHomePage() {
        this.$router.push({path:'/'});
      }
    }
};
</script>

<style scoped>
</style>