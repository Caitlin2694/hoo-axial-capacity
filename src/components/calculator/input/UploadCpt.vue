<template>
    <v-card
        class="mb-12"
      >
     <div @paste="convert_paste_to_cpt">
     <div class="pt-3">
     <p>Please upload a CSV or TXT file containing the CPT data in the order indicated below. Note the units required. The CPT profile must extend below the maximum pile depth.</p>
     <p class="text-body-2">The first unit weight entry will be used throughout if not other unit weights are entered.</p>
     <p class="text-body-2">The depth increment from this CSV file controls the accuracy of the calculations (suggested increment &#8804; 0.1 m).</p>
          <v-file-input
          label="Click here to select a .csv or .txt file"
          @change="selectFile"
          accept=".csv,.txt"
          ></v-file-input>
     </div>

    <v-card>
      <v-simple-table dense fixed-header height="250px" >
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Depth (m)
              </th>
              <th class="text-left">
                Cone resistance q<sub>t</sub> (MPa)
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
              <td>{{ item.qc ? Math.round(item.qc * 1000) / 1000  : 0 }}</td> <!--Rounded to 3 d.p.-->
              <td>{{ item.fs ? Math.round(item.fs * 10) / 10  : 0  }}</td>  <!--Rounded to 1 d.p.-->
              <td>{{ item.gtot }}</td>
            </tr>
            <v-alert
              v-if="erroredInput"
              color="red"
              dismissible
              type="error"
            >Your input CPT data contains incomplete values. Please check your data and try again. </v-alert>
          </tbody>
        </template>
      </v-simple-table>

        <v-row class="mx-2 my-4">
          <v-col cols=6>
             <p>Depth of water table below ground level (m) <br> Enter zero for offshore site <br> Only hydrostatic conditions are considered in this version</p>
          </v-col>
          <v-col>
            <v-text-field
              label="Enter depth of water table"
              placeholder="0"
              outlined
              v-model="water_table"
              type="number"
              :rules="[rules.required, limit(water_table)]"
            ></v-text-field>  <!-- todo: figure out if this is rl ground level or rl water table-->
          </v-col>
        </v-row>

      </v-card>
      </div>
      </v-card>
</template>

<script>
export default {
    props: ['cpt_data_table_input', 'savedWaterTable'],
    watch: {
        cpt_data: function (val) {
            this.$emit('cptDataTableChange', val)
        },
        water_table: function (val) {
            this.$emit('waterTableChange', val)
        }
    },
    beforeMount() {
      if (this.savedWaterTable) {
        this.water_table = this.savedWaterTable
      }
      if (this.cpt_data_table_input && this.cpt_data_table_input.length > 0) {
                this.cpt_data = this.cpt_data_table_input;
              let temp_table_data = []
                    for (let i = 0; i< this.cpt_data.length; i++) {
                      if (this.cpt_data[i][0] == "" &&  this.cpt_data[i][1] == null &&  this.cpt_data[i][2] == null &&  this.cpt_data[i][3] == null) { //if empty row, skip
                         this.cpt_data.splice(i, 1) //ignore row
                      } else if (this.cpt_data[i][0] == "" || this.cpt_data[i][0] == null) {
                        this.erroredInput = true;
                        temp_table_data = [];
                        break;
                      }   
                      
                      else { 
                        if (this.cpt_data[i][3] == "" || this.cpt_data[i][0] == null) {
                          this.cpt_data[i][3] = this.cpt_data[i-1][3] //take last gtot value
                        }
                        temp_table_data.push({
                          'z': this.cpt_data[i][0],
                          'qc': this.cpt_data[i][1],
                          'fs': this.cpt_data[i][2],
                          'gtot': this.cpt_data[i][3]
                        })
                      }
                    }
                    this.cpt_data_table = temp_table_data;
                    this.maxDepth();


      }
    },
    data() {
        return {
            rules: {
              required: value => !!value || 'Required.'
            },
            cpt_data_table: [{z: '0.05', 'fs':'4', 'qc':'0.452', 'gtot':'19.65'}, {z: '0.01', 'fs':'10', 'qc':'0.963', 'gtot':'19.65'}, {z: '0.15', 'fs':'12', 'qc':'1.621', 'gtot':'19.65'}],
            cpt_data: [],
            water_table: 0,
            max_depth: 0.15,
            erroredInput: false,
        }
    },
    computed: {

    },
    methods: {
      limit(value) {
        if (parseFloat(value) > parseFloat(this.max_depth)) {
          return 'Depth of water table cannot be higher than depth from CPT data.'
        } else {
          return true;
        }
      },
      maxDepth() {
        this.max_depth = this.cpt_data_table[this.cpt_data_table.length - 1].z 
      },
        selectFile() {
          this.erroredInput = false;
         /* return first object in FileList */
            var file = event.target.files[0];
            var _this = this; // save it in a variable for usage inside function
            this.$papa.parse(file, {
                header: false,
                complete: function (results) {
                    _this.cpt_data = results.data;
                    _this.complete_data_selection(_this)

                }
            });
        },
        complete_data_selection(_this) {
                    let temp_table_data = []
                    for (let i = 0; i< _this.cpt_data.length; i++) {
                      if (_this.cpt_data[i][0] == "" &&  _this.cpt_data[i][1] == null &&  _this.cpt_data[i][2] == null &&  _this.cpt_data[i][3] == null) { //if empty row, skip
                         _this.cpt_data.splice(i, 1)
                      } else if (_this.cpt_data[i][0] == "" || _this.cpt_data[i][0] == null ||
                      _this.cpt_data[i][1] == "" || _this.cpt_data[i][1] == null ||
                      _this.cpt_data[i][2] == "" || _this.cpt_data[i][2] == null) {
                        _this.erroredInput = true;
                        temp_table_data = [];
                        break;
                      }   
                      else { 
                        if (_this.cpt_data[i][3] == "" || _this.cpt_data[i][0] == null) {
                          _this.cpt_data[i][3] = _this.cpt_data[i-1][3] //take last gtot value
                        }
                        temp_table_data.push({
                          'z': _this.cpt_data[i][0],
                          'qc': _this.cpt_data[i][1],
                          'fs': _this.cpt_data[i][2],
                          'gtot': _this.cpt_data[i][3]
                        })
                      }
                    }
                    _this.cpt_data_table = temp_table_data;
                    _this.maxDepth();
         },
          convert_paste_to_cpt() {
            let rows = this.paste_excel();
            this.cpt_data = rows;
            this.complete_data_selection(this)
          },
          paste_excel() {
            var clipboardData = window.clipboardData || event.clipboardData || event.originalEvent && event.originalEvent.clipboardData;
            var pastedText = clipboardData.getData("Text") || clipboardData.getData("text/plain");
            if (!pastedText && pastedText.length) {
                return;
            }
            let rows = pastedText.replace(/"((?:[^"]*(?:\r\n|\n\r|\n|\r))+[^"]+)"/mg, function (match, p1) {
            // This function runs for each cell with multi lined text.
            return p1
                // Replace any double double-quotes with a single
                // double-quote
                .replace(/""/g, '"')
                // Replace all new lines with spaces.
                .replace(/\r\n|\n\r|\n|\r/g, ' ') ;
            })
            // Split each line into rows
            .replace(/\t/g, ',')
            .split(/\r\n|\n\r|\n|\r/g)

            rows = rows.map(row => row.split(','))

            return rows;
        }
    }
}
</script>
