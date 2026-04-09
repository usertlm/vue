<template>
  <div class="hls-player">
    <div class="section-header">
      <h2 class="section-heading">🎬 直播</h2>
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

        this.hls.on(Hls.Events.ERROR, (_event, data) => {
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
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari iOS native HLS
        video.src = this.src
        video.addEventListener('error', () => this.handleNativeError(video))
      } else {
        this.error = '您的浏览器不支持 HLS 播放'
      }
    },

    handleNativeError(video) {
      this.destroyPlayer()
      if (Hls.isSupported()) {
        this.hls = new Hls({ enableWorker: true, lowLatencyMode: true })
        this.hls.loadSource(this.src)
        this.hls.attachMedia(video)
        this.hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            this.error = '播放失败: ' + (data.details || '未知错误')
            this.destroyPlayer()
          }
        })
        this.error = ''
      } else {
        this.error = '播放失败，请检查网络或换用其他浏览器'
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
  width: 100%;
}

.section-header {
  padding: 16px 20px 8px;
}

.section-heading {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.error-msg {
  padding: 10px 16px;
  margin: 0 16px 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 14px;
  text-align: center;
}

.video-wrapper {
  position: relative;
  width: 100%;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

.video-player {
  width: 100%;
  display: block;
  max-height: 480px;
  object-fit: contain;
  background: #000;
}
</style>
