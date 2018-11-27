<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <audio src="" controls></audio>
  </div>
</template>

<script>

import Audio from './web-audio';
// import axios from 'axios';
var audio = new Audio();
console.log(audio);

// const HEADER = {
//     'Host': 'skill-edge.smartvoicehub.de',
//     'Content-Type': 'application/json',
//     'cache-control': 'no-cache',
//     'Postman-Token': '55791771-363a-474c-b4ad-539ab1a05663'
// }
//
// let url = '/dummy_data/user_login_skill_edge.json';

// let prom = axios({
//     method:'post',
//     url,
//     headers: {
//         ...HEADER
//     },
// }).then(data => {
//     return new Promise((resolve, reject) => {
//         return resolve(data);
//     }).catch(err => {
//         return new Promise((resolve, reject) => {
//             return reject(err);
//         });
//     });
//
// prom.then( response =>{
//     console.log( 'response', response );
//   }).catch(err => {
//       console.log('ERROR', err);
//     }
//   );


export default SpeedTest {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
