<template>
  <v-container class="mt-5 background">
    <v-card>
       <h1 class="pa-5">Output</h1>
       <v-row class="ma-2">
          <v-col cols=7>
          <div>
            <results-graph class="ma-5" :result="chart_data" xaxis="Axial capacity (MN)" yaxis="Pile tip depth (m)" height="300"></results-graph>
          </div>
          </v-col>
           <v-col cols=5>
             <v-simple-table fixed-header class="mt-5" height="300px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Pile tip depth (m)
              </th>
              <th class="text-left">
                Tension Capacity (MN)
              </th>
              <th class="text-left">
                Compression Capacity (MN)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in data_dict"
              :key="item.tipdepth"
            >
              <td>{{ item.tipdepth }}</td>
              <td>{{ item.tension_capacity }}</td>
              <td>{{ item.compression_capacity}}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
          </v-col>
       </v-row>

      <div class="ma-5">  
       <p>Thankyou for using our axial capacity calculator app! Click "back to input" to try different input data. Otherwise, click "go home" to go back to the home page. </p>
       <v-btn class="ma-2 mb-5"
        color="primary"
        @click="navInput()"
      >
        Back to Input
      </v-btn>

      <v-btn class="ma-2 mb-5"
        color="primary"
        @click="navHome()"
      >
        Go Home
      </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import ResultsGraph from '../graphs/ResultsGraph.vue'
export default {
  components: { ResultsGraph },
    props: ['chart_data', 'data_dict'],
    methods: {
      navHome() {
        this.$router.push({path:'/'});
      },
      navInput() {
        this.$router.push({path:'/'});
        this.$router.push({path:'/calculator'});
      }
    }
}
</script>
