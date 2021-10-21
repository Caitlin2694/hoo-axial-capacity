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
        
         this.series[0].data = this.result.map(res => res[1] ? [parseFloat(res[0]), res[1]] : [res[0], null])   
         this.series[1].data = this.result.map(res => res[1] ? [parseFloat(res[2]), res[1]] : [res[2], null])   
  },
  watch: { 
      result() { // watch it
         this.series[0].data = this.result.map(res => res[1] ? [parseFloat(res[0]), res[1]] : [res[0], null])   
        this.series[1].data = this.result.map(res => res[1] ? [parseFloat(res[2]), res[1]] : [res[2], null])  
    },
  },
  methods: {
      getMaxTipDepth() {
          let depths = this.result.map(res => res[1]);
          return Math.max(...depths) + 5;
      },
     getMaxCapacity() {
          let caps_1 = this.result.map(res => res[0]);
          let caps_2 = this.result.map(res => res[2]);
          return Math.max(...(caps_1.concat(caps_2))) + 0.5;
      }
  },
  data() {
    return {
        series: [{
              name: 'Tension',
              data: []
          },
          {
              name: 'Compression',
              data: []
          }],
          chartOptions: {
            chart: {
              height: this.height,
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
              min: 0,
              max: this.getMaxTipDepth(),
              reversed: true,
              title: {
                text: this.yaxis,
                style: {
                    fontSize: 14
                }
              },
            },
            xaxis: {
              type: 'numeric',
              decimalsInFloat: 2,
              min: 0,
              max: this.getMaxCapacity(),
              position: 'top',
              labels: {
                  rotation: 0,
                  formatter: function(val) {
                      return val.toFixed(0);
                  }
              }
            }
          }
    }
  }
}
</script>

<style scoped>

</style>
