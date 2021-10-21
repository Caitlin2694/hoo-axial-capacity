<template>
    <div v-if="series[0].data.length > 0" id="chart">
        <p class="text-body-2 title" v-if="isQt"><strong>q<sub>t</sub> (MPa)</strong></p>
        <p class="text-body-2 title" v-if="isIz"><strong>I<sub>z</sub></strong></p>
        <apexchart type="line" :height="height" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default  {
  props: ['result', 'xaxis', 'yaxis', 'height', 'minx', 'maxx', 'isQt', 'isIz', 'isIc', 'tickAmount'] ,
  components: {
    apexchart: VueApexCharts,
  },
  mounted() {
    this.series[0].data = this.result.map(res => res[1] ? res : [res[0], null])
    if (this.tickAmount) {
          this.chartOptions.xaxis.tickAmount = parseInt(this.tickAmount)
          this.chartOptions.xaxis.decimalsInFloat = 0
    }
    if (this.isQt || this.isIz) {
      this.chartOptions.title.style.color = '#ffffff'
    }

    if (this.isIc) {
      this.chartOptions.annotations.xaxis.push(
      {
            x: 2.05,
            x2: 2.5,
            fillColor: '#B3F7CA',
            opacity: 0.4,
            label: {
              borderColor: '#B3F7CA',
              style: {
                fontSize: '10px',
                color: '#fff',
                background: '#00E396',
              },
              offsetY: -10,
            }
          }
      )
    }

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
              },
            
            },
            annotations: {
              xaxis: []
            },
            tooltip: {
              enabled: false,
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: 1,
              //curve: 'straight'
            },
            title: {
                text: this.xaxis,
                align: 'center',
                style: {
                  color: '#000000'
                },
            },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
                  xaxis: {
                    lines: {
                        show: true
                }
                },   
                yaxis: {
                    lines: {
                        show: true
                    }
                }, 
            },
            yaxis: {
              decimalsInFloat: 0,
              reversed: true,
              title: {
                text: this.yaxis,
                style: {
                  fontSize: 16
                }  
              },
            },
            xaxis: {
              decimalsInFloat: 1,
              type: 'numeric',
              tickAmount: this.tickAmount,
              //tickPlacement: 'on',
              min: this.minx ? parseInt(this.minx) : null,
              max: this.maxx ? parseInt(this.maxx) : null, 
              position: 'top',
                labels: {
                rotate: 0
              },
              axisTicks: {
          show: true,
              }
            }
          }
    }
  }
}
</script>

<style scoped>
  .title {
    position: absolute;
    top: 20;
    left: 45%;
  }
</style>


