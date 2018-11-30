<template>
    <div class="hello">
        <h1>{{ msg }}</h1>

        <h2>Via Common Voice Interface REST API</h2>

        <h3>Sending text to CVI-API and receive text from CVI-API</h3>
        <div class="container">
        <div class="container__left">
        <h4>Text-Input</h4>
        <textarea>Rezepte des tages</textarea>
        </div>

        <div class="container__right">
        <h4>Text-Output</h4>
        <textarea id="text-output-1">text-output</textarea>
        </div>
        </div>
        <p class="time-output">Time till received text-output: <span id="timer-1"></span></p>
        <br>

        <!--<h3>Sending Audio to CVI-API and receive text from CVI-API</h3>-->
        <!--<div class="container">-->
        <!--<div class="container__left">-->
        <!--<h4>Audio-Input</h4>-->
        <!--<textarea id="audio-in">Erzähle mir einen Witz</textarea>-->
        <!--</div>-->

        <!--<div class="container__right">-->
        <!--<h4>Text-Output</h4>-->
        <!--<textarea id="text-output-2">text-output</textarea>-->
        <!--</div>-->
        <!--</div>-->
        <!--<p class="time-output">Time till received text-output: <span id="timer-2"></span></p>-->
        <!--<br>-->


        <!--<h3>Record voice via mic and sending Audio to CVI-API and receive text from CVI-API</h3>-->
        <!--<div class="container">-->
            <!--<div class="container__left">-->
                <!--<h4>Audio-Input</h4>-->
                <!--<textarea id="audio-in-2">Erzähle mir einen Witz</textarea>-->
            <!--</div>-->

            <!--<div class="container__right">-->
                <!--<h4>Text-Output</h4>-->
                <!--<textarea id="text-output-3">text-output</textarea>-->
            <!--</div>-->
        <!--</div>-->
        <!--<p class="time-output">Time till received text-output: <span id="timer-3"></span></p>-->
        <!--<button type="button" id="record-button" class="record-not-active">-->
            <!--<span class="record-not-active__text">start recording</span>-->
            <!--<span class="record-active__text">stop recording</span>-->
        <!--</button>-->

        <!--<br>-->
        <!--<ul id="downloads">-->

        <!--</ul>-->

        <!--<select id="voice-select">-->

        <!--</select>-->
        <!--<select data-v-203ed0f9="" id="voice-select">-->
            <!--&lt;!&ndash;<option data-lang="en-US" data-name="Alex">Alex (en-US) &#45;&#45; DEFAULT</option>&ndash;&gt;-->
            <!--&lt;!&ndash;<option data-lang="it-IT" data-name="Alice">Alice (it-IT)</option>&ndash;&gt;-->
            <!--&lt;!&ndash;<option data-lang="sv-SE" data-name="Alva">Alva (sv-SE)</option>&ndash;&gt;-->
            <!--&lt;!&ndash;<option data-lang="fr-CA" data-name="Amelie">Amelie (fr-CA)</option>&ndash;&gt;-->
            <!--<option data-lang="de-DE" data-name="Anna">Anna (de-DE)</option>-->
            <!--&lt;!&ndash;<option data-lang="he-IL" data-name="Carmit">Carmit (he-IL)</option>&ndash;&gt;-->
            <!--&lt;!&ndash;<option data-lang="id-ID" data-name="Damayanti">Damayanti (id-ID)</option>&ndash;&gt;-->
            <!--&lt;!&ndash;<option data-lang="en-GB" data-name="Daniel">Daniel (en-GB)</option>&ndash;&gt;-->
            <!--&lt;!&ndash;<option data-lang="es-AR" data-name="Diego">Diego (es-AR)</option>&ndash;&gt;-->
            <!--&lt;!&ndash;<option data-lang="nl-BE" data-name="Ellen">Ellen (nl-BE)</option>&ndash;&gt;-->
            <!--&lt;!&ndash;<option data-lang="en" data-name="Fiona">Fiona (en)</option>&ndash;&gt;-->
            <!--&lt;!&ndash;<option data-lang="en-US" data-name="Fred">Fred (en-US)</option>&ndash;&gt;-->
            <!--&lt;!&ndash;<option data-lang="id-ID" data-name="Google Bahasa Indonesia">Google Bahasa Indonesia (id-ID)</option>&ndash;&gt;-->
            <!--<option data-lang="de-DE" data-name="Google Deutsch">Google Deutsch (de-DE)</option>-->
            <!--<option data-lang="es-ES" data-name="Google español">Google español (es-ES)</option>-->
            <!--<option data-lang="es-US" data-name="Google español de Estados Unidos">Google español de Estados Unidos-->
                <!--(es-US)-->
            <!--</option>-->
            <!--<option data-lang="fr-FR" data-name="Google français">Google français (fr-FR)</option>-->
            <!--<option data-lang="it-IT" data-name="Google italiano">Google italiano (it-IT)</option>-->
            <!--<option data-lang="nl-NL" data-name="Google Nederlands">Google Nederlands (nl-NL)</option>-->
            <!--<option data-lang="pl-PL" data-name="Google polski">Google polski (pl-PL)</option>-->
            <!--<option data-lang="pt-BR" data-name="Google português do Brasil">Google português do Brasil (pt-BR)</option>-->
            <!--<option data-lang="en-GB" data-name="Google UK English Female">Google UK English Female (en-GB)</option>-->
            <!--<option data-lang="en-GB" data-name="Google UK English Male">Google UK English Male (en-GB)</option>-->
            <!--<option data-lang="en-US" data-name="Google US English">Google US English (en-US)</option>-->
            <!--<option data-lang="ru-RU" data-name="Google русский">Google русский (ru-RU)</option>-->
            <!--<option data-lang="hi-IN" data-name="Google हिन्दी">Google हिन्दी (hi-IN)</option>-->
            <!--<option data-lang="zh-TW" data-name="Google 國語（臺灣）">Google 國語（臺灣） (zh-TW)</option>-->
            <!--<option data-lang="ja-JP" data-name="Google 日本語">Google 日本語 (ja-JP)</option>-->
            <!--<option data-lang="ko-KR" data-name="Google 한국의">Google 한국의 (ko-KR)</option>-->
            <!--<option data-lang="zh-CN" data-name="Google&nbsp;普通话（中国大陆）">Google&nbsp;普通话（中国大陆） (zh-CN)</option>-->
            <!--<option data-lang="zh-HK" data-name="Google&nbsp;粤語（香港）">Google&nbsp;粤語（香港） (zh-HK)</option>-->
            <!--<option data-lang="ro-RO" data-name="Ioana">Ioana (ro-RO)</option>-->
            <!--<option data-lang="pt-PT" data-name="Joana">Joana (pt-PT)</option>-->
            <!--<option data-lang="es-ES" data-name="Jorge">Jorge (es-ES)</option>-->
            <!--<option data-lang="es-MX" data-name="Juan">Juan (es-MX)</option>-->
            <!--<option data-lang="th-TH" data-name="Kanya">Kanya (th-TH)</option>-->
            <!--<option data-lang="en-AU" data-name="Karen">Karen (en-AU)</option>-->
            <!--<option data-lang="ja-JP" data-name="Kyoko">Kyoko (ja-JP)</option>-->
            <!--<option data-lang="sk-SK" data-name="Laura">Laura (sk-SK)</option>-->
            <!--<option data-lang="hi-IN" data-name="Lekha">Lekha (hi-IN)</option>-->
            <!--<option data-lang="it-IT" data-name="Luca">Luca (it-IT)</option>-->
            <!--<option data-lang="pt-BR" data-name="Luciana">Luciana (pt-BR)</option>-->
            <!--<option data-lang="ar-SA" data-name="Maged">Maged (ar-SA)</option>-->
            <!--<option data-lang="hu-HU" data-name="Mariska">Mariska (hu-HU)</option>-->
            <!--<option data-lang="zh-TW" data-name="Mei-Jia">Mei-Jia (zh-TW)</option>-->
            <!--<option data-lang="el-GR" data-name="Melina">Melina (el-GR)</option>-->
            <!--<option data-lang="ru-RU" data-name="Milena">Milena (ru-RU)</option>-->
            <!--<option data-lang="en-IE" data-name="Moira">Moira (en-IE)</option>-->
            <!--<option data-lang="es-ES" data-name="Monica">Monica (es-ES)</option>-->
            <!--<option data-lang="nb-NO" data-name="Nora">Nora (nb-NO)</option>-->
            <!--<option data-lang="es-MX" data-name="Paulina">Paulina (es-MX)</option>-->
            <!--<option data-lang="en-US" data-name="Samantha">Samantha (en-US)</option>-->
            <!--<option data-lang="da-DK" data-name="Sara">Sara (da-DK)</option>-->
            <!--<option data-lang="fi-FI" data-name="Satu">Satu (fi-FI)</option>-->
            <!--<option data-lang="zh-HK" data-name="Sin-ji">Sin-ji (zh-HK)</option>-->
            <!--<option data-lang="en-ZA" data-name="Tessa">Tessa (en-ZA)</option>-->
            <!--<option data-lang="fr-FR" data-name="Thomas">Thomas (fr-FR)</option>-->
            <!--<option data-lang="zh-CN" data-name="Ting-Ting">Ting-Ting (zh-CN)</option>-->
            <!--<option data-lang="en-IN" data-name="Veena">Veena (en-IN)</option>-->
            <!--<option data-lang="en-US" data-name="Victoria">Victoria (en-US)</option>-->
            <!--<option data-lang="nl-NL" data-name="Xander">Xander (nl-NL)</option>-->
            <!--<option data-lang="tr-TR" data-name="Yelda">Yelda (tr-TR)</option>-->
            <!--<option data-lang="ko-KR" data-name="Yuna">Yuna (ko-KR)</option>-->
            <!--<option data-lang="ru-RU" data-name="Yuri">Yuri (ru-RU)</option>-->
            <!--<option data-lang="pl-PL" data-name="Zosia">Zosia (pl-PL)</option>-->
            <!--<option data-lang="cs-CZ" data-name="Zuzana">Zuzana (cs-CZ)</option>-->
        <!--</select>-->
    </div>
</template>

<script>
    import recorderUse from './recorderUse';
    // import Voice from './voice';

    import test1 from './test1';
    // import test2 from './test2';

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
                // let voice = new Voice(()=>{
                //     // voice.speak('Hallo');
                // });
                // console.log(voice);
                // voice.speak('Hallo Du');
                test1();
                // test2();
                // recorderUse();


            }
        }
    }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    h4, h3 {
        margin: 0;
    }

    h3 {
        text-decoration: underline;
        margin-bottom: 3px;
    }
</style>

<style scoped>
    .container {
        display: flex;
        justify-content: center;

    }

    .container__left,
    .container__right {
        padding: 0 10px;
    }

    .time-output {
        margin: 0;
    }

    .record-active .record-active__text {
        display: block;
    }

    .record-active .record-not-active__text {
        display: none;
    }

    .record-not-active .record-active__text {
        display: none;
    }

    .record-not-active .record-not-active__text {
        display: block;
    }


</style>
