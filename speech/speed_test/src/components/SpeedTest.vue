<template>
  <div class="page">
    <h1 class="title">{{ msg }}</h1>

    <div class="main">
      <div class="content-wp">
        <div class="content__el input">
          <h3 class="content__title">
            <span class="content__title__inner">input</span>
          </h3>
          <div class="content__main input__content" ref="inputContent">input-content</div>
        </div>
        <div class="content__el action">
          <h3 class="content__title">
            <span class="content__title__inner">action</span>
          </h3>
          <div class="action__main">
            <div
              class="action__el action__voice-speaks"
              v-bind:class="{ active: activeAction==='actionVoiceSpeaks' }"
              ref="actionVoiceSpeaks"
            >
              <div class="action__el__inner">voice speaks</div>
            </div>
            <div
              class="action__el action__voice-recog"
              v-bind:class="{ active: activeAction==='actionVoiceRecognition' }"
              ref="actionVoiceRecog"
            >
              <div class="action__el__inner">voice-recognition</div>
            </div>
            <div
              class="action__el action__request"
              v-bind:class="{ active: activeAction==='actionRequest' }"
              ref="actionRequest"
            >
              <div class="action__el__inner">request</div>
            </div>
          </div>
        </div>
        <div class="content__el output">
          <h3 class="content__title">
            <span class="content__title__inner">output</span>
          </h3>
          <div class="content__main output__content" ref="outputContent">output-content</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "smartvoice",
  props: {
    msg: String
  },
  data: () => {
    return {
      activeAction: "actionVoiceSpeaks"
    };
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.$refs);
      // console.log(this);
      this.$data.activeAction = "actionVoiceRecognition";
      this.$data.activeAction = "actionRequest";
      console.log(this.$data.activeAction);
      this.init();
    });
  },

  created() {
    // console.log("created", this);
  },

  methods: {
    init() {
      // this.activeAction = "actionsVoiceSpeaks";
      // this.activeActionClass = "action_el_active";
    }

    // actionSetActive() {
    //   const dom = this$refs[this.activeAction];
    //   const activ
    //   dom
    // }
  }
};
</script>


<style scoped lang="scss">
.page {
  display: flex;
  justify-content: center;
  flex-direction: column;

  height: 100vh;
  padding: 20px 15px;
}

.title {
  margin: 0 0 10px;
  padding: 10px;
  border-radius: 10px;
  font-size: 26px;
  background: pink;
}

.main {
  display: flex;
  justify-content: center;

  height: 90vh;
}

.content-wp {
  display: flex;
  justify-content: center;

  width: 100%;

  background: lightgoldenrodyellow;
}

.content__el {
  border-radius: 10px;
  padding: 10px;

  &:nth-child(2) {
    margin-left: 10px;
    margin-right: 10px;
  }
}

.content__title {
  display: flex;
  justify-content: center;
  flex-direction: column;

  position: relative;
  width: 100%;
  height: 10%;
  margin: 0;
  // padding: 20px;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    background: white;
  }
}

.content__title__inner {
  position: relative;
}

.input {
  width: 40%;
  background: lightgreen;
}

.output {
  width: 40%;
  background: lightsteelblue;
}

.action {
  width: 20%;
  background: lightsalmon;
}

.action__main {
  display: flex;
  justify-content: center;
  flex-direction: column;

  height: 90%;
  // padding: 10px 0;

  // background: lightgrey;
}

.action__el {
  display: flex;
  justify-content: center;
  flex-direction: column;

  height: 33.33%;

  &.active {
    // background: lightgoldenrodyellow;
    position: relative;
    font-weight: bold;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: white;
      // animation: blink 1500ms ease-in-out infinite;
      border-radius: 4px;
      border: 2px solid red;
    }
  }
}

.action__el__inner {
  position: relative;
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
</style>
