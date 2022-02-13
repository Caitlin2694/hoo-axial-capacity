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

        <view-cpt :qt_depth_chart_data="qt_depth_chart_data" :fr_percent_depth_chart_data="fr_percent_depth_chart_data" :lc_depth_chart_data="lc_depth_chart_data" :iz1_depth_chart_data="iz1_depth_chart_data" :alg_type="this.pile"></view-cpt>

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

     <driven-calculator-input v-if="pile == 'driven'" :saved_input="savedUserInput" :cpt_data="cpt_data" @change="onInputChange"></driven-calculator-input>
     <bored-calculator-input v-else-if="pile == 'bored'" :saved_input="savedUserInput" :cpt_data="cpt_data" @change="onInputChange"></bored-calculator-input>
      
      <v-btn
        color="primary"
        @click="e6 = 4"
        :disabled="!isFormValid"
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
import shared from '../../shared';
import shared_bored from '../../shared-bored';
import DrivenCalculatorInput from './DrivenCalculatorInput.vue'
import BoredCalculatorInput from './BoredCalculatorInput.vue'

export default {
  components: {
    UploadCpt,
    ViewCpt,
    DrivenCalculatorInput,
    BoredCalculatorInput
  },
  beforeMount() {
    let savedCPT = JSON.parse(localStorage.getItem('cpt'));
    let savedUserInput = JSON.parse(localStorage.getItem('userInput'));
    if (savedCPT) {
      this.cpt_data = savedCPT;
    }
    if (savedUserInput) {
      this.savedUserInput = savedUserInput;
    } 
  },
  mounted() {
    // get URL param "pile"
    const urlParams = new URLSearchParams(window.location.search);
    const pile = urlParams.get("pile");
    if (pile) {
      this.pile = pile;
    }
  },
  data() {
    return {    
      rules: {
        required_borehole:(value) => !!value || 'Required.',
        required:(value) => !!value || 'Required.',
        counter: value => value < 10 || 'Please enter dimensions in metres',
      },
      e6: 1,
      checkbox: true,
      userInputValid: true,
      isFormValid: false,
      rlWaterTable: 0,
      userInput: null,
      cpt_data: [], 
      lc_depth_chart_data: [],
      fr_percent_depth_chart_data: [],
      qt_depth_chart_data: [],
      iz1_depth_chart_data: [],
      tipdepth_res_dict: [],
      max_depth: 0,
      savedUserInput: null,
    }
  },
  computed: {

  },
  methods: {
      onInputChange(input) {
        this.userInput = input.input;
        this.isFormValid = input.isValid;
      },
      onCptDataTableChange(val) {
        this.cpt_data = val;
      },
      onWaterTableChange(val) {
        this.rlWaterTable = val;
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
      }, //todo: check if we need to change CPT charts for bored.
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
          let res = null;
          if (this.pile == "driven") {
            res = shared.processInputParameters(tipdepths[i], this.userInput.borehole, this.cpt_data, this.userInput.nominalSizeDoN, this.rlWaterTable, 
            this.userInput.pileEndCondition, this.userInput.pilePerimeter, this.userInput.nominalSizeT, this.userInput.pileShape, this.userInput.borehole);
          } else if (this.pile == "bored") {
            // pileShape = 0
            res = shared_bored.processInputParameters(tipdepths[i], this.userInput.borehole, this.cpt_data, this.userInput.nominalSizeDoN, this.rlWaterTable, 
            0, this.userInput.borehole, this.userInput.dbase);
          }

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
    this.$router.push({name: name, params: {data_dict: this.tipdepth_res_dict, chart_data: this.tipdepth_chart_data, site_name: this.userInput.siteName, user_input: this.userInput, alg_type: this.pile}})
  }
  }
  }
</script>
