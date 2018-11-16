<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <audio src="" controls></audio>
  </div>
</template>

<script>

import Audio from './web-audio';
var audio = new Audio();
console.log(audio);

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
