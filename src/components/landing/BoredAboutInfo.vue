<template>
    <v-card
                  class="card"
                  shaped
                  :elevation="hover ? 10 : 4"
                  :class="{ up: hover }"
                >
                  <h1 class="font-weight-regular text-center mt-5">	Description of Bored and CFA piles axial capacity calculator</h1>
                  <v-row>
                 <v-col cols=3>
                    <v-img class="ml-5" src="@/assets/img/img2.png" height="200" contain></v-img>
                  </v-col>
                  <v-col cols=6>
                  <h4 class="font-weight-regular subtitle-1 ma-5">
                    This program uses CPT data to calculate
                    the axial capacity of bored piles using
                    the method described in Doan &#38; Lehane
                    (2021) <br> <a href="bored.pdf">Link to publication</a>
                  </h4>
                  </v-col>
                  <v-col cols=3>
                    <v-img src="@/assets/img/img3.png" height="200" contain></v-img>
                  </v-col>
                  </v-row>
        </v-card>
</template>

<script>
export default {
    props:["hover"]
}
</script>
