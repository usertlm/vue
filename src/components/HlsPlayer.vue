<template>
  <div class="hls-player">
    <div class="section-header">
      <h2 class="section-heading">🎬 直播测试</h2>
    </div>
    <div v-if="error" class="error-msg">{{ error }}</div>
    <div class="video-wrapper">
      <video
        ref="videoElement"
        controls
        autoplay
        muted
        playsinline
        class="video-player"
      ></video>
    </div>
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
      error: '',
      hls: null
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

      this.error = ''

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = this.src
        video.addEventListener('error', this.handleNativeError)
        return
      }

      if (Hls.isSupported()) {
        this.hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        })

        this.hls.loadSource(this.src)
        this.hls.attachMedia(video)

        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {})
        })

        this.hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                this.error = '网络错误，请检查网络连接'
                this.hls?.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                this.error = '媒体错误，尝试恢复...'
                this.hls?.recoverMediaError()
                break
              default:
                this.error = '播放失败: ' + (data.details || '未知错误')
                this.destroyPlayer()
                break
            }
          } else {
            this.error = '警告: ' + (data.details || '加载问题')
          }
        })
      } else {
        this.error = '您的浏览器不支持 HLS 播放'
      }
    },

    handleNativeError(_e) {
      this.error = '原生播放失败'
      if (Hls.isSupported()) {
        this.hls = new Hls()
        this.hls.loadSource(this.src)
        this.hls.attachMedia(this.$refs.videoElement)
      }
    },

    destroyPlayer() {
      if (this.hls) {
        this.hls.stopLoad()
        this.hls.destroy()
        this.hls = null
      }
    }
  }
}
</script>

<style scoped>
.hls-player {
  margin: 0 auto 40px;
  text-align: center;
}

.section-header {
  margin-bottom: 20px;
}

.section-heading {
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 500;
  color: #141413;
  line-height: 1.20;
}

.video-wrapper {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: rgba(0,0,0,0.05) 0px 4px 24px;
  border: 1px solid #f0eee6;
}

.video-player {
  width: 100%;
  max-width: 800px;
  height: 450px;
  background: #141413;
  display: block;
}

.error-msg {
  color: #b53333;
  padding: 10px 16px;
  margin-bottom: 12px;
  background: #faf9f5;
  border: 1px solid #e8e6dc;
  border-radius: 8px;
  font-size: 14px;
  display: inline-block;
}
</style>
