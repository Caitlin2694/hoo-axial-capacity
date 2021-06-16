<template>
  <v-container class="mt-5">

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
          label="Click here to select a .csv file"
          @change="selectFile"
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

        <v-row class="mt-2">
          <v-col cols=6>
             <p>Depth of water table below ground level (m) <br> Enter zero for offshore site <br> only hyrostatic conditions are considered in this version</p>
          </v-col>
          <v-col>
            <v-text-field
              label="Enter depth of water table"
              placeholder="0"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>

     <!--<div class="form-group" v-if="cpt_data_table.length > 1">-->
        <!--<p class="mt-5">Now, use the "add weight values" button to add the unit weight (kN/m<sup>3</sup>) for each depth layer.</p>
         <v-btn color="primary" @click="addGtot" class="mt-2">Add weight values</v-btn>

    
      
      <div class="work-experiences">

        <div class="form-row" v-for="(experience, index) in gtot_input_values" :key="index">
        <v-row>
            <v-col>
             <v-select
                :items="cpt_data_table"
                label="start depth"
                item-text="z"
            ></v-select>
            </v-col>
           <v-col>
            <v-select
                :items="cpt_data_table"
                label="end depth"
                 item-text="z"
           ></v-select>
           </v-col>
           <v-col>
                <v-text-field
                label="gtot value"
                :default="value"
              ></v-text-field>
           </v-col>
          </v-row>
        </div>
      </div>
      </div> -->
      </v-card>

      </div>
      </v-card>
      <v-btn
        color="primary"
        @click="e6 = 2"
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
      Run Calculation
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-card>
      <p>Click "calculate" to run the calculation</p>
      <v-btn class="ma-5" dark @click="calculate()">Calculate</v-btn> 
      </v-card>
    </v-stepper-content>
  </v-stepper>
  </div>







    <v-stepper-step
      :complete="e6 > 3"
      step="3"
    >
      Input Site and Pile Information
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-card
        class="mb-12"
      >
      <div class="pa-5">
      <v-text-field
            label="Site Name"
            placeholder="Los Coyotes"
            :value=userInput.siteName
          ></v-text-field>
          <v-text-field
            label="Pile Number"
            placeholder="1"
            :value=userInput.pileNumber
          ></v-text-field>
          <v-text-field
            label="Pile Material"
            placeholder="Steel"
            :value=userInput.pileMaterial
          ></v-text-field>
          <v-text-field
            label="Interface Friction Angle"
            placeholder="26"
            type="number"
            :value=userInput.interfaceFrictionAngle
          ></v-text-field>
          <v-text-field
            label="Pile Shape"
            placeholder="Circular"
            :value=userInput.pileShape
          ></v-text-field>
          <v-text-field
            label="Pile End Condition"
            placeholder="Open"
            :value=userInput.pileEndCondition
          ></v-text-field>
          <v-text-field
            label="FFR"
            type="number"
            placeholder="0.98"
            :value=userInput.ffr
          ></v-text-field>
          <v-text-field
            label="Nominal Size: Do,n (m)"
            type="number"
            placeholder="0.3556"
            :value=userInput.nominalSizeDoN
          ></v-text-field>
         <v-text-field
            label="Nominal Size: t (mm)"
            type="number"
            placeholder="11.176"
            :value=userInput.nominalSizeT
          ></v-text-field>
          <v-text-field
            label="Nominal Size: Di (mm)"
            type="number"
            placeholder="0.333248"
            :value=userInput.nominalSizeDiMM
          ></v-text-field>
          <v-text-field
            label="RL Ground Level (m AHD)"
            type="number"
            placeholder="0"
            :value=userInput.rlGroundLevel
          ></v-text-field>
            <v-text-field
            label="RL Water Table (m AHD)"
            type="number"
            placeholder="-5"
            :value=userInput.rlWaterTable
          ></v-text-field>
          <v-text-field
            label="Tipdepth"
            type="number"
            placeholder="1.9"
            :value=userInput.tipdepth
          ></v-text-field> 
          </div>
      </v-card>
      <v-btn
        color="primary"
        @click="e6 = 3"
      >
        Continue
      </v-btn>
      <v-btn text>
        Cancel
      </v-btn>
    </v-stepper-content>
    
    <v-stepper-step
      :complete="e6 > 4"
      step="4"
    >
      View CPT Data
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-card>
      <generic-graph :result="lc_depth_chart_data"></generic-graph>
      <v-btn class="ma-5" dark @click="calculate()">Accept CPT data</v-btn> 
      <v-btn class="ma-5" dark @click="calculate()">Change CPT data</v-btn> 
      </v-card>
    </v-stepper-content>

<div v-if="calculatePressed">
      <h1 class="mb-5">Output</h1>
       <download-excel :data="res_dict" class="v-btn mb-5" dark>
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
       </v-row>


        <v-select
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
        <p>Calculated parameters for depth: {{resIndex ? res_dict[resIndex] : 'Not chosen'}}</p>
       </div>
  </v-container>
</template>

<script>

  // todo: ask barry about this: Note, Eduardo/Caitlin, we need to allow for case where the qt data are widely spaced (ie depth increments are large) and hence the program needs to interpolate a minimum number of values – probably best done in this module before calculation
  import OutputChart from './OutputChart.vue'
  import AdopDepthGraph from './graphs/AdopDepthGraph.vue'
  //import QT_F_Chart from './QT_F_Chart.vue'
  //import QT_F_Chart_2 from './QT_F_Chart_2.vue'
  import JsonExcel from "vue-json-excel";
  import LcDepthGraph from './graphs/LcDepthGraph.vue';
import Iz1DepthGraph from './graphs/Iz1DepthGraph.vue';
import GenericGraph from './graphs/GenericGraph.vue';
  export default {
  components: {
    OutputChart,
    //'qt-f-chart': QT_F_Chart,
    //'qt-f-chart-2': QT_F_Chart_2,
    'download-excel': JsonExcel,
    AdopDepthGraph,
    LcDepthGraph,
    Iz1DepthGraph,
    GenericGraph,
  },
  data() {
    return {
    e6: 1,
    checkbox: true,
    cpt_data_table: [{z: '0.01', 'fs':'4.186', 'qc':'-1.34', 'gtot':'19.65'}],
    paramsIndex: null,
    param_dict: [],
    res_dict: [], 
    chart_res: [],
    qtf_chart_res: [],
    qtf_chart_res_2: [],
    adop_depth_chart_data: [],
    lc_depth_chart_data: [],
    iz1_depth_chart_data: [],
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
      pileNumber: 1,
      pileMaterial: "Steel",
      interfaceFrictionAngle: 26,
      pileShape: "Circular",
      pileEndCondition: "Open",
      ffr: 0.98,
      nominalSizeDoN: 0.3556,
      nominalSizeT: 11.176,
      nominalSizeDiMM: 0.333248,
      pilePerimeter: 1.11715032856,
      rlGroundLevel: 0,
      rlWaterTable: 0,
      tipdepth: 14.9
    },
    cpt_data: ['hello', 'world']
    }
  },
  created() {
    this.param_dict = JSON.parse(localStorage?.param_dict);
    this.res_dict = JSON.parse(localStorage.res_dict);
    this.setResultData();
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
                      //alert(_this.cpt_data[i])
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
      this.processInputParameters();

      
    },
    processInputParameters() {
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
      const parsed_cpt_data = JSON.parse(JSON.stringify(this.cpt_data))
      for (const row of parsed_cpt_data) {
       let depth_value = parseFloat(row[0]); // get first column of input
       depth.push(depth_value);
       h.push(this.userInput?.tipdepth - depth_value);

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
        if (this.userInput?.pileEndConsition != "Closed") {
          ar_value = 1-0.980*(Math.pow(don_value-2*11.176/1000, 2))/(Math.pow(don_value, 2)); //TODO:figure out what 11.176 is and CALC 0.980
        }
        let area_value = Math.PI*don_value*don_value*0.25; 
        let qb_sand_value = qt_2_value*1000*(0.15+0.45*ar_value)*area_value;
        qb_sand.push(qb_sand_value)

        let qb_clay_value = 0;
        if (this.userInput?.pileEndCondition == "Closed") {
          qb_clay_value = (0.8*qt[i]*1000)*area_value;
        } else {
          qb_clay_value = (0.4*qt[i]*1000)*area_value;
        }
        qb_clay.push(qb_clay_value);
     }

     // shaft capacity calculation
     let d_star = 0;
     if (this.userInput?.pileEndCondition == "Closed") {
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
     
    // calcuate final result
    let lookup_index = depth.indexOf(this.userInput?.tipdepth)
    let lookup_result = qs[lookup_index];
    this.final_result = (lookup_result/1500).toFixed(3) //todo: don't use 1500, final numbers are qs, qb and qt.

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
        qt_res: qt_res[i]
      })

    }
    this.param_dict = param_dict_temp;
    this.res_dict = res_dict_temp;
    localStorage.param_dict = JSON.stringify(param_dict_temp);
    localStorage.res_dict = JSON.stringify(res_dict_temp);

    this.setResultData()
    this.setAdopDepthChartData()
    this.setIcDepthChartData()
    this.setIz1DepthChartData()

    this.calculatePressed = true;

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
      //if (!isFinite(x_values[i])){
      //  x_values[i] = 0; //todo: check this hack.
      //}
      valueToPush[0] = x_values[i];
      valueToPush[1] = y_values[i];
      chart_data.push(valueToPush);
    }
    this.lc_depth_chart_data = chart_data;
  },
  downloadXLSXFile() {

  },
  addGtot() {
      this.gtot_input_values.push({
        startPoint: '',
        endPoint: '',
        value: ''
      })
  },
  log(base, number) {
   return Math.log(number) / Math.log(base);
  },
  createCPTCharts() {
    let y_values = this.res_dict.map(({depth}) => depth);
    let x_values = this.res_dict.map(({lc}) => lc);
    let chart_data = [];
    for (let i=0; i<x_values.length; i++) {
      var valueToPush = new Array();
      //if (!isFinite(x_values[i])){
      //  x_values[i] = 0; //todo: check this hack.
      //}
      valueToPush[0] = x_values[i];
      valueToPush[1] = y_values[i];
      chart_data.push(valueToPush);
    }
    this.lc_depth_chart_data = chart_data;

  }
},
}
</script>

<style scoped>
</style>