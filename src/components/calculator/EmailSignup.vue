<template>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Registration
        </v-card-title>
        <v-card-text>Registration allows us to keep track of usage; no other details are saved.</v-card-text>
           <v-card-text>
              <v-text-field
                label="Email"
                type="email"
                :rules="[rules.required]"
                placeholder="myemail@email.com"
                :v-model="email"
              ></v-text-field> 
              <v-text-field
                label="Affiliation"
                type="text"
                placeholder="The University of Western Australia"
                :rules="[rules.required]"
                :v-model="affilliation"
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
            //alert(this.email)
            localStorage.setItem("email", 'email set'); //todo: change to actual email
            this.post(); //todo: put error handling on this.
        },
        post() {
          // Simple POST request with a JSON body using fetch
          /*const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: this.email, affilliation: this.affilliation})
          };
          fetch("http://localhost:3000/register-new", requestOptions) //todo: update for move to server
            .then(() => console.log('registered'))
        }*/
        }
    }
}
</script>
