<template>
  <v-container class="mt-5 background">
    <v-card>
       <h1 class="pa-5">Output</h1>
       <v-row class="ma-2">
       <v-col cols=7>
       <h3 class="pa-3">File Name: {{this.site_name}}</h3>
       </v-col>
       <v-col cols=5>
       <download-csv
        class="v-btn primary ma-2"
        :data="inputs()"
        :name="'inputs_'+this.site_name+'.csv'">
        <v-btn >
          Download Input Parameters
        </v-btn>
      </download-csv>
      <download-csv
        class="v-btn primary ma-2"
        :data="output()"
        :name="this.site_name+'.csv'">
        <v-btn color="primary">
          Download Results
        </v-btn>
      </download-csv>
       </v-col>
       </v-row>
       <v-row class="ma-2">
          <v-col cols=7>
          <div>
            <results-graph class="ma-5" :result="chart_data" xaxis="Axial capacity (kN)" yaxis="Pile tip depth (m)" height="500"></results-graph>
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
                Tension Capacity (kN)
              </th>
              <th class="text-left">
                Compression Capacity (kN)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in data_dict"
              :key="item.tipdepth"
            >
              <td>{{ item.tipdepth }}</td>
              <td>{{ item.tension_capacity ? item.tension_capacity.toFixed(0) : 'N/A'}}</td>
              <td>{{ item.compression_capacity ? item.compression_capacity.toFixed(0) : 'N/A'}}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
          </v-col>
       </v-row>


      <div class="ma-5"> 
       <p>Thankyou for using our axial capacity calculator app! Click "back to input" to try different input data. Otherwise, click "go home" to go back to the home page. </p>
              <p class="text-body-2 mt-3 ml-1">This freeware is provided "AS IS", and you, its user, assume all risks when using it. Licenced under a <a href="/licence" target="_blank" class="tou">MIT license</a></p>
                    <v-row>
       <v-col>
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
      </v-col>
      <!--<v-col>
        <p class="font-weight-light mt-3">
                Contact us to learn more about our research group and methods.
              </p>
              <p class="font-weight-light mt-3">
                <strong>Email:</strong> barry.lehane@uwa.edu.au
              <p>
              <p class="font-weight-light mt-3">
                If you experience technical difficulties when using this application, please contact Hoo Solutions.
              </p>
              <p class="font-weight-light mt-3">
                <strong>Email:</strong> caitlin@hoosolutions.com.au
              </p>
      </v-col>-->
      </v-row>

      <v-row> <!-- todo: hide before deploy -->
      <download-csv
        class=""
        :data="debugParams()"
        name="param_debug_data.csv">
         <v-btn class="ma-2 mb-5"
          color="primary">
          Debug Params
        </v-btn>
      </download-csv>

      <download-csv
        class=""
        :data="debugResults()"
        name="result_debug_data.csv">
        <v-btn class="ma-2 mb-5"
          color="primary">
          Debug Results
        </v-btn>
      </download-csv>  
      </v-row>
            </div> 
    </v-card>
  </v-container>
</template>

<script>
import ResultsGraph from '../graphs/ResultsGraph.vue'
import JsonCSV from 'vue-json-csv'
//import JsonCSV from 'vue-json-csv'
export default {
  components: { ResultsGraph, 'downloadCsv': JsonCSV},
    props: ['chart_data', 'data_dict', 'site_name', 'user_input'],
    methods: {
      navHome() {
        this.$router.push({path:'/'});
        localStorage.removeItem('cpt');
        localStorage.removeItem('userInput')
      },
      navInput() {
        this.$router.push({path:'/'});
        this.$router.push({path:'/calculator'});
      },
      debugParams() {
        return JSON.parse(localStorage.getItem('param_dict'));
      },
      debugResults() {
        return JSON.parse(localStorage.getItem('res_dict'))
      },
      output() {
        return this.data_dict
      },
      inputs() {
        let list = [];
        list.push(this.user_input)
        return list;
      },
    }
}
</script>

<style scoped>
</style>