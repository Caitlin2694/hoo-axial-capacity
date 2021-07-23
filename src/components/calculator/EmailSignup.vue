<template>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Enter Your Email
        </v-card-title>
        <v-card-text>To use this app, we ask that you enter your email address and affiliaiton. The purpose of this is so that we can see who is using our app!</v-card-text>
           <v-card-text>
              <v-text-field
                label="Email"
                type="email"
                :rules="[rules.required]"
                placeholder="myemail@email.com"
                :value="email"
              ></v-text-field> 
              <v-text-field
                label="Affiliation"
                type="text"
                placeholder="The University of Western Australia"
                :rules="[rules.required]"
                :value="affilliation"
              ></v-text-field> 
           </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false, navHome()"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false, saveEmail()"
          >
            Continue
          </v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>


export default {
    data() {
        return {
            dialog: false,
            email: '',
            affilliation: '',
            rules: {
                required: value => !!value || 'Required.',
            }
        }
    },
    created() {
        // todo: do with cookie, not local storage.
        if (!localStorage.getItem('email')) {
            this.dialog = true;
        }
    }, 
    methods: {
        navHome() {
            this.$router.push({path:'/'});
        },
        saveEmail() {
            // todo: send email and affiliaion to server.
            localStorage.setItem("email", this.email);
        },
    }
}
</script>
