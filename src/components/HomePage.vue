<template>
 <div>
 <v-parallax
    dark
    src="../assets/ocean.jpeg"
    height="550"
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        class="text-center"
        cols="12"
      >
        <h1 class="display-1 font-weight-thin mb-4">
          Axial Capacity Calculator
        </h1>
        <h4 class="subheading">
          An app to calculate the Axial Csapacity of Piles. Built by The University of Western Australia
        </h4>
      </v-col>
    </v-row>
  </v-parallax>
  <v-container>
    <v-row align="center" justify="center" class=mt-5>
        <h3>Who are we?</h3>
        <p class="ma-5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
    </v-row>
    <v-row class=mt-5>
      <v-col class="text-center" cols="6">
        <h3>What does this application do?</h3>
        <p class="ma-5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      </v-col>
      <v-col cols="6">
           <v-carousel height="330px">
            <v-carousel-item 
              v-for="(item,i) in items"
              :key="i"
              :src="item.src"
              reverse-transition="fade-transition"
              transition="fade-transition"
            ></v-carousel-item>
          </v-carousel>
          </v-col>
      </v-row>
      <v-row class=mt-5>
        <v-col class="text-center" cols="12">
          <h3>Key Features</h3>
          <p>Put Key Features here!</p>
        </v-col>
      </v-row>
  </v-container>
  </div>
</template>

<script>
export default {
    name: 'HomePage',
    data: () => ({
      model: 0,
      colors: [
        'primary',
        'secondary',
        'yellow darken-2',
        'red',
        'orange',
      ],
      items: [
        {
          src: require('../assets/oil.jpg'),
        },
        {
          src: require('../assets/engineer.jpg'),
        }
      ],
    })
};
</script>

<style scoped>
</style>