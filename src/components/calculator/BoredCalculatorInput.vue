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
        <v-form v-model="isFormValid">
          <v-text-field
            label="Pile shaft diameter (m)"
            type="number"
            :rules="[rules.required, rules.counter]"
            placeholder="0.333248"
            v-model="userInput.nominalSizeDoN"
          ></v-text-field>
          <v-text-field
            label="Dbase"
            type="number"
            v-model="userInput.dbase"
            :value="userInput.dbase"
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
    props: ['cpt_data'],
    // watch for changes in user input
    watch: {
      userInput: {
        handler: function () {
            this.onChange();
        },
        deep: true
      },

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
                nominalSizeDoN: 0.762,
                nominalSizeDiMM: 0.762,
                pilePerimeter: 1.11715032856,
                rlGroundLevel: 0,
                rlWaterTable: 0,
                borehole: 1.90,
                dbase: 0.762,
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
