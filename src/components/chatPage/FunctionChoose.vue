<template>
  <div class="grid">
    <div class="item">
      <i class="sign iconfont icon-tupian" @click.stop="onClickFunction(0)"></i>
      <p>图片</p>
    </div>

    <div class="item">
      <i class="sign iconfont icon-xiangji" @click.stop="onClickFunction(1)"></i>
      <p>拍摄</p>
    </div>

    <div class="item">
      <i class="sign iconfont icon-dianhua" @click.stop="onClickFunction(2)"></i>
      <p>语音通话</p>

    </div>

    <div class="item">
      <i class="sign iconfont icon-wenjian" @click.stop="onClickFunction(3)"></i>
      <p>文件</p>

    </div>

    <div class="item">
      <i class="sign iconfont icon-jiaotongtaishi" @click.stop="onClickFunction(4)"></i>
      <p>态势</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as constants from '../../assets/js/constants'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {random} from '../../assets/js/utils'

  export default {
    name: 'function-choose',
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        chatWithContact: 'GET_CURRENT_CHATWITH_CONTACT'
      })
    },
    methods: {
      onClickFunction(index) {
        switch (index) {
          /*选择图片发送*/
          case 0:
            this.send_picture_message({
              path: '/static/avatars/1_1_1_002.png',
              contact: this.chatWithContact
            })
            this.set_functionchoose_status(false)
            break
          /*拍照并发送发送*/
          case 1:

            break
          /*电话*/
          case 2:

            break
          /*选择文件发送*/
          case 3:

            break
          /*选择态势文件发送*/
          case 4:

            break
        }
      },
      ...mapActions({
        send_picture_message: 'SEND_PICTURE_MESSAGE'
      }),
      ...mapMutations({
        set_functionchoose_status: 'SET_FUNCTION_CHOOSE_STATUS'
      })
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/constants";

  .grid {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    background-color: #fff;
    font-size: 0.12rem;
    color: white;

    .item {
      text-align: center;
      color: #32342c;
      font-size: 0.14rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 20%;
      margin: 0.1rem 0 0.1rem 0;

      p {
        line-height: 0.2rem;
        width: 0.6rem;
        color: black;
      }

      .sign {
        display: inline-block;
        border-radius: .05rem;
        border: .01rem solid gray;
        padding: .1rem;
        color: #6F7378;
        font-size: 0.3rem;
      }
    }
  }

</style>
