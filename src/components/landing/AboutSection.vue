<template>
  <section id="about">
    <v-container fluid>
      <v-row align="center" justify="center">
      <v-col cols="12" align=center justify="center">
       <v-btn
                rounded
                outlined
                large
                class="mt-5"
                :href="'/calculator?pile='+pile"
              >
                Press to Continue
                <v-icon class="ml-2">mdi-arrow-right</v-icon>
              </v-btn>
      </v-col>
        <v-col cols="10">

           <v-container fluid id="features" class="mt-2">
      <v-row align="center" justify="center">
        <v-col cols="10">
          <v-row align="center" justify="space-around">

            <v-col
              cols="12"
            >
              <v-hover v-slot:default="{ hover }">
              <div v-if="pile == 'driven'">
                <driven-about-info :hover="hover"></driven-about-info>
              </div>
              <div v-else-if="pile == 'bored'">
                <bored-about-info :hover="hover"></bored-about-info>
              </div>
              </v-hover>
            </v-col>

            
          </v-row>
        </v-col>
              <v-col cols="12" align=center justify="center">
         <v-btn
                rounded
                outlined
                large
                class="mt-5"
                :href="'/calculator?pile='+pile"
              >
                Press to Continue
                <v-icon class="ml-2">mdi-arrow-right</v-icon>
              </v-btn>
              </v-col>
      </v-row>
    </v-container>
 
          <!--<v-row align="center" justify="center">
            <v-col cols="12" md="7">
              <h1 class="font-weight-light display-2">Sobre</h1>
              <h1 class="font-weight-light display-1 mb-3">
                Lorem ipsum dolor!
              </h1>
              <v-row>
                <v-col cols="12" class="d-flex align-center">
                  <v-img
                    src="@/assets/img/icon1.svg"
                    max-width="60px"
                    class="mr-4"
                  />
                  <p class="text-justify">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  </p>
                </v-col>
                <v-col cols="12" class="d-flex align-center">
                  <v-img
                    src="@/assets/img/icon2.svg"
                    max-width="60px"
                    class="mr-4"
                  />
                  <p class="text-justify">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  </p>
                </v-col>
                <v-col cols="12" class="d-flex align-center">
                  <v-img
                    src="@/assets/img/icon3.svg"
                    max-width="60px"
                    class="mr-4"
                  />
                  <p class="text-justify">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  </p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="5" class="d-none d-md-flex">
              <v-img
                src="@/assets/img/ill1.svg"
                class="d-block ml-auto mr-auto"
                max-width="400px"
              />
            </v-col>
          </v-row>-->
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import DrivenAboutInfo from "./DrivenAboutInfo.vue";
import BoredAboutInfo from "./BoredAboutInfo.vue";

export default {
  components: { DrivenAboutInfo, BoredAboutInfo },
  name: "about",
  data() {
    return {
      pile: ""
    };
  },
  mounted() {
    // get URL param "pile"
    const urlParams = new URLSearchParams(window.location.search);
    const pile = urlParams.get("pile");
    if (pile) {
      this.pile = pile;
    }
  }
}
</script>


<style scoped>
#about {
  background-color: #f4f7f5;
}
</style>
