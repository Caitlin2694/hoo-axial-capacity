<template>
 <v-stepper
    v-model="e6"
    vertical
  >
  <h1 class="ma-5">Input</h1>
    <v-stepper-step
      :complete="e6 > 1"
      step="1"
    >
      CPT Data
    </v-stepper-step>

    <v-stepper-content step="1">

      <upload-cpt :cpt_data_table_input="cpt_data" v-on:cptDataTableChange="onCptDataTableChange" v-on:waterTableChange="onWaterTableChange"></upload-cpt>
      
      <v-btn
        color="primary"
        @click="e6 = 2, createCPTCharts()"
      >
        Check Data Entry
      </v-btn>
      <v-btn text href="/">
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

        <view-cpt :qt_depth_chart_data="qt_depth_chart_data" :fr_percent_depth_chart_data="fr_percent_depth_chart_data" :lc_depth_chart_data="lc_depth_chart_data" :iz1_depth_chart_data="iz1_depth_chart_data"></view-cpt>

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
            label="File Name for Download (not required)"
            placeholder="UWA Trial"
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
            placeholder="11.176"
            v-model="userInput.nominalSizeT"
          ></v-text-field>
          <v-text-field
            label="Pile Diameter or side width (m)"
            type="number"
            :rules="[rules.required, rules.counter]"
            placeholder="0.333248"
            v-model="userInput.nominalSizeDoN"
          ></v-text-field>
          <v-text-field
            label="Tip depth of cased borehole (friction is ignored from ground level to this depth)"
            type="number"
            placeholder="0"
            :rules="[rules.required]"
            v-model="userInput.borehole"
          ></v-text-field> 
          <v-text-field
            label="Pile tip depths (m) for analysis (separated by commas)"
            type="text"
            :rules="[tipdepth_limit(userInput.tipdepth_analysis_values), tipdepth_commas(userInput.tipdepth_analysis_values), rules.required, ]"
            v-model="userInput.tipdepth_analysis_values"
          ></v-text-field> 
          </div>
      </v-card>
      <v-btn
        color="primary"
        @click="e6 = 4"
      >
        Continue
      </v-btn>
      <v-btn text @click="e6 = 2" >
        Go Back
      </v-btn>
      <v-btn text @click="e6 = 1">
        Re-enter
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
      <v-btn class="ma-5" dark @click="e6 = 3">Go Back to Pile Information</v-btn> 
      <v-btn class="ma-5" dark @click="e6 = 1">Go Back to CPT Data</v-btn> 
      </v-card>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import UploadCpt from './input/UploadCpt.vue';
import ViewCpt from './input/ViewCpt.vue';
import shared from '../../shared'
export default {
  components: {
    UploadCpt,
    ViewCpt
  },
  beforeMount() {
    let savedCPT = JSON.parse(localStorage.getItem('cpt'));
    let savedUserInput = JSON.parse(localStorage.getItem('userInput'));
    if (savedCPT) {
      this.cpt_data = savedCPT;
    }
    if (savedUserInput) {
      this.userInput = savedUserInput;
    }
  },
  data() {
    return {    
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value < 10 || 'Please enter dimensions in metres',
      },
      e6: 1,
      checkbox: true,
      userInput: {
        siteName: "UWA Trial",
        pileShape: 0,
        pileEndCondition: 0,
        nominalSizeDoN: 0.3556,
        nominalSizeT: 11.176,
        nominalSizeDiMM: 0.333248,
        pilePerimeter: 1.11715032856,
        rlGroundLevel: 0,
        rlWaterTable: 0,
        borehole: 0,
        tipdepth_analysis_values: "6, 10, 15, 18, 25", //todo: rset up to run multiple tests.
    },
      cpt_data: [], 
      lc_depth_chart_data: [],
      fr_percent_depth_chart_data: [],
      qt_depth_chart_data: [],
      iz1_depth_chart_data: [],
      tipdepth_res_dict: [],
      max_depth: 0,
    }
  },
  computed: {

  },
  methods: {
      tipdepth_limit(value) {

        this.maxDepth();
        let list = value.split(',');
        let flag = true;
        list.forEach(depth => {
          depth = depth.trim();
          if (parseFloat(depth) > parseFloat(this.max_depth)) {
            flag = 'Tip depth cannot be higher than depth from CPT data'
          } else { 
            flag = true;
          }
        })
        return flag;
      },

     tipdepth_commas(value) {

        if (!value.includes(',')) {
          let list = value.split(' ')
          if (list.length > 1 && list[1] != '') {
            return 'Tip depths must be separated by commas'
          } else {
            return true;
          }
        }
        return true;
      },

      maxDepth() {
        if (this.cpt_data[this.cpt_data.length - 1]) {
        this.max_depth = this.cpt_data[this.cpt_data.length - 1][0]
        }
      },
      onCptDataTableChange(val) {
        this.cpt_data = val;
      },
      onWaterTableChange(val) {
        this.userInput.rlWaterTable = val;
      },
      createCPTCharts() {
        this.cpt_dict = shared.preInputCalc(this.cpt_data, this.userInput?.rlWaterTable);
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


      // iz1 graph
        y_values = this.cpt_dict.map(({depth}) => depth);
        x_values = this.cpt_dict.map(({iz1}) => iz1);
        chart_data = [];
        for (let i=0; i<x_values.length; i++) {
          valueToPush = new Array();
          valueToPush[0] = x_values[i];
          valueToPush[1] = y_values[i];
          chart_data.push(valueToPush);
        }
        this.iz1_depth_chart_data = chart_data;
      },
      calculate() {
        // sort from low to high

        // save cpt and user input to localstorage
        localStorage.setItem('cpt', JSON.stringify(this.cpt_data));
        localStorage.setItem('userInput', JSON.stringify(this.userInput))


        let tipdepths = this.userInput.tipdepth_analysis_values.split(',').map(t => {
          t = t.trim();
          return parseFloat(t);
        });
        tipdepths.sort(this.getTipdpthValue)
        for (let i=0; i<tipdepths.length; i++) {
          let res = shared.processInputParameters(tipdepths[i], this.userInput.borehole, this.cpt_data, this.userInput.nominalSizeDoN, this.userInput.rlWaterTable, 
          this.userInput.pileEndCondition, this.userInput.pilePerimeter, this.userInput.nominalSizeT, this.userInput.pileShape, this.userInput.borehole);
          //let res = this.processInputParameters(parseInt(this.tipdepth_values[i].value))
          this.tipdepth_res_dict.push(res) // creates 2D array of res.
        }
        this.setTipDepthChartData();
        this.nav('CalculatorOutput')


    },
  getTipdpthValue(item, nextitem) {
      return item.value - nextitem.value;
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
  nav(name) {
    this.$router.push({name: name, params: {data_dict: this.tipdepth_res_dict, chart_data: this.tipdepth_chart_data, site_name: this.userInput.siteName, user_input: this.userInput}});
  }
  }
  }
</script>
