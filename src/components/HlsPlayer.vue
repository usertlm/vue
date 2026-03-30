<template>
  <div class="hls-player">
    <h3>🎬 直播测试</h3>
    <div v-if="error" class="error">{{ error }}</div>
    <video
      ref="videoElement"
      controls
      autoplay
      muted
      playsinline
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

      // Check if native HLS is supported (Safari iOS/macOS)
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Using native HLS support')
        video.src = this.src
        video.addEventListener('error', this.handleNativeError)
        return
      }

      // Check if Hls.js is supported
      if (Hls.isSupported()) {
        console.log('Using Hls.js')
        this.hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        })
        
        this.hls.loadSource(this.src)
        this.hls.attachMedia(video)
        
        this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log('HLS Manifest parsed, levels:', data.levels)
          video.play().catch(e => console.log('Play error:', e))
        })
        
        this.hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', event, data)
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
    
    handleNativeError(e) {
      console.error('Native HLS error:', e)
      this.error = '原生播放失败，尝试使用 Hls.js'
      // Fallback - try Hls.js if native fails
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
  color: #ff6b6b;
  padding: 10px;
  margin-bottom: 10px;
  background: #ffe6e6;
  border-radius: 4px;
}


</style>
