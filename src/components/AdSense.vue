<template>
  <div class="adsense-container">
    <ins
      class="adsbygoogle"
      :style="adStyle"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
      :data-full-width-responsive="responsive"
    ></ins>
  </div>
</template>

<script>
export default {
  name: 'AdSense',
  props: {
    adClient: {
      type: String,
      default: 'ca-pub-2813195378092882'
    },
    adSlot: {
      type: String,
      default: ''
    },
    adFormat: {
      type: String,
      default: 'auto'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100px'
    },
    responsive: {
      type: Boolean,
      default: 'true'
    }
  },
  data() {
    return {
      scriptLoaded: false
    }
  },
  computed: {
    adStyle() {
      return {
        display: 'block',
        width: this.width,
        height: this.height
      }
    }
  },
  mounted() {
    this.loadAdScript()
  },
  methods: {
    loadAdScript() {
      if (this.scriptLoaded) {
        this.refreshAd()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + this.adClient
      script.async = true
      script.crossorigin = 'anonymous'
      script.onload = () => {
        this.scriptLoaded = true
        this.$nextTick(() => {
          if (window.adsbygoogle) {
            try {
              adsbygoogle.push({})
            } catch (e) {
              console.error('AdSense error:', e)
            }
          }
        })
      }
      document.head.appendChild(script)
    },
    refreshAd() {
      this.$nextTick(() => {
        if (window.adsbygoogle) {
          try {
            adsbygoogle.push({})
          } catch (e) {
            console.error('AdSense refresh error:', e)
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.adsense-container {
  margin: 20px 0;
  text-align: center;
  min-height: 100px;
}
</style>
