<template>
  <v-footer dark padless>
    <v-card flat tile class="secondary white--text text-center">
      <v-divider></v-divider>
      <v-card-text class="white--text">
        <strong>Developed by Hoo Solutions</strong>
      </v-card-text>
      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>Calango WEB</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<style scoped>
.v-card {
  width: 100%;
}
</style>

<script>
export default {
  data: () => ({
    icons: [
      {
        text: "mdi-facebook",
        link: "",
      },
      {
        text: "mdi-twitter",
        link: "",
      },
      {
        text: "mdi-linkedin",
        link: "",
      },
      {
        text: "mdi-instagram",
        link: "https://instagram.com/joabson_arley/",
      },
    ],
  }),
};
</script>
