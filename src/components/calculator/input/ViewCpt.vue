<template>
    <v-row>
        <v-col>
          <generic-graph :result="qt_depth_chart_data" xaxis="." yaxis="depth (m)" height="500" minx="0" :isQt="true"></generic-graph>
        </v-col>
        <v-col>
           <generic-graph :result="fr_percent_depth_chart_data" xaxis="F (%)" height="500" minx="0" maxx="6" tickAmount="6"></generic-graph>
        </v-col>
        <v-col>
          <generic-graph :result="lc_depth_chart_data" xaxis="Ic" height="500" minx="1" maxx="5" :isIc="true" tickAmount="4"></generic-graph>
        </v-col>
        <v-col >
          <generic-graph v-if="alg_type != 'bored'" :result="iz1_depth_chart_data" xaxis="Iz" height="500" minx="-5" maxx="10" :isIz="true" tickAmount="5"></generic-graph>
        </v-col>
      </v-row>
</template>

<script>
import GenericGraph from '../../graphs/GenericGraph.vue'
export default {
  props: ['qt_depth_chart_data', 'fr_percent_depth_chart_data', 'lc_depth_chart_data', 'iz1_depth_chart_data', 'alg_type'],
  components: { GenericGraph },
  methods: {
    getQtInputGraduations() {

    }
  }
}
</script>
