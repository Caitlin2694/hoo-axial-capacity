<template>
    <div v-if="series[0].data.length > 0" id="chart">
        <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default  {
  props: ['result'],
  components: {
    apexchart: VueApexCharts,
  },
  mounted() {
    this.series[0].data = this.result.map(res => res[1] ? res : [res[0], null])
  },
  watch: { 
      result() { // watch it
          this.series[0].data = this.result.map(res => res[1] ? res : [res[0], null])   
    },
  },
  data() {
    return {
        series: [{
              name: "Depth",
              data: []
          }],
          chartOptions: {
            chart: {
              height: 350,
              type: 'line',
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'straight'
            },
            title: {
              text: 'ADOP / DEPTH GRAPH',
              align: 'left'
            },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            yaxis: {
              decimalsInFloat: 1,
            },
            xaxis: {
              type: 'numeric',
              title: {
              },
                labels: {
                rotate: 0
              }
            }
          }
    }
  }
}
</script>

<style scoped>

</style>
