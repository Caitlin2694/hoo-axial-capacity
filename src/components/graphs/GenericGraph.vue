<template>
    <div v-if="series[0].data.length > 0" id="chart">
        <apexchart type="line" :height="height" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default  {
  props: ['result', 'xaxis', 'yaxis', 'height'],
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
              name: this.xaxis,
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
              //curve: 'straight'
            },
            title: {
                text: this.xaxis,
                align: 'center'
            },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            yaxis: {
              decimalsInFloat: 1,
              reversed: true,
              title: {
                text: this.yaxis,
                style: {
                  fontSize: 16
                }  
              },
            },
            xaxis: {
              type: 'numeric',
              position: 'top',
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
