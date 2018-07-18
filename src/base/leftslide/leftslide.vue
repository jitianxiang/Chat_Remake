<template>
  <scroll class="scroll_item"
          :scrollX=true
          :eventPassthrough="vertical"
          :listenScrollEnd="true"
          :listenScrollStart="true"
          :bounce="false"
          :scrollbar="false"
          :uniqueId="index"
          @scrollStart="scrollStart"
          @scrollEnd="scrollEnd" ref="scrollItem">
    <div ref="wrapper" v-click-outside="scrollToOrigin" @click="orignClick">
      <slot name="visible" class="visible"></slot>
      <slot name="invisible" class="invisible"></slot>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../../base/scroll/scroll.vue'
  import ClickOutside from 'vue-click-outside'

  export default {
    name: 'leftslide',
    data() {
      return {
        vertical: 'vertical',
        posX: 1
      }
    },
    props: {
      liItem: {
        type: Object
      },
      index: {
        type: Number,
        default: -1
      }
    },
    components: {Scroll},
    computed: {},
    methods: {
      setWidth() {
        let width = 0
        let height = 0
        for (let child of this.$refs.wrapper.children) {
          width += child.clientWidth
        }
        this.$refs.wrapper.style.width = width + 'px'
        height = this.$refs.scrollItem.$el.clientHeight
        this.$refs.wrapper.style.height = height + 'px'
        this.$refs.scrollItem.$el.style.height = height + 'px'
      },
      scrollStart() {
        //监听滑动开始事件，让其他滑出来的item滑回去
        this.$emit('scrollStart', this.index)
      },
      scrollEnd(pos) {
        //判断滑动方向
        if (pos.direction === 1) {
          if (pos.distance < -30 && pos.distance !== -100) {
            this._scrollTo(pos.distance, -100, 300)
          } else if (pos.distance >= -30) {
            this._scrollTo(pos.distance, 0, 300)
          } else {
            this.posX = pos.distance
          }
        } else if (pos.direction === -1) {
          if (pos.distance >= -70) {
            this._scrollTo(pos.distance, 0, 300)
          } else if (pos.distance < -70 && pos.distance !== -100) {
            this._scrollTo(pos.distance, -100, 300)
          } else {
            this.posX = pos.distance
          }
        }
      },
      scrollToOrigin() {
        this._scrollTo(1, 0, 300)
      },
      orignClick() {
        if (this.posX === -100) {
          this.$emit('emitClick', {
            data: this.liItem,
            flag: false
          })
        } else {
          this.$emit('emitClick', {
            data: this.liItem,
            flag: true
          })
        }
        this.scrollToOrigin()
      },
      _scrollTo(distance, startX, time) {
        this.posX = distance
        this.$refs.scrollItem.scrollTo(startX, 0, time)
      }
    },
    mounted() {
      //设置初始宽度以便scroll的初始化
      this.setWidth()
    },
    directives: {
      ClickOutside
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .scroll_item {
    width: 100%;
    /*height: 100%;*/
    overflow: hidden;
  }
</style>
