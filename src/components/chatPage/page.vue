<template>
  <transition name="slide">
    <div class="chatpage-wrapper">
      <div class="header-wrapper">
        <header-bar>
          <div class="left" slot="left" @click.stop="back">
            <i class="iconfont icon-huise"></i>
            <span>密信</span>
          </div>
          <div class="center" slot="center">{{chatWithContact.nickName}}</div>
          <div class="right" slot="right"></div>
        </header-bar>
      </div>
      <div class="content-wrapper" ref="contentWrapper">
        <chat-list :originList="currentChatList" @scrollStart="scrollStart"
                   ref="chatList"></chat-list>
      </div>
      <div class="functionBar-wrapper" ref="funcbar">
        <function-bar ref="functionBar"></function-bar>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderBar from '../../base/header-bar/header-bar.vue'
  import {mapGetters, mapMutations} from 'vuex'
  import FunctionBar from './FunctionBar.vue'
  import ChatList from './ChatList.vue'

  export default {
    name: 'chatPage_page',
    data() {
      return {
        barHeight: '',
        timer: null
      }
    },
    components: {HeaderBar, FunctionBar, ChatList},
    computed: {
      ...mapGetters({
        functionChooseStatus: 'GET_FUNCTION_CHOOSE_STATUS',
        chatWithContact: 'GET_CURRENT_CHATWITH_CONTACT',
        currentChatList: 'GET_CURRENT_CHAT_LIST'
      })
    },
    methods: {
      back() {
        this.$router.back()
      },
      scrollStart() {
        this.$refs.functionBar._blurInputBtn()
        if (this.functionChooseStatus) {
          this.set_functionchoose_status(false)
        }
      },
      getBarHeight() {
        const height = this.$refs.functionBar.$el.clientHeight
        if (height !== this.barHeight) {
          let tmp = 587 - 42 - height
          this.$refs.contentWrapper.style.height = tmp + 'px'
          this.$refs.chatList._refreshScroll()
          this.barHeight = height
        }
        this.timer = setTimeout(() => {
          this.getBarHeight()
        }, 500)
      },
      ...mapMutations({
        set_functionchoose_status: 'SET_FUNCTION_CHOOSE_STATUS'
      }),
    },
    mounted() {
      this.barHeight = this.$refs.functionBar.$el.clientHeight
      this.getBarHeight()
    },
    watch: {},
    destroyed() {
      console.log('destroyed')
      this.timer = null
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .chatpage-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;

    .header-wrapper {
      flex: 0 0 .4rem;
      width: 100%;
      height: .4rem;
      background: black;
      font-size: .2rem;
      color: white;
      .left {
        font-size: 0;
        .icon-huise {
          font-size: .3rem;
          vertical-align: middle;
        }
        span {
          font-size: .2rem;
          vertical-align: middle;
        }
      }

      .right {
        width: .7rem;
      }
    }

    .content-wrapper {
      flex: 1 1 auto;
      height: calc(100vh - .82rem);
      overflow-x: hidden;
    }

    .functionBar-wrapper {
      flex: 0 0 .4rem;
    }
  }
</style>
