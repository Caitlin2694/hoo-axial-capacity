<template>
  <section id="about">
    <v-container fluid>
      <v-row align="center" justify="center">
                                  <v-btn
                rounded
                outlined
                large
                class="mt-5"
                href="/calculator"
              >
                Press to Continue
                <v-icon class="ml-2">mdi-arrow-right</v-icon>
              </v-btn>
        <v-col cols="10">

           <v-container fluid id="features" class="mt-2">
      <v-row align="center" justify="center">
        <v-col cols="10">
          <v-row align="center" justify="space-around">

            <v-col
              cols="12"
            >
              <v-hover v-slot:default="{ hover }">
                <v-card
                  class="card"
                  shaped
                  :elevation="hover ? 10 : 4"
                  :class="{ up: hover }"
                >
                  <h1 class="font-weight-regular text-center mt-5">	Description of the Unified CPT method for driven piles</h1>
                  <v-row>
                  <v-col cols=7>
                    <h4 class="font-weight-regular subtitle-1 ma-5">
                      The formulations employed by the program are described in the following publications:<br> 
                      <br><strong> <a href="sand.pdf">Sand Method</a> </strong> <br> Lehane B.M., Liu Z,. Bittar E., Nadim F., Lacasse S., Jardine R.J., Carotenuto P., Jeanjean P., Rattley M., Gavin K., Gilbert R., Haavik J. and Morgan N. (2020). A new CPT-based axial pile capacity design method for driven piles in sand. Proc 4th Int. Symposium on Frontiers in Offshore Geotechnics, ISFOG-4, Austin, Texas. 
                      <br><br><strong> <a href="clay.pdf">Clay and silt method</a> </strong> <br> Lehane B.M., Liu Z., Bittar E., Nadim F., Lacasse S., Bozorgzadeh N., Jardine R.J., Ballard J-C, Carotenuto P., Gavin K., Gilbert R.B., Bergan-Haavik J., Jeanjean P. and Morgan N. (2021). CPT-based axial pile capacity design method for driven piles in clay. J. Geotech. & Geoenv. Engng., ASCE (under review) 
                    </h4>
                    <h4 class="font-weight-regular subtitle-1 ma-5">Special thanks to Eduardo Bittar for significant contributions to coding and checking of this program.</h4>
                  </v-col>
                  <v-col cols=5>
                    <v-img src="@/assets/img/img.png" height="350" contain></v-img>
                  </v-col>
                  </v-row>
                </v-card>
              </v-hover>
            </v-col>

            <v-col
              cols="12"
              class="text-center"
            >
              <v-hover v-slot:default="{ hover }">
                <v-card
                  class="card"
                  shaped
                  :elevation="hover ? 10 : 4"
                  :class="{ up: hover }"
                >
                  <h4 class="font-weight-regular subtitle-1 mt-8">
                    The Unified CPT method was developed as part of a joint Industry project (JIP) managed by the <strong>Norwegian Geotechnical Institute</strong> in collaboration with <strong>The University of Western Australia</strong>. The JIP was supported by Equinor, Lundin Oil, Ørsted, ONGC, BP, TOTAL, ExxonMobil, EnBW, EDF, Aramco, SSER and HDEC.
                  </h4>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-col>
                            <v-btn
                rounded
                outlined
                large
                class="mt-5"
                href="/calculator"
              >
                Press to Continue
                <v-icon class="ml-2">mdi-arrow-right</v-icon>
              </v-btn>
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

<style scoped>
#about {
  background-color: #f4f7f5;
}
</style>
