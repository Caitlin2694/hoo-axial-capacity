<template>
    <!-- dialog vuewtify with coming soon message -->
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">Module in preparation</v-card-title>
        <v-card-text>
          This feature is coming soon.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="onClose()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    props:['dialog'],
    methods: {
        onClose() {
            this.$emit('close');
        },
    }
}

</script>
