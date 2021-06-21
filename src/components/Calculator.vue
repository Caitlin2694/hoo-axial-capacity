<template>
  <v-container class="mt-5 background">

  <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Enter Your Email
        </v-card-title>
        <v-card-text>To use this app, we ask that you enter your email address and affiliaiton. The purpose of this is so that we can see who is using our app!</v-card-text>
           <v-card-text>
              <v-text-field
                label="Email"
                type="email"
                :rules="[rules.required]"
                placeholder="myemail@email.com"
                :value="email"
              ></v-text-field> 
              <v-text-field
                label="Affiliation"
                type="text"
                placeholder="The University of Western Australia"
                :rules="[rules.required]"
                :value="affilliation"
              ></v-text-field> 
           </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false, navHome()"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false, saveEmail()"
          >
            Continue
          </v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

  <div v-if="!calculatePressed">
  <v-stepper
    v-model="e6"
    vertical
  >
  <h1 class="ma-5">Inputs</h1>
    <v-stepper-step
      :complete="e6 > 1"
      step="1"
    >
      Upload CPT data and enter water depth
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-card
        class="mb-12"
      >
     <div>
     <div class="pt-3">
     <p>Please up load a CSV or TXT file containing the following data in the ordr indicated</p>
          <v-file-input
          label="Click here to select a .csv or .txt file"
          @change="selectFile"
          accept=".csv,.txt"
          ></v-file-input>
     </div>

    <v-card>
      <v-simple-table dense fixed-header height="250px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Depth (m)
              </th>
              <th class="text-left">
                Cone resistance q<sub>c</sub> (MPa)
              </th>
              <th class="text-left">
                Cone sleeve friction, f<sub>s</sub> (kPa)
              </th>
              <th class="text-left">
                Unit weight (kN/m<sup>3</sup>)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in cpt_data_table"
              :key="item.z"
            >
              <td>{{ item.z }}</td>
              <td>{{ item.qc }}</td>
              <td>{{ item.fs }}</td>
              <td>{{ item.gtot }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

        <v-row class="mx-2 my-4">
          <v-col cols=6>
             <p>Depth of water table below ground level (m) <br> Enter zero for offshore site <br> only hyrostatic conditions are considered in this version</p>
          </v-col>
          <v-col>
            <v-text-field
              label="Enter depth of water table"
              placeholder="0"
              outlined
              v-model="userInput.rlWaterTable"
              type="number"
            ></v-text-field>  <!-- todo: figure out if this is rl ground level or rl water table-->
          </v-col>
        </v-row>

      </v-card>

      </div>
      </v-card>
      <v-btn
        color="primary"
        @click="e6 = 2, preInputCalc()"
      >
        Check Data Entry
      </v-btn>
      <v-btn text>
        Cancel
      </v-btn>
    </v-stepper-content>

    <v-stepper-step
      :complete="e6 > 2"
      step="2"
    >
      View CPT data
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-card>
      <v-row>
        <v-col>
          <generic-graph :result="qt_depth_chart_data" xaxis="qt (MPa)" yaxis="depth" height="500"></generic-graph>
        </v-col>
        <v-col>
           <generic-graph :result="fr_percent_depth_chart_data" xaxis="F (%)" height="500"></generic-graph>
        </v-col>
        <v-col>
          <generic-graph :result="lc_depth_chart_data" xaxis="lc" height="500"></generic-graph>
        </v-col>
      </v-row>
       <v-btn
        color="primary"
        @click="e6 = 3"
      >
        Accept CPT Data
      </v-btn>
      <v-btn text
        @click="e6 = 1"
      >
        Change CPT Data
      </v-btn>
      </v-card>
    </v-stepper-content>


    <v-stepper-step
      :complete="e6 > 3"
      step="3"
    >
      Enter Pile Information
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-card
        class="mb-12"
      >
      <div class="pa-5">
      <v-text-field
            label="Site Name"
            placeholder="Los Coyotes"
            v-model="userInput.siteName"
          ></v-text-field>
       <v-row class="mb-3">
       <v-col>
       <p>Pile Shape</p>
       <v-btn-toggle
          v-model="userInput.pileShape"
          mandatory
        >
          <v-btn>
            Circular <v-icon>mdi-circle-outline</v-icon>
          </v-btn>
          <v-btn>
            Square <v-icon>mdi-crop-square</v-icon>
          </v-btn>
        </v-btn-toggle>
       </v-col>
       <v-col>
        <p>Pile End Condition</p>
         <v-btn-toggle
          v-model="userInput.pileEndCondition"
          mandatory
        >
          <v-btn>
            Open <v-icon>mdi-window-open</v-icon>
          </v-btn>
          <v-btn>
            Closed <v-icon>mdi-window-closed</v-icon>
          </v-btn>
        </v-btn-toggle>
        </v-col>
        </v-row>
          <v-text-field v-if="this.userInput.pileEndCondition == 0 && this.userInput.pileShape == 0"
            label="Pile Wall Thickness (mm)"
            :rules="[rules.required]"
            type="number"
            placeholder="0.333248"
            v-model="userInput.nominalSizeDiMM"
          ></v-text-field>
          <v-text-field
            label="Pile Diameter or side width (m)"
            type="number"
            :rules="[rules.required, rules.counter]"
            placeholder="0.3556"
            v-model="userInput.nominalSizeDoN"
          ></v-text-field>
          <v-text-field
            label="Tip depth of cased borehole (friction is ignored from ground level to over this depth)"
            type="number"
            placeholder="0"
            :rules="[rules.required]"
            v-model="userInput.tipdepth"
          ></v-text-field> 
          <v-btn class="my-2" @click="addTipDepth()">Add More Pile Tip depths for analysis</v-btn>
          <div class="form-row" v-for="(t, index) in tipdepth_values" :key="index">
            <v-text-field
            type="number"
            label="tip depth of cased borehole (m)"
            v-model="t.value"
          ></v-text-field>
      </div>
          </div>
      </v-card>
      <v-btn
        color="primary"
        @click="e6 = 4"
      >
        Continue
      </v-btn>
      <v-btn text>
        Cancel
      </v-btn>
    </v-stepper-content>
    
    <v-stepper-step
      :complete="e6 > 3"
      step="4"
    >
      Calculate
    </v-stepper-step>

    <v-stepper-content step="4">
      <v-card>

      <v-btn class="ma-5" dark @click="calculate()">Calculate</v-btn> 
      </v-card>
    </v-stepper-content>
  </v-stepper>
  </div>
<div v-if="calculatePressed">

       <!--<download-excel :data="res_dict" class="v-btn mb-5" dark>
          CLICK HERE TO DOWNLOAD DATA
        </download-excel>
       <output-chart :result="chart_res"></output-chart>
       <v-row>
       <v-col>
        <adop-depth-graph :result="adop_depth_chart_data"></adop-depth-graph>
       </v-col>
      <v-col>
        <lc-depth-graph :result="lc_depth_chart_data"></lc-depth-graph>
       </v-col>
        <v-col>
        <iz-1-depth-graph :result="iz1_depth_chart_data"></iz-1-depth-graph>
       </v-col>
       </v-row>-->

      <v-card>
       <h1 class="pa-5">Output</h1>
       <v-row class="ma-2">
          <v-col cols=7>
          <div>
            <results-graph  class="ma-5" :result="tipdepth_chart_data" xaxis="Axial capacity (MN)" yaxis="Pile tip depth (m)" height="300"></results-graph>
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
              v-for="item in tipdepth_res_dict"
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


        <!--<v-select
          :items="param_dict"
           v-model="paramsIndex"
          label="Select a depth to see calculated parameters"
          item-text="depth"
          item-value="index"
        ></v-select>
        <p>Calculated results for depth: {{paramsIndex ? param_dict[paramsIndex] : 'Not chosen'}}</p>
               <v-select
          :items="res_dict"
           v-model="resIndex"
          label="Select a depth to see calculated parameters"
          item-text="depth"
          item-value="index"
        ></v-select>
        <p>Calculated parameters for depth: {{resIndex ? res_dict[resIndex] : 'Not chosen'}}</p>-->
       </div>
  </v-container>
</template>

<script>

  // todo: ask barry about this: Note, Eduardo/Caitlin, we need to allow for case where the qt data are widely spaced (ie depth increments are large) and hence the program needs to interpolate a minimum number of values – probably best done in this module before calculation
  //import OutputChart from './OutputChart.vue'
  //import AdopDepthGraph from './graphs/AdopDepthGraph.vue'
  //import JsonExcel from "vue-json-excel";
  //import LcDepthGraph from './graphs/LcDepthGraph.vue';
//import Iz1DepthGraph from './graphs/Iz1DepthGraph.vue';
import GenericGraph from './graphs/GenericGraph.vue';
import ResultsGraph from './graphs/ResultsGraph.vue';
  export default {
  components: {
    //OutputChart,
    //'download-excel': JsonExcel,
    //AdopDepthGraph,
    //LcDepthGraph,
    //Iz1DepthGraph,
    GenericGraph,
    ResultsGraph,
  },
  data() {
    return {
    rules: {
        required: value => !!value || 'Required.',
        counter: value => value < 10 || 'Please enter dimensions in metres',
    },
    dialog: false,
    e6: 1,
    checkbox: true,
    tipdepth_values: [], //todo: run multiple tests
    cpt_data_table: [{z: '0.01', 'fs':'4.186', 'qc':'-1.34', 'gtot':'19.65'}],
    paramsIndex: null,
    res_dict_iterated: [],
    tipdepth_chart_data: [],
    param_dict: [],
    res_dict: [], 
    tipdepth_res_dict: [],
    chart_res: [],
    cpt_dict: [],
    qtf_chart_res: [],
    qtf_chart_res_2: [],
    adop_depth_chart_data: [],
    lc_depth_chart_data: [],
    iz1_depth_chart_data: [],
    fr_percent_depth_chart_data: [],
    qt_percent_depth_chart_data: [],
    output_chart_data: [],
    final_result: 0,
    resIndex: null,
    calculatePressed: false,
    chosenFile: null, // <- initialize the v-model prop,
    gtot_input_values: [{
        startPoint: '0.05',
        endPoint: '0.55',
        value: '19.65'
    },
    {
        startPoint: '0.6',
        endPoint: '2.4',
        value: '15.72'
    },
    {
        startPoint: '2.45',
        endPoint: '3.95',
        value: '17.29'
    },
    {
        startPoint: '4',
        endPoint: '4.95',
        value: '18.87'
    },
    {
        startPoint: '5',
        endPoint: '7.7',
        value: '20.44'
    },
    {
        startPoint: '7.75',
        endPoint: '12.4',
        value: '20.4'
    }],
    userInput: {
      siteName: "Los Coyotes",
      pileShape: 0,
      pileEndCondition: 0,
      nominalSizeDoN: 0.3556,
      nominalSizeT: 11.176,
      nominalSizeDiMM: 0.333248,
      pilePerimeter: 1.11715032856,
      rlGroundLevel: 0,
      rlWaterTable: 0,
      tipdepth: 5
    },
    cpt_data: ['hello', 'world']
    }
  },
  created() {
    this.param_dict = JSON.parse(localStorage?.param_dict);
    this.res_dict = JSON.parse(localStorage.res_dict);
    this.setResultData();

    // if email not set
    if (!localStorage.getItem('email')) {
      this.dialog = true;
    }

  },
  mounted() {
    // todo: clear email from local storage on window close
    //window.onbeforeunload = function () {
    //  localStorage.removeItem('email')
    //}
  },
  methods: {
    selectFile() {
         /* return first object in FileList */
            var file = event.target.files[0];
            var _this = this; // save it in a variable for usage inside function
            this.$papa.parse(file, {
                header: false,
                complete: function (results) {
                    _this.cpt_data = results.data;
                    let temp_table_data = []
                    for (let i = 0; i< _this.cpt_data.length; i++) {
                        temp_table_data.push({
                          'z': _this.cpt_data[i][0],
                          'qc': _this.cpt_data[i][1],
                          'fs': _this.cpt_data[i][2],
                          'gtot': _this.cpt_data[i][3]
                        })
                    }
                    _this.cpt_data_table = temp_table_data;
                }
            });


    },
    calculate() {
      // push original tipdepth value
      this.tipdepth_values.push({value: this.userInput.tipdepth});
      // sort from low to high
      this.tipdepth_values.sort(this.getTipdpthValue)

      // perform all calcs for each tipdepth
      for (let i=0; i<this.tipdepth_values.length; i++) {
        let res =  this.processInputParameters(parseInt(this.tipdepth_values[i].value)); //todo: not sure why we must parse int here
        this.res_dict_iterated.push(res) // creates 2D array of res.
      }

      this.setTipDepthChartData();
      
    },
    getTipdpthValue(item, nextitem) {
        return item.value - nextitem.value;
    },
    processInputParameters(tip) {
      var depth, h, qc, qt, gtot, u0_kpa, sig_v0, sig_v0_prime, fs, fr_percent, lc, n, qtn, bq, kc,iz1, qtc, qp;
      depth = []
      h = [] 
      qc = [];
      //u2_kpa = [];// todo: check other notebook to see if u2 should be imported by the user
      qt = [];
      gtot = []; // todo: should do fancy input thing
      u0_kpa = [];
      sig_v0 = [];
      sig_v0_prime = [];
      fs = [];
      fr_percent = [];
      qtn = [];
      n = [];
      lc = [];
      bq = [];
      kc = [];
      iz1 = [];
      qtc = [];
      qp = [];

      let tension_capacity = null;
      let compression_capacity = null; 

      const parsed_cpt_data = JSON.parse(JSON.stringify(this.cpt_data))
      for (const row of parsed_cpt_data) {
       let depth_value = parseFloat(row[0]); // get first column of input
       depth.push(depth_value);
       h.push(tip - depth_value);

       let qc_value = parseFloat(row[1]); // get second column of input
       qc.push(qc_value);

       let fs_value = parseFloat(row[2])
       fs.push(fs_value);

       // advanced: add U2

       let gtot_value = parseFloat(row[3]) // todo: todo, populate with gtot input
       gtot.push(gtot_value);
      }
      
      for (let i=0; i<depth.length; i++) {
        // advanced correct qt with u2
        qt.push(qc[i]) 

        let u0_value;
        if (depth[i]<this.userInput?.rlWaterTable) { 
          u0_value = 0;
        } else {
          u0_value = (depth[i]-this.userInput?.rlWaterTable)*9.81 
        }
        u0_kpa.push(u0_value)

        let sig_v0_value;
        if (this.userInput?.rlWaterTable < 0) {
          sig_v0_value = depth[i]*gtot[i]+(Math.abs(this.userInput?.rlWaterTable)*9.81); 
        } else {
          sig_v0_value = depth[i]*gtot[i]
        }
        sig_v0.push(sig_v0_value)

        let sig_v0_prime_value = sig_v0_value - u0_value;
        sig_v0_prime.push(sig_v0_prime_value)

        let fr_percent_value = fs[i]/(qc[i]*1000-sig_v0_value)*100
        fr_percent.push(fr_percent_value);

        let flag = 0;
        let n_estimate = 0.01;
        let n_value = 0;
        let lc_value = 0;
        for (let j=1; j <= 10000; j++) {
          if (flag == 0) {
            let qtn_value = ((1000*qt[i]-sig_v0_value)/100)*Math.pow((100/sig_v0_prime_value),n_estimate); //todo: check if qc or qt
            lc_value = Math.pow((Math.pow((3.47-Math.log10(qtn_value)), 2) + Math.pow((Math.log10(fr_percent_value)+1.22), 2)), 0.5)
            n_value = 0.381*lc_value+0.05*(sig_v0_prime_value/100)-0.15;
            if (n_value > 1) {n_value == 1.00}
            if (Math.abs(n_estimate - n_value) < 0.001) {  
              qtn.push(qtn_value);
              lc.push(lc_value);
              n.push(n_value)
              flag = 1;
            } else {
              n_estimate = n_estimate + 0.001
            }
          } else {
            break; // todo: what to do if it never converges?
          }
        }

        let bq_value = ((-u0_kpa[i])/(qt[i]*1000-sig_v0_value)) //advanced: correct this with u2
        bq.push(bq_value); 

        let kc_value = 0;
        if (lc[i] < 2.05) { //advanced: allow users to modify this value
          kc_value = 1;
        } else if (lc[i] > 2.5) { //advanced: allow users to modify this value
          kc_value = 1;
        } else {
          kc_value = -0.403*Math.pow(lc[i], 4)+5.581*Math.pow(lc[i],3)-21.63*Math.pow(lc[i], 2)+33.75*lc[i]-17.88-0.4
        }
        kc.push(kc_value);

        let qtc_value = kc[i] * qt[i];
        qtc.push(qtc_value);
        
    }

      // base capacity calculation
      let qt_2 = [] 
      let qb_sand = [];
      let qb_clay = [];
      let don_value = this.userInput?.nominalSizeDoN;
      for (let i=0; i<depth.length; i++) {
        let qt_2_value = 0
        qt_2.push(0) 
        qp.push(0)

        // qp calculation from macro (simple method).

        // todo: replace qt_2 with qp (calculated with one of 3 macros)

        let ar_value = 1;
        if (this.userInput?.pileEndConsition != 1) { //closed
          ar_value = 1-0.980*(Math.pow(don_value-2*11.176/1000, 2))/(Math.pow(don_value, 2)); //TODO:figure out what 11.176 is and CALC 0.980
        }
        let area_value = Math.PI*don_value*don_value*0.25; 
        let qb_sand_value = qt_2_value*1000*(0.15+0.45*ar_value)*area_value;
        qb_sand.push(qb_sand_value)

        let qb_clay_value = 0;
        if (this.userInput?.pileEndCondition == 1) { //closed
          qb_clay_value = (0.8*qt[i]*1000)*area_value;
        } else {
          qb_clay_value = (0.4*qt[i]*1000)*area_value;
        }
        qb_clay.push(qb_clay_value);
     }

     // shaft capacity calculation
     let d_star = 0;
     if (this.userInput?.pileEndCondition == 1) { //closed
       d_star = don_value
     } else {
       d_star = Math.sqrt(Math.pow(don_value, 2)- Math.pow(0.333248, 2))
     }

    let coe_casing = [];
    let delta_ord = []
    let orc = [];
    let tf_sand = [];
    let tf_clay = [];
    let tf_adop = [];
    let qs = [];
     for (let i=0; i<depth.length; i++) {
      if (depth[i] >=15) {
        coe_casing.push(0)
      } else {
        coe_casing.push(1); //todo: calculate this properly as per B17 in Processed Data 2.
      }
      if (coe_casing[i] == 0) {
          delta_ord.push(0);
          orc.push(0);
          tf_sand.push(0);
          tf_adop.push(0);
      } else {
        if (lc[i]<2.5) { // advanced: allow users to modify this
          let delta_ord_value = (1000*qtc[i]*0.1)*Math.pow((1000*qtc[i]/sig_v0_prime[i]), -0.33)*(35.7/(1000*don_value))
          if (delta_ord_value.toString() == "NaN") { //todo: figure out what to do if imaginary number
             delta_ord_value = 0;
          }
          delta_ord.push(delta_ord_value) 
           
          let are = 1.000 //todo: figure out are calc.
          orc.push(((qtc[i]*1000)/44)*Math.pow(are, 0.3)*Math.pow(Math.max(1, (h[i]/don_value)), -0.4)) 
          tf_sand.push(coe_casing[i]*(delta_ord[i]+orc[i])*0.554);
        } else {
          delta_ord.push(0);
          orc.push(0);
          tf_sand.push(0);
        }
      }
      tf_clay.push(0.07*qt[i]*1000*coe_casing[i]*Math.pow(Math.max(1,h[i]/d_star), -0.25))
      iz1.push(qtn[i]-12*Math.exp(-1.4*fr_percent[i]))
      if (iz1[i]<0) { 
        tf_adop.push(0.5*tf_clay[i]);
      } else {
        if(lc[i]>2.5) { // advanced: allow user to modify this.
          tf_adop.push(tf_clay[i]);
        } else {
          tf_adop.push(0.75*tf_sand[i])
        }
      }

      let delta_z = 0;
      if (i == 0) {
        delta_z = depth[i]-0
        qs.push(tf_adop[i]*this.userInput?.pilePerimeter*(delta_z)+0) 
      } else {
        delta_z = depth[i]-depth[i-1] 
        qs.push(tf_adop[i]*this.userInput?.pilePerimeter*(delta_z)+(qs[i-1])) 
      }
     }

     // calculate total capacity
     let qt_res= [];
     let qb = [];
    for (let i=0; i<depth.length; i++) {
      if (lc[i] < 2.05) { // advanced: allow user to modify this (this is when it is sand)
        qb.push(qb_sand[i]);
      } else {
        qb.push(qb_clay[i]);
      }
     qt_res.push(qs[i]+qb[i])
    }
     
    // calcuate final results

    let lookup_index = depth.indexOf(tip)
    let lookup_result = qs[lookup_index];
    compression_capacity = (lookup_result/1500).toFixed(3) //todo: don't use 1500, final numbers are qs, qb and qt.
    lookup_index = depth.indexOf(tip)
    lookup_result = qt_res[lookup_index];
    tension_capacity = (lookup_result/1500).toFixed(3) 

    // todo: check why compression and tenson capacities are the same

     //create dictionaries
    var param_dict_temp = [];
    var res_dict_temp = [];
    for (let i=0; i<depth.length; i++) {
      param_dict_temp.push({
        index: i,
        depth: depth[i],
        h: h[i],
        fr_percent: fr_percent[i],
        qt: qt[i],
        gtot: gtot[i],
        u0_kpa: u0_kpa[i],
        sig_v0: sig_v0[i],
        sig_v0_prime: sig_v0_prime[i],
        lc: lc[i],
        qtn: qtn[i],
        n: n[i],
        bq: bq[i],
        kc: kc[i],
        qtc: qtc[i]
      })

      res_dict_temp.push({
        index: i,
        depth: depth[i],
        fr: fr_percent[i], 
        delta_ord: delta_ord[i],
        orc: orc[i],
        tf_sand: tf_sand[i],
        tf_clay: tf_clay[i],
        tf_adop: tf_adop[i],
        qb_sand: qb_sand[i],
        qb_clay: qb_clay[i],
        iz1: iz1[i],
        lc: lc[i],
        qs: qs[i],
        qb: qb[i],
        qt_res: qt_res[i],
      })

    }
    this.param_dict = param_dict_temp;
    this.res_dict = res_dict_temp;
    localStorage.param_dict = JSON.stringify(param_dict_temp);
    localStorage.res_dict = JSON.stringify(res_dict_temp);
    this.tipdepth_res_dict.push({'tipdepth': tip, 'tension_capacity': tension_capacity, 'compression_capacity': compression_capacity})

    //this.setResultData()
    //this.setAdopDepthChartData()
    //this.setIcDepthChartData()
    //this.setIz1DepthChartData()

    this.calculatePressed = true;

        return res_dict_temp;

    },
    preInputCalc() {
      var depth, h, qc, qtn, n, qt, gtot, u0_kpa, sig_v0, sig_v0_prime, fs, fr_percent, lc;
      depth = []
      h = [] 
      qc = [];
      qt = [];
      gtot = []; // todo: should do fancy input thing
      u0_kpa = [];
      sig_v0 = [];
      sig_v0_prime = [];
      fs = [];
      fr_percent = [];
      n = [];
      lc = [];
      n = [];
      qtn = [];
      const parsed_cpt_data = JSON.parse(JSON.stringify(this.cpt_data))
      for (const row of parsed_cpt_data) {
       
       let depth_value = parseFloat(row[0]); // get first column of input
       depth.push(depth_value);
       h.push(this.userInput.tipdepth - depth_value); //todo: check if this is ok.

       let qc_value = parseFloat(row[1]); // get second column of input
       qc.push(qc_value);

       let fs_value = parseFloat(row[2])
       fs.push(fs_value);

       // advanced: add U2

       let gtot_value = parseFloat(row[3]) // todo: todo, populate with gtot input
       gtot.push(gtot_value);
      }
      
      for (let i=0; i<depth.length; i++) {
        // advanced correct qt with u2
        qt.push(qc[i]) 
        let u0_value;
        if (depth[i]<this.userInput?.rlWaterTable) { 
          u0_value = 0;
        } else {
          u0_value = (depth[i]-this.userInput?.rlWaterTable)*9.81 
        }
        u0_kpa.push(u0_value)

        let sig_v0_value;
        if (this.userInput?.rlWaterTable < 0) {
          sig_v0_value = depth[i]*gtot[i]+(Math.abs(this.userInput?.rlWaterTable)*9.81); 
        } else {
          sig_v0_value = depth[i]*gtot[i]
        }
        sig_v0.push(sig_v0_value)

        let sig_v0_prime_value = sig_v0_value - u0_value;
        sig_v0_prime.push(sig_v0_prime_value)

        let fr_percent_value = fs[i]/(qc[i]*1000-sig_v0_value)*100
        fr_percent.push(fr_percent_value);

        let flag = 0;
        let n_estimate = 0.01;
        let n_value = 0;
        let lc_value = 0;
        for (let j=1; j <= 10000; j++) {
          if (flag == 0) {
            let qtn_value = ((1000*qt[i]-sig_v0_value)/100)*Math.pow((100/sig_v0_prime_value),n_estimate); //todo: check if qc or qt
            lc_value = Math.pow((Math.pow((3.47-Math.log10(qtn_value)), 2) + Math.pow((Math.log10(fr_percent_value)+1.22), 2)), 0.5)
            n_value = 0.381*lc_value+0.05*(sig_v0_prime_value/100)-0.15;
            if (n_value > 1) {n_value == 1.00}
              if (Math.abs(n_estimate - n_value) < 0.001) { 
                qtn.push(qtn_value);
                lc.push(lc_value);
                n.push(n_value)
                flag = 1;
              } else {
                n_estimate = n_estimate + 0.001
              }
          } else {
            break; // todo: what to do if it never converges?
          }
        }
      }

      let cpt_dict_temp = []
      for (let i=0; i<depth.length; i++) {
        cpt_dict_temp.push({
          index: i,
          depth: depth[i],
          h: h[i],
          fr_percent: fr_percent[i],
          qt: qt[i],
          gtot: gtot[i],
          u0_kpa: u0_kpa[i],
          sig_v0: sig_v0[i],
          sig_v0_prime: sig_v0_prime[i],
          lc: lc[i],
          qtn: qtn[i],
          n: n[i]
        })
      }
      this.cpt_dict = cpt_dict_temp;
      this.createCPTCharts();
    },
    setResultData() {
    let y_values = this.res_dict.map(({depth}) => depth);
    let x_values = this.res_dict.map(({qt_res}) => qt_res);
    let chart_data = [];
    for (let i=0; i<x_values.length; i++) {
      var valueToPush = new Array();
      valueToPush[0] = x_values[i];
      valueToPush[1] = y_values[i];
      chart_data.push(valueToPush);
    }
    this.chart_res = chart_data;
  },
  setAdopDepthChartData() {
    let y_values = this.res_dict.map(({depth}) => depth);
    let x_values = this.res_dict.map(({tf_adop}) => tf_adop);
    let chart_data = [];
    for (let i=0; i<x_values.length; i++) {
      var valueToPush = new Array();
      valueToPush[0] = x_values[i];
      valueToPush[1] = y_values[i];
      chart_data.push(valueToPush);
    }
    this.adop_depth_chart_data = chart_data;
  },
  setIz1DepthChartData() {
    let y_values = this.res_dict.map(({depth}) => depth);
    let x_values = this.res_dict.map(({iz1}) => iz1);
    let chart_data = [];
    for (let i=0; i<x_values.length; i++) {
      var valueToPush = new Array();
      valueToPush[0] = x_values[i];
      valueToPush[1] = y_values[i];
      chart_data.push(valueToPush);
    }
    this.iz1_depth_chart_data = chart_data;
  },
  setIcDepthChartData() {
    let y_values = this.res_dict.map(({depth}) => depth);
    let x_values = this.res_dict.map(({lc}) => lc);
    let chart_data = [];
    for (let i=0; i<x_values.length; i++) {
      var valueToPush = new Array();
      valueToPush[0] = x_values[i];
      valueToPush[1] = y_values[i];
      chart_data.push(valueToPush);
    }
    this.lc_depth_chart_data = chart_data;
  },
  setTipDepthChartData() {
    let y_values = this.tipdepth_res_dict.map(({tipdepth}) => tipdepth);
    let x_values_compression = this.tipdepth_res_dict.map(({compression_capacity}) => compression_capacity);
    let x_values_tension = this.tipdepth_res_dict.map(({tension_capacity}) => tension_capacity);
    let chart_data = [];
    for (let i=0; i<y_values.length; i++) {
      var valueToPush = new Array();
      valueToPush[0] = x_values_tension[i];
      valueToPush[2] = x_values_compression[i];
      valueToPush[1] = y_values[i];
      chart_data.push(valueToPush);
    }
    this.tipdepth_chart_data = chart_data;

  },
  downloadXLSXFile() {

  },
  addTipDepth() {
      this.tipdepth_values.push({
        value: ''
      })
  },
  log(base, number) {
   return Math.log(number) / Math.log(base);
  },
  createCPTCharts() {

    // qt graph
    let y_values = this.cpt_dict.map(({depth}) => depth);
    let x_values = this.cpt_dict.map(({qt}) => qt);
    let chart_data = [];
    for (let i=0; i<x_values.length; i++) {
      var valueToPush = new Array();
      valueToPush[0] = x_values[i];
      valueToPush[1] = y_values[i];
      chart_data.push(valueToPush);
    }
    this.qt_depth_chart_data = chart_data;

    // lc graph
    y_values = this.cpt_dict.map(({depth}) => depth);
    x_values = this.cpt_dict.map(({lc}) => lc);
     chart_data = [];
    for (let i=0; i<x_values.length; i++) {
      valueToPush = new Array();
      valueToPush[0] = x_values[i];
      valueToPush[1] = y_values[i];
      chart_data.push(valueToPush);
    }
    this.lc_depth_chart_data = chart_data;

  // fr percent graph
    y_values = this.cpt_dict.map(({depth}) => depth);
    x_values = this.cpt_dict.map(({fr_percent}) => fr_percent);
    chart_data = [];
    for (let i=0; i<x_values.length; i++) {
      valueToPush = new Array();
      valueToPush[0] = x_values[i];
      valueToPush[1] = y_values[i];
      chart_data.push(valueToPush);
    }
    this.fr_percent_depth_chart_data = chart_data;
    },
    formatResults() {

    },
    navInput() {
       this.$router.go()

    },
    navHome() {
      this.$router.push({path:'/'});
    },
    saveEmail() {
      // todo: send email and affiliaion to server
      localStorage.setItem("email", this.email);

    }
  }
  }
</script>

<style scoped>
.background {
  background-color: #f5f7f5;
}
</style>