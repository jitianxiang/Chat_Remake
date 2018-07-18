<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  export default {
    name: 'slider',
    data() {
      return {
        children: [],
        slider: null,
        dots: [],
        currentPageIndex: 0,
        timer: null
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    components: {},
    computed: {},
    methods: {
      //初始化宽度
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let child of this.children) {
          this._addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        })

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _play() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slider.next()
        }, this.interval)
      },
      _addClass(el,className) {
        if(this._hasClass(el,className)) return
        let newClass = el.className.split(' ')
        newClass.push(className)
        el.className = newClass.join(' ')
      },
      _hasClass(el,className) {
        let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
        return reg.test(el.className)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoPlay) {
          this._play()
        }
      })

      //监听窗口大小改变事件
      window.addEventListener('resize', () => {
        if (this.slider) {
          this._setSliderWidth(true)
          this.slider.refresh()
        }
      })
    },
    destroyed() {
      clearTimeout(this.timer)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  @import "../../assets/css/constants";

  .slider {
    min-height: .01rem;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-item {
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        a {
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
  }
</style>
