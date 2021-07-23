<template>
  <v-container class="mt-5 background">
  <email-signup></email-signup>
  <div v-if="!calculatePressed">
    <calculator-input></calculator-input>
  </div>
  </v-container>
</template>

<script>
import EmailSignup from './calculator/EmailSignup.vue';
import CalculatorInput from './calculator/CalculatorInput.vue';
  export default {
  components: {
    EmailSignup,
    CalculatorInput,
  },
}
</script>

<style scoped>
.background {
  background-color: #f5f7f5;
}
</style>