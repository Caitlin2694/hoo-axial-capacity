import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../components/HomePage.vue'
import Calculator from '../components/Calculator.vue'
import Landing from '../components/LandingPage.vue'
import CalculatorOutput from '../components/calculator/CalculatorOutput.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Landing
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: Calculator
  },
  {
    path: '/calculator/output',
    name: 'CalculatorOutput',
    component: CalculatorOutput,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
