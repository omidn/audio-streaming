<template>
  <div id="app">
    <!--<img alt="Vue logo" src="./assets/logo.png">-->
    <SpeedTest msg="Smart Voice API-Test"/>
  </div>
</template>

<script>
import SpeedTest from "./components/SpeedTest.vue";

export default {
  name: "app",
  components: {
    SpeedTest
  }
};
</script>

<style>
html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
  audio {
    height: 100px;
    position: absolute;
    width: 500px;
    left: 0;
    top: 0;
  }
</style>
