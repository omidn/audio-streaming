<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <!--<audio src="" controls></audio>-->

        <h2>Via Common Voice Interface REST API</h2>

        <h3>Sending text to CVI-API and receive text from CVI-API</h3>
        <h4>Text-Input</h4>
        <textarea>Rezepte des tages</textarea>
        <br>
        <h4>Text-Output</h4>
        <textarea>text-output</textarea>
        <br>
        <p>Time till received text-output: <span id="timer"></span></p>

        <h3>Sending Audio to CVI-API and receive text from CVI-API</h3>
        <h4>Audio-Input</h4>
        <textarea id="audio-in">Rezepte des tages</textarea>
        <br>
        <h4>Text-Output</h4>
        <textarea>text-output</textarea>
        <br>
        <p>Time till received text-output: <span id="timer2"></span></p>
    </div>
</template>

<script>

    // import Audio from './web-audio';
    // var audio = new Audio();
    // console.log(audio);

    import test1 from './test1';
    import test2 from './test2';

    export default {
        name: 'HelloWorld',
        props: {
            msg: String
        },
        mounted() {
            this.init();

        },

        methods: {
            init() {
                test1();
                test2();

            }
        }
    }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
