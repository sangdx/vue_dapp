<template>
  <div class="row">
    <div class="title">Title form</div>
    <div class="col-6">
      <div class="form-group">
        <label for="exampleFormControlInput1">First name</label>
        <input type="text" v-model="user.fname" id="exampleFormControlInput1" class="form-control" placeholder="first name ...">
      </div>
    </div>
    <div class="col-6">
      <div class="form-group">
        <label for="exampleFormControlInput2">First name</label>
        <input type="text" v-model="user.lname" id="exampleFormControlInput2" class="form-control" placeholder="last name ...">
      </div>
    </div>
    <pre>Fistname: {{ user.fname }}</pre>
    <pre>Lastname: {{ user.lname }}</pre>
    <pre>Username: {{ username }}</pre>
  </div>
</template>

<script>
  export default {
    name: 'Form',
    data() {
      return {
        user: {
          fname: '',
          lname: ''
        },
        oldValue: ''
      }
    },
    watch: {
      'user.lname': function(newValue, oldValue) {
        /// 
        this.$eventBus.$emit("CHANGE_NAME", newValue)
      }
    },
    computed: {
      username() {
        return this.user.fname + this.user.lname
      }
    },
    methods: {
      clickHandler(event) {
        event.preventDefault()
      },
      initialize() {
        this.default()
      },
      default() {
        this.user.fname = 'Test'
      }
    },
    mounted() {
      this.initialize()
      this.$eventBus.$on('RESET_NAME', (key) => {
        this.user[key] = ''
      })
    },
    created() {
    },
    beforeUpdated() {
    },
    beforeDestroy() {
    }
  }
</script>

