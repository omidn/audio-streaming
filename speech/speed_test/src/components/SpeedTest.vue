<template>
  <div class="page">
    <h1 class="title">{{ msg }}</h1>

    <div class="main">
      <div class="content-wp">
        <div class="content__el input">
          <h3 class="content__title">
            <span class="content__title__inner">input</span>
          </h3>
          <div class="content__main input__content">input-content</div>
        </div>
        <div class="content__el action">
          <h3 class="content__title">
            <span class="content__title__inner">action</span>
          </h3>
          <div class="action__main">
            <div class="action__el action__voice-speaks">voice speaks</div>
            <div class="action__el action_el_active action__voice-recog">voice-recognition</div>
            <div class="action__el action__request">request</div>
          </div>
        </div>
        <div class="content__el output">
          <h3 class="content__title">
            <span class="content__title__inner">output</span>
          </h3>
          <div class="content__main output__content">output-content</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "smart voice",
  props: {
    msg: String
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {}
  }
};
</script>


<style scoped lang="scss">
.page {
  display: flex;
  justify-content: center;
  flex-direction: column;

  height: 100vh;
}

.title {
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
  margin: 2px;
}

.content__title {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 20px;
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

  // background: lightgrey;
}

.action__el {
  height: 30%;
}

.action_el_active {
  background: lightgoldenrodyellow;
}
</style>
