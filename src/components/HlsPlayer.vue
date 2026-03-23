<template>
  <div class="hls-player">
    <h3>直播页面</h3>
    <div v-if="error" class="error">{{ error }}</div>
    <video
      ref="videoElement"
      controls
      autoplay
      muted
      class="video-player"
    ></video>
  </div>
</template>

<script>
import Hls from 'hls.js'

export default {
  name: 'HlsPlayer',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      error: ''
    }
  },
  mounted() {
    this.initPlayer()
  },
  beforeUnmount() {
    this.destroyPlayer()
  },
  methods: {
    initPlayer() {
      const video = this.$refs.videoElement
      if (!video) return

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        })
        hls.loadSource(this.src)
        hls.attachMedia(video)
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            this.error = '加载失败，请检查直播源'
            console.error('HLS fatal error:', data)
          }
        })
        this.hls = hls
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS support
        video.src = this.src
      } else {
        this.error = '您的浏览器不支持 HLS 播放'
      }
    },
    destroyPlayer() {
      if (this.hls) {
        this.hls.destroy()
        this.hls = null
      }
    }
  }
}
</script>

<style scoped>
.hls-player {
  margin: 20px 0;
  text-align: center;
}

.video-player {
  width: 100%;
  max-width: 800px;
  height: 450px;
  background: #000;
  border-radius: 8px;
}

.error {
  color: #ff4444;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
