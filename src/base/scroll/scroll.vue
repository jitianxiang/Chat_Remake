<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    name: 'scroll',
    data() {
      return {
        scroll: null
      }
    },
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      scrollbar: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      listenScrollStart: {
        type: Boolean,
        default: false
      },
      listenScrollEnd: {
        type: Boolean,
        default: false
      },
      scrollX: {
        type: Boolean,
        default: false
      },
      bounce: {
        type: Boolean,
        default: true
      },
      uniqueId: {
        type: Number,
        default: -1
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      },
      pullDownRefresh: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      //防止动画的展示(>20ms)影响高度的计算(=20ms)
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    components: {},
    computed: {},
    methods: {
      _initScroll() {
        if (this.$refs.wrapper) {
          this.scroll = new BScroll(this.$refs.wrapper, {
            probeType: this.probeType,
            click: this.click,
            scrollbar: this.scrollbar,
            scrollX: this.scrollX,
            scrollY: !this.scrollX,
            eventPassthrough: this.scrollX ? 'vertical' : 'horizontal',
            bounce: {
              top: this.bounce,
              bottom: this.bounce,
              left: this.bounce,
              right: this.bounce
            },
            pullDownRefresh: this.pullDownRefresh ? {threshold: 50, stop: 20} : false,
            pullUpLoad: this.pullUpLoad ? {threshold: 50} : false
          })
          //派发滚动事件
          if (this.listenScroll) {
            let me = this
            this.scroll.on('scroll', (pos) => {
              //向父元素派发滑动位置监听事件
              me.$emit('scroll', pos)
            })
          }

          //派发滚动结束事件
          if (this.listenScrollEnd) {
            let me = this
            this.scroll.on('scrollEnd', (pos) => {
              me.$emit('scrollEnd', {distance: pos.x, direction: me.scroll.movingDirectionX, uniqueId: me.uniqueId})
            })
          }

          //派发滚动事件开始事件
          if (this.listenScrollStart) {
            let me = this
            this.scroll.on('scrollStart', () => {
              me.$emit('scrollStart')
            })
          }

          //监听上拉刷新
          if (this.pullUpLoad) {
            this.scroll.on('pullingUp', () => {
              this.$emit('pullingUp')
            })
          }

          //监听下拉加载
          if (this.pullDownRefresh) {
            this.scroll.on('pullingDown', () => {
              this.$emit('pullingDown')
            })
          }

          if (this.beforeScroll) {
            this.scroll.on('beforeScrollStart', () => {
              this.$emit('beforeScroll')
            })
          }
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        //省略许多参数的传递，用arguments表示所有参数
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      scrollBy() {
        this.scroll && this.scroll.scrollBy.apply(this.scroll, arguments)
      },
      finishPullDown() {
        this.scroll && this.scroll.finishPullDown()
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._initScroll()
      })
    },
    watch: {
      //检测数据变化以便重新计算滚动高度使得滚动正确
      data() {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
</style>
