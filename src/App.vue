<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  created() {
  },
  mounted() {
    console.log('111');
  },
  methods: {
  }
}
</script>

<style>
*, body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
