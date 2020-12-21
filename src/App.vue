<template>
  <div id="app">
    <img height="50px" alt="Vue logo" src="favicon.ico">
    <HelloWorld msg="El Stupidos Watermark"/>

    <input type="file" @change="onFileChange" />
    <br><br>
    <button
            v-for="color in colors"
            v-on:click="option_temp.fillStyle = color"
            :key="color"
            style="text-transform: capitalize">
      {{ color }}
    </button>
    <h4 style="text-transform: capitalize">{{ option_temp.fillStyle }}</h4>
    <button v-if="url" v-on:click="loadFrames">Generate Image</button>
    <hr>
    <div v-if="frames.length">
      <div id="preview" v-for="frame in frames" :key="frame.key">
        <img v-if="url" v-watermark="frame.option" :src="frame.url"/>
      </div>
    </div>

  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import mergeImages from 'merge-images';

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      qr_code_size: 50,
      meta: {},
      url: null,
      frames: [],
      modes: [
              'bottomright',
              'bottomleft',
              'topright',
              'topleft',
      ],
      colors: [
              'black',
              'white',
              'red',
              'blue',
              'green'
      ],
      option_temp: {
        mode: "bottomright",
        textBaseline: "middle",
        font: "15px Ariel",
        fillStyle: "black",
        content: "El Stupidos @StupidosEl" +
                " - " +
                "Whatsapp: +220 3710040",
        rotate: 15
      }
    }
  },
  methods: {
    loadFrames() {
      this.frames = [];

      for (let mode of this.modes)
      {

        let pos = {};

        switch (mode) {

          case "bottomleft":
            pos = {
              x: this.meta.w - this.qr_code_size,
              y: 0,
            };
            break;
          case "bottomright":
            pos = {
              x: 0,
              y: 0,
            };
            break;
          case "topleft":
            pos = {
              x: this.meta.w - this.qr_code_size,
              y: this.meta.h - this.qr_code_size,
            };
            break;
          case "topright":
            pos = {
              x: 0,
              y: this.meta.h - this.qr_code_size,
            };
            break;
        }

        mergeImages([
          { src: this.url, height: '100px' },
          { src: 'el-stupidos-watermark/QRcode.png', height: '100px', x: pos.x, y: pos.y },
        ])
                .then(b64 => {
                  this.frames.push({
                    key: mode,
                    url: b64,
                    option: {
                      mode: mode,
                      textBaseline: this.option_temp.textBaseline,
                      font: this.option_temp.font,
                      fillStyle: this.option_temp.fillStyle,
                      content: this.option_temp.content,
                      rotate: this.option_temp.rotate,
                    },
                  });
                });
      }

    },
    async getMeta() {

      const img = new Image;

      let this_obj = this;

      img.onload = await function() {
        this_obj.meta.w = this.width;
        this_obj.meta.h = this.height;
      };

      img.src = this.url;

      return this_obj.meta;
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);

      this.getMeta();
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background-color: #e2e2e2;
}

#app {
  padding: 20px;
}

#preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

#preview img {
  max-width: 100%;
  max-height: 500px;
  margin: 2%;
}
</style>
