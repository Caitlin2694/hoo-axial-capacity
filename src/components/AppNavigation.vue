<template>
  <v-app-bar app color="primary">
        <v-toolbar-title class="white--text">
        <v-img width="150" src="../assets/img/uwalogo.png"></v-img>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="goToHomePage()" class="ma-2">Go To Home</v-btn>
        <v-btn @click="goToCalculator()" class="ma-2">Go To Calculator</v-btn>
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