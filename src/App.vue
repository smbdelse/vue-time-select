<template>
  <div id="app">
    <div class="range">
      <time-select class="" v-model='from' :max-value="to"></time-select>
      <time-select class="" v-model='to' :min-value="from"></time-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      from: 8*60*60,
      to: 14.5*60*60,
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.range {
  display: flex;
  position: relative;
  width: 50%;
  margin: auto;
}
.vts_wrapper{
  flex-basis: 50%;
  margin: 1em;
  flex-shrink: 0;
}
</style>
