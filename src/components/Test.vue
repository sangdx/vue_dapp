<template>
  <div>
    <span>Test component</span>
    <span>{{ lname }}</span>
  </div>
</template>

<script>
export default {
  name: 'Test',
  data() {
    return {
      lname: ''
    }
  },
  mounted() {
    this.$eventBus.$on('CHANGE_NAME', (name) => {
      this.lname = name
    })
  }
}
</script>
