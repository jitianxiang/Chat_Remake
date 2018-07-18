<template>
  <div class="scroll-wrapper">
    <scroll :data="showAllMsgs" class="scroll-content">
      <ul>
        <left-slide :liItem="item" class="item"
                    :key="item.uniqueId"
                    :index="item.uniqueId"
                    @emitClick="emitClick"
                    @scrollStart="scrollStart"
                    ref="leftSlide"
                    v-for="item in showAllMsgs">
          <div class="visible" slot="visible">
            <div class="content">
              <div class="part-1">
                <div class="part-1-1">
                  <img class="head-image" :src="`/static/avatars/${item.chatwith.image}`">
                </div>
                <div class="part-1-2">
                  <h2>{{item.chatwith.nickName}}</h2>
                  <p>{{getRecentMsgContent(getRecentMsg(item.messages))}}</p>
                </div>
              </div>
              <div class="part-2">
                <!--显示时间-->
                <p>{{getMsgTime(getRecentMsg(item.messages).time)}}</p>
              </div>
            </div>
          </div>
          <div class="del" slot="invisible" @click.stop="del(item)">删除</div>
        </left-slide>
      </ul>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapMutations, mapGetters, mapActions} from 'vuex'
  import LeftSlide from '../../base/leftslide/leftslide.vue'
  import Scroll from '../../base/scroll/scroll.vue'
  import * as transformDate from '../../assets/js/transformDate.js'
  import {MESSAGE_TYPE} from '../../assets/js/constants'

  export default {
    name: 'chatHistory_page',
    data() {
      return {
        isActive: true
      }
    },
    components: {LeftSlide, Scroll},
    computed: {
      showAllMsgs() {
        return this.all_msgs_list.sort(function (a, b) {
          return b.messages[b.messages.length - 1].time - a.messages[a.messages.length - 1].time;
        })
      },
      ...mapGetters({
        all_msgs_list: 'GET_ALL_CAHT_LIST'
      })
    },
    methods: {
      del(item) {

      },
      getRecentMsg(msgs) {
        const tmp = msgs.sort((a, b) => {
          return a.time - b.time
        })
        return tmp[tmp.length - 1]
      },
      getRecentMsgContent(msg) {
        if (msg.msgType === MESSAGE_TYPE.TEXT) {
          return msg.content
        } else if (msg.msgType === MESSAGE_TYPE.PICTURE) {
          return '[图片]'
        } else if (msg.msgType === MESSAGE_TYPE.VIDEO) {
          return '[视频]'
        } else if (msg.msgType === MESSAGE_TYPE.AUDIO) {
          return '[音频]'
        } else if (msg.msgType === MESSAGE_TYPE.FILE) {
          return '[文件]'
        }
      },
      getMsgTime(timeStamp) {
        return transformDate.transformDate(timeStamp, 'listitem')
      },
      emitClick({data, flag}) {
        this.isActive = flag
        this.$nextTick(() => {
          if (this.isActive) {
            this.selectItem(data)
          }
        }, 20)
      },
      scrollStart(index) {
        this.$refs.leftSlide.forEach((item, mindex) => {
          if (mindex !== index) {
            item.scrollToOrigin()
          }
        })
      },
      selectItem(data) {
        //修改当前聊天用户；跳转路由
        this.set_current_chatwith_contact(data.chatwith)
        this.$router.push('/chatPage')
      },
      ...mapMutations({
        set_current_chatwith_contact: 'SET_CURRENT_CHATWITH_CONTACT'
      })
    },
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  @import "../../assets/css/constants";

  .scroll-wrapper {
    position: fixed;
    top: .4rem;
    left: 0;
    right: 0;
    bottom: .54rem;

    .scroll-content {
      width: 100vw;
      height: 100%;
      overflow: hidden;

      .item {
        white-space: nowrap;
        width: 100vw;
        font-size: 0;
        .visible {
          display: inline-block;
          width: 100vw;
          font-size: 0.16rem;
          height: .58rem;
          background: #17445e;

          .content {
            color: black;
            display: flex;
            .part-1 {
              width: 75%;
              display: flex;
              padding-left: .1rem;

              .part-1-1 { //头像区域
                width: .58rem;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                flex-shrink: 0;
                .head-image {
                  float: left;
                  margin: .05rem .05rem .05rem 0;
                  width: .48rem;
                  height: .48rem;
                  border-radius: .24rem;
                }
              }

              .part-1-2 { //文本区域
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                flex-grow: 1;
                max-width: 80%;

                .img {
                  width: 0.13rem;
                  height: 0.13rem;
                  margin: 0.05rem 0 0 0.1rem;
                  padding: 0.02rem;
                  flex-shrink: 0;
                }

                p {
                  max-width: 100%;
                  font-size: 0.13rem;;
                  color: white;
                  @include text-ellipsis;
                  margin: 0.05rem 0 0 0.1rem;
                  padding: 0.02rem;
                  line-height: 1.2em;
                }

                h2 {
                  max-width: 80%;
                  font-size: 0.14rem;;
                  color: white;
                  @include text-ellipsis;
                  margin: 0 0 0.05rem 0.1rem;
                  line-height: 1.3em;
                }

              }
            }

            .part-2 { //时间和标志区域
              width: 0.7rem;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              justify-content: flex-start;
              flex-shrink: 0;

              p {
                font-size: 0.13rem;;
                color: white;
                margin: 0.12rem 0.1rem 0 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .unread {
                font-size: 0.13rem;
                color: red;
                @include text-ellipsis;
                margin: 0.1rem 0.22rem 0 0;
                padding: 0.02rem;
                line-height: 1.2em;
              }
            }
          }
        }
        .del {
          display: inline-block;
          width: 1rem;
          height: .58rem;
          background-color: red;
          font-size: .2rem;
          color: black;
          vertical-align: top;
          text-align: center;
          line-height: .6rem;
        }
      }
    }
  }
</style>
