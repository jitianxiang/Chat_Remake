<template>
  <div class="content" ref="content">
    <!--<img :src="src" alt="图片浏览">-->
    <div v-if="picList.length" class="slide-wrapper">
      <div class="slide-content">
        <slider :loop="false" :autoPlay="false">
          <div v-for="item in picList" :key="item.uniqueId">
            <img :src="item.attachment.path"/>
          </div>
        </slider>
      </div>
    </div>
    <i class="iconfont icon-guanbi" @click.stop="closePic"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import {MESSAGE_TYPE} from '../assets/js/constants'
  import Slider from '../base/slider/slider.vue'

  export default {
    name: 'picture-viewer',
    data() {
      return {}
    },
    props: {
      uniqueId: {
        type: String,
        default: ''
      },
      src: {
        type: String,
        default: ''
      }
    },
    data() {
      return {}
    },
    components: {Slider},
    computed: {
      picList() {
        let tmp = []
        this.currentChatList.forEach((chat) => {
          if (chat.msgType === MESSAGE_TYPE.PICTURE) {
            tmp.push(chat)
          }
        })
        return tmp
      },
      ...mapGetters({
        currentChatList: 'GET_CURRENT_CHAT_LIST'
      })
    },
    methods: {
      closePic() {
        this.toggle_picture_viewer_display(false)
      },
      ...mapMutations({
        toggle_picture_viewer_display: 'TOGGLE_PICTURE_VIEWER_DISPLAY'
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/css/constants";

  .content {
    background-color: black;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 100%;
    }

    .slide-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;
      overflow: hidden;
      .slide-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    .icon-guanbi {
      position: absolute;
      top: .1rem;
      right: .1rem;
      font-size: .2rem;
      color: white;
    }
  }
</style>
