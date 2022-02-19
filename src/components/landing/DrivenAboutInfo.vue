<template>
<div>
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
                <v-row>
                <v-col
              cols="12"
              class="text-center"
            >
              <v-hover v-slot:default="{ hover }">
                <v-card
                  class="card"
                  shaped
                  :elevation="hover ? 10 : 4"
                  :class="{ up: hover } + ' mt-4'"
                >
                  <h4 class="font-weight-regular subtitle-1 mt-8">
                    The Unified CPT method was developed as part of a joint Industry project (JIP) managed by the <strong>Norwegian Geotechnical Institute</strong> in collaboration with <strong>The University of Western Australia</strong>. The JIP was supported by Equinor, Lundin Oil, Ørsted, ONGC, BP, TOTAL, ExxonMobil, EnBW, EDF, Aramco, SSER and HDEC.
                  </h4>
                </v-card>
              </v-hover>
            </v-col>
                </v-row>
</div>
</template>

<script>
export default {
    props:["hover"]
}
</script>
