<template>
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
        <v-form v-model="isFormValid">
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
            :rules="[rules.required_borehole]"
            v-model="userInput.borehole"
            :value="userInput.borehole"
          ></v-text-field> 
          <v-text-field
            label="Pile tip depths (m) for analysis (separated by commas) - note maximum depth is required to be less than depth of CPT."
            type="text"
            :rules="[tipdepth_limit(userInput.tipdepth_analysis_values), tipdepth_vals_check(userInput.tipdepth_analysis_values),  tipdepth_commas(userInput.tipdepth_analysis_values), rules.required, ]"
            v-model="userInput.tipdepth_analysis_values"
          ></v-text-field> 
          </v-form>
          </div>
      </v-card>
</template>

<script>


export default ({
    props: ['cpt_data', 'saved_input'],
    // watch for changes in user input
    watch: {
      userInput: {
        handler: function () {
            this.onChange();
        },
        deep: true
      },

    },
    mounted() {
        if (this.saved_input) {
            this.userInput = this.saved_input;
        }
    },
    data() {
        return {
            rules: {
                required_borehole:(value) => !!value || 'Required.',
                required:(value) => !!value || 'Required.',
                counter: value => value < 10 || 'Please enter dimensions in metres',
            },
            isFormValid: false,
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
                borehole: 3,
                tipdepth_analysis_values: "6, 10, 15, 18, 25", //todo: rset up to run multiple tests.
                },
            }
        },
    methods: {
        onChange() {
            this.$emit('change', {input: this.userInput, isValid: this.isFormValid});
        },
        validate () {
        this.$refs.form.validate()
      },
      tipdepth_limit(value) {

        this.maxDepth();
        let list = value.split(',');
        let flag = true;
        list.forEach(depth => {
          depth = depth.trim();
          if (parseFloat(depth) > parseFloat(this.max_depth)) {
            flag = 'Tip depth cannot be higher than depth from CPT data'
            this.userInputValid = false;
          } else { 
            flag = true;
            this.userInputValid = true;
          }
        })
        return flag;
      },

      tipdepth_vals_check(value) {
        let depthList = this.cpt_data.map(data => parseFloat(data[0]))
        let list = value.split(',');
        let flag = true;
        list.forEach(depth => {
          if (!(depthList.indexOf(parseFloat(depth)) > -1)) {
            flag = 'All tip depths must have a corresponding value in the CPT data'
            this.userInputValid = false;
          } else { 
            flag = true;
            this.userInputValid = true;
          }
        })
        return flag;
      },

     tipdepth_commas(value) {

        if (!value.includes(',')) {
          let list = value.split(' ')
          if (list.length > 1 && list[1] != '') {
            this.userInputValid = false;
            return 'Tip depths must be separated by commas'
          } else {
            this.userInputValid = false;
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
    }
})
</script>
