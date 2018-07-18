<template>
  <scroll class="listview"
          :data="data"
          :listenScroll="true"
          :probeType="3"
          @scroll="scroll"
          ref="listview">
    <ul>
      <li v-for="(group,index) in data" class="list-group" :key="index" ref="listgroup">
        <p class="list-group-title">{{group.title}}</p>
        <ul>
          <li v-for="(item,index) in group.items" class="list-group-item" :key="index"
              @click="showMemberInfo(item)">
            <img v-lazy="`/static/avatars/${item.image}`" class="avatar"/>
            <div class="name">
              <p>{{item.nickName}}</p>
              <p>{{item.position}}</p>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shotcut" @touchstart="onShotCutTouchStart" @touchmove.stop.prevent="onShotCutTouchMove">
      <ul>
        <li v-for="(item,index) in shotcutList" class="item" :class="{'current':currentIndex === index}" :key="index"
            :data-index="index">{{item}}


        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../../base/scroll/scroll.vue'

  export default {
    name: 'listview',
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        listHeight: [],
        diff: -1,
        fixedTop: -1
      }
    },
    props: {
      data: Array,
      default() {
        return []
      }
    },
    created() {
      this.touch = {}
    },
    components: {Scroll},
    computed: {
      shotcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      showMemberInfo(item) {
        this.$emit('emitClick', item)
      },
      //通过给li标签绑定个属性（带有index），然后通过js的getAttribute方法获取属性值
      onShotCutTouchStart(el) {
        let anchorIndex = this._getData(el.target, 'index')
        let firstTouch = el.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShotCutTouchMove(el) {
        let firstTouch = el.touches[0]
        this.touch.y2 = firstTouch.pageY
        //两次Y轴上的差值除以每个的高度并向下取整
        let delta = (this.touch.y2 - this.touch.y1) / 18 | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _getData(el, name, val) {
        const prefix = 'data-'
        name = prefix + name
        if (val) {
          return el.setAttribute(name, val)
        } else {
          return el.getAttribute(name)
        }
      },
      _scrollTo(index) {
        if (!index && index !== 0) return  //屏蔽掉剩余可点击部分
        //上下滑动可能越界的情况
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listgroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
//      data() {
//        //DOM渲染完成后计算高度
//        setTimeout(() => {
//          this._calculateHeight()
//        }, 20)
//      },
      scrollY(newY) {
        const listHeight = this.listHeight
        //当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        //中间部分正常滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        //滚动到底部且-newY大于最后一个区间上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < 30) ? newVal - 30 : 0
        if (this.fixedTop === fixedTop) return //避免频繁的dom操作
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    mounted() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  @import "../../assets/css/constants";

  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /*background: white;*/
    font-size: 0;
    .list-group {
      /*padding-bottom: .3rem;*/
      font-size: 0;
      .list-group-title {
        height: .3rem;
        line-height: .3rem;
        padding-left: .2rem;
        font-size: $font-size-small;
        color: black;
        background: grey;
      }

      .list-group-item {
        display: flex;
        align-items: center;
        padding: .15rem 0 0.1rem .15rem;
        font-size: 0;
        border-bottom: .01rem solid grey;
        .avatar {
          width: .5rem;
          height: .5rem;
          border-radius: 50%;
        }
        .name {
          margin-left: .2rem;
          color: black;
          font-size: $font-size-medium;
          p {
            padding: .05rem 0;
          }
        }
      }
    }

    .list-shotcut {
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: .2rem;
      padding: .2rem 0;
      border-radius: .1rem;
      text-align: center;
      background: $color-background-d;
      font-family: Helvetica;
      .item {
        padding: .03rem;
        line-height: 1;
        list-style-type: none;
        color: $color-text-l;
        font-size: $font-size-small;
        &.current {
          color: $color-theme
        }
      }
    }

    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title {
        height: .3rem;
        line-height: .3rem;
        padding-left: .2rem;
        margin: 0;
        font-size: $font-size-small;
        color: black;
        background: grey;
      }
    }
  }
</style>
