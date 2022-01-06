<template>
  <div class="change">
    <button class="btn btn-warning" @click="reset('fname')">Reset fname</button>
    <button class="btn btn-warning" @click="reset('lname')">Reset lname</button>
  </div>
</template>

<script>
  export default {
    name: 'Reset',
    props: {
      type: String,
      require: true
    },
    methods: {
      reset(key) {
        this.$eventBus.$emit('RESET_NAME', key)
      }
    }
  }
</script>
