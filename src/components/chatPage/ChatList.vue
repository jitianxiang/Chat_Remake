<template>
  <scroll :data="renderList" class="chatScroll"
          :pullDownRefresh="pullDownRefresh"
          :listenScrollStart="true"
          @pullingDown="pullingDown"
          @scrollStart="scrollStart"
          ref="chatScroll">
    <ul ref="loadWrapper">
      <li v-for="(msg, index) in renderList" ref="chat">
        <div class="time" v-if="showTime(index)"
             @click.stop="closeMultiChoose">{{getMsgTime(msg.time)}}
        </div>
        <div class="mine" v-if="isMine(msg.sendContact)">
          <div class="multichooseitem" :style="{right:isDifferent(msg)?'0.8rem': ''}"
               v-if="msg.uniqueId === currentChoosedMsgUniqueid && isShowMultiChoose"
               v-click-outside="closeMultiChoose">
            <span @click.stop="copy" v-if="msg.msgType === '0'">复制</span>
            <span @click.stop="forward(msg)"
                  v-if="msg.msgType !== '1' && msg.msgType !== '6'">转发</span>
            <span @click.stop="showActionSheets(msg.uniqueId)">删除</span>
            <span @click.stop="more(msg)">多选</span>
          </div>
          <div
            :class="['content', {'content_picture': isPicture(msg.msgType)}, {'content_video': isVideo(msg.msgType)}]">
            <div class="message" :id="msg.uniqueId" ref="message">
              <!--发送失败标志-->
              <img class="icon" src="../../assets/images/g_ic_failed.png" v-if="showSendFailedSign(msg.sendStatus)">
              <!--消息气泡-->
              <div class="triangle" v-if="msg.uniqueId === currentChoosedMsgUniqueid && isShowMultiChoose"></div>
              <bubble :isMine="true" :isMerge="false" :message="msg"></bubble>
            </div>
          </div>
          <img :src="'/static/avatars/' + getSrcUser(msg.sendContact).id + '.png'" class="avatar">
        </div>

        <div class="other" v-if="!isMine(msg.sendContact) && !showReceivingSign(msg.receiveStatus)"
             @click.stop="chooseChatItem(msg)">
          <div class="multichooseitem" :style="{left:isDifferent(msg)?'0.8rem': ''}"
               v-if="msg.uniqueId === currentChoosedMsgUniqueid && isShowMultiChoose"
               v-click-outside="closeMultiChoose">
            <span @click.stop="copy" v-if="msg.msgType === '0'">复制</span>
            <span @click.stop="forward(msg)"
                  v-if="msg.msgType !== '1' && msg.msgType !== '6'">转发</span>
            <span @click.stop="showActionSheets(msg.uniqueId)">删除</span>
            <span @click.stop="more(msg)">多选</span>
          </div>
          <img :src="'/static/avatars/' + getSrcUser(msg.sendContact).id + '.png'" class="avatar">
          <div
            :class="['content', {'content_picture': isPicture(msg.msgType)}, {'content_video': isVideo(msg.msgType)}]">
            <div class="message" :id="msg.uniqueId" ref="message">
              <div class="triangle" v-if="msg.uniqueId === currentChoosedMsgUniqueid && isShowMultiChoose"></div>
              <!--消息气泡-->
              <bubble :isMine="false" :isMerge="false" :message="msg"></bubble>
              <!--接收失败标志-->
              <img class="icon2" src="../../assets/images/g_ic_failed.png"
                   v-if="showReceiveFailedSign(msg.receiveStatus)">
            </div>
          </div>
        </div>
      </li>
    </ul>
    <loading class="load" v-if="showFlag" title=""></loading>
  </scroll>
</template>

<script>
  import Bubble from './Bubble'
  import {SEND_STATUS, RECEIVE_STATUS, MESSAGE_TYPE} from '../../assets/js/constants'
  import * as transformDate from '../../assets/js/transformDate.js'
  import Scroll from '../../base/scroll/scroll.vue'
  import Loading from '../../base/loading/loading.vue'
  import ClickOutside from 'vue-click-outside'
  import {mapGetters, mapMutations, mapActions} from 'vuex'

  export default {
    name: 'chat-list',
    data() {
      return {
        currentChoosedMsgUniqueid: '',
        tempMsgUniqueId: '',
        multipleChoice: false,
        pullDownRefresh: true,
        showFlag: false,
        renderList: [],
        loadCount: 0
      }
    },
    props: {
      originList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    watch: {
      originList(newVal, oldVal) {
        //监听消息变化，动态改变renderList的值
        if (this.renderList.length < oldVal.length) {
          this.renderList = newVal.slice(newVal.length - 11 - this.loadCount * 5)
        } else {
          this.renderList = newVal
        }
        //监听消息变化，如有新消息，立马滚动到最底部
        setTimeout(() => {
          this.$refs.chatScroll.scrollToElement(this.$refs.chat[this.$refs.chat.length - 1])
        }, 20)
      }
    },
    directives: {
      ClickOutside
    },
    computed: {
      isShowMultiChoose() {
        return this.$store.state.multiChooseStatus
      },
      ...mapGetters({
        messagesList: 'GET_MESSAGES_LIST',
        loginUser: 'GET_LOGIN_USER',
        contacts: 'GET_CONTACTS'
      })
    },
    components: {
      'bubble': Bubble,
      Scroll,
      Loading
    },

    methods: {
      ...mapMutations({
        delete_single_msg: 'DELETE_SINGLE_MESSAGE',
        set_multichoose_status: 'SET_MULTICHOOSE_STATUS'
      }),
      //滚动开始事件，输入框焦点消失
      scrollStart() {
        this.$emit('scrollStart')
      },
      pullingDown() {
        this.showFlag = true
        setTimeout(() => {
          this.showFlag = false
          if (this.renderList.length !== this.originList.length) {
            this._loadMoreData()
            setTimeout(() => {
              this.$refs.chatScroll.scrollToElement(this.$refs.chat[4])
            }, 40)
          }
          this.$refs.chatScroll.finishPullDown()
        }, 1000)
      },
      _loadMoreData() {
        let tmp = []
        this.loadCount++
        if ((this.originList.length - this.renderList) > 5) {
          tmp = this.originList.slice(this.originList.length - this.renderList.length - 6, this.originList.length - this.renderList.length)
        } else {
          tmp = this.originList.slice(0, this.originList.length - this.renderList.length)
        }
        for (var i = tmp.length - 1; i > -1; i--) {
          this.renderList.unshift(tmp[i])
        }
      },
      forward(msg) {
        //区分聊天记录的转发
      },
      isDifferent(msg) {
        return (msg.msgType === MESSAGE_TYPE.PICTURE || msg.msgType === MESSAGE_TYPE.SITUATION || msg.msgType === MESSAGE_TYPE.AUDIO) ? true : false
      },
      del() {
        const delChat = this.messagesList.find((item) => {
          return item.uniqueId === this.tempMsgUniqueId
        })
        //本地删除
        this.delete_single_msg(delChat)
      },
      copy() {
        this.currentChoosedMsgUniqueid = ''
      },
      closeMultiChoose() {
        this.currentChoosedMsgUniqueid = ''
      },
      onMinePress(e) {
        this.set_multichoose_status(true)
        this._searchParentNode(e.target.parentNode.parentNode)
      },
      onOtherPress(e) {
        this.set_multichoose_status(true)
        this._searchParentNode(e.target.parentNode.parentNode)
      },
      _searchParentNode(node) {
        if (node.id) {
          this.currentChoosedMsgUniqueid = node.id
          return
        } else {
          this._searchParentNode(node.parentNode)
        }
      },
      /*判断是否为自己发的消息*/
      isMine(src) {
        return src === this.loginUser.uniqueId
      },
      /*时间显示转换*/
      getMsgTime(timeStamp) {
        return transformDate.transformDate(timeStamp, 'chatlist')
      },
      /*是否显示该条消息的时间*/
      showTime(index) {
        if (index === 0) {
          return true
        } else {
          return this.renderList[index].time - this.renderList[index - 1].time >= 180000
        }
      },
      /*获取发送人*/
      getSrcUser(src) {
        if (this.isMine(src)) {
          return this.loginUser
        }
        return this.contacts.find(function (user) {
          return user.uniqueId === src
        })
      },
      //当弹出多功能聊天框或者文本多行输入或者弹出输入框，都需要重新计算scroll高度并滚动到最底部
      _refreshScroll() {
        this.$refs.chatScroll.refresh()
        this.$refs.chatScroll.scrollToElement(this.$refs.chat[this.$refs.chat.length - 1], 100)
      },
      /*判断是否显示发送失败标志*/
      showSendFailedSign(sendStatus) {
        return sendStatus === SEND_STATUS.FAILED
      },
      /*判断是否显示发送中标志*/
      showSendingSign(sendStatus) {
        return sendStatus === SEND_STATUS.SENDING
      },
      /*判断是否显示接收失败标志*/
      showReceiveFailedSign(receiveStatus) {
        return receiveStatus === RECEIVE_STATUS.FAILED
      },
      /*判断是否显示接收中标志*/
      showReceivingSign(receiveStatus) {
        return receiveStatus === RECEIVE_STATUS.RECEIVING
      },
      /*判断是否接收成功*/
      showReceivedSign(receiveStatus) {
        return receiveStatus === RECEIVE_STATUS.SUCCESS
      },
      /*判断是否开始真正的文件接收*/
      showFileReceivingSign(receiveStatus) {
        return receiveStatus === RECEIVE_STATUS.FILERECEIVING
      },
      /*判断是否为图片消息*/
      isPicture(msgType) {
        return msgType === MESSAGE_TYPE.PICTURE
      },
      /*判断是否为视频消息*/
      isVideo(msgType) {
        return msgType === MESSAGE_TYPE.VIDEO
      }
    },
    created() {
      //首次进入只取最新的8条数据
      if (this.originList.length > 10) {
        this.renderList = this.originList.slice(this.originList.length - 10)
      } else {
        this.renderList = this.originList
      }
    },
    updated() {

    },
    mounted() {
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/constants";

  .triangle {
    content: '';
    width: 0px;
    height: 0px;
    border-color: black transparent transparent transparent;
    border-style: solid;
    border-width: 0.1rem;
    position: absolute;
    top: 0.1%;
    right: 40%;
    z-index: 3000;
  }

  .chatScroll {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;

      .time {
        color: white;
        font-size: 0.12rem;
        background-color: rgba(0, 0, 0, 0.2);
        @include pr-border-radius(0.02rem);
        padding: 0.05rem;
        margin: 0.05rem 0 0.05rem 0;
      }

      .mine {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        margin: 0.05rem 0 0.05rem 0;
        position: relative;

        .choice {
          flex-grow: 1;
          margin-top: 0.1rem;
          margin-left: 0.1rem;
          img {
            width: 0.25rem;
            height: 0.25rem;
            border-radius: 0.13rem;
          }
        }

        .multichooseitem {
          position: absolute;
          top: -0.3rem;
          height: 0.3rem;
          background-color: black;
          border-radius: 0.05rem;
          margin-right: 0.15rem;
          right: 0.1rem;
          display: flex;
          z-index: 3000;

          :last-child {
            border-right: 0.01rem solid black
          }

          span {
            text-align: center;;
            font-size: 0.12rem;
            width: 0.5rem;
            color: white;
            flex: 1;
            display: block;
            line-height: 0.3rem;
            border-right: 0.01rem solid white;
          }
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          max-width: 70%;

          p {
            color: #A8A8A8;
            font-size: 0.12rem;
            margin: 0 0.08rem 0.08rem 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 1.5rem;
          }

          .message {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            max-width: 100%;
            position: relative;

            i {
              width: 0.1rem;
              height: 0.1rem;
              //margin: 0.13rem 0.1rem 0 0;
            }

            img {
              min-width: 0.2rem;
              max-width: .2rem;
              min-height: 0.2rem;
              max-height: .2rem;
              margin-right: 0.06rem;
            }
          }
        }
        /*控制图片的显示大小*/
        .content_picture {
          max-width: 50%;
        }
        /*控制视频显示大小*/
        .content_video {
          max-width: 50%;
        }

        .avatar {
          height: 0.48rem;
          width: 0.48rem;
          border-radius: 0.24rem;
          margin: 0 0.1rem 0 0;
          z-index: 1;
        }
      }

      .other {
        width: 100%;
        display: flex;
        align-items: flex-start;
        margin: 0.05rem 0 0.05rem 0;
        position: relative;

        .choice {
          width: 0.25rem;
          height: 0.25rem;
          margin-top: 0.1rem;
          margin-left: 0.1rem;
          img {
            width: 0.25rem;
            height: 0.25rem;
            border-radius: 0.13rem;
          }
        }

        .multichooseitem {
          position: absolute;
          top: -0.3rem;
          height: 0.3rem;
          background-color: black;
          border-radius: 0.05rem;
          margin-right: 0.15rem;
          left: 0.15rem;
          display: flex;
          z-index: 3000;

          :last-child {
            border-right: 0.01rem solid black
          }

          span {
            text-align: center;;
            font-size: 0.12rem;
            width: 0.5rem;
            color: white;
            flex: 1;
            display: block;
            line-height: 0.3rem;
            border-right: 0.01rem solid white;
          }
        }

        .avatar {
          height: 0.48rem;
          width: 0.48rem;
          border-radius: 0.24rem;
          margin: 0 0 0 0.1rem;
          z-index: 1;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 70%;

          p {
            color: #A8A8A8;
            font-size: 0.12rem;
            margin: 0 0 0.08rem 0.08rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 1.5rem;
          }

          .message {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            position: relative;

            i {
              font-size: 0.12rem;
              margin: 0.13rem 0 0 0.1rem;
            }

            img {
              min-width: 0.2rem;
              max-width: .2rem;
              min-height: 0.2rem;
              max-height: .2rem;
              margin-right: 0.06rem;
            }
          }
        }
        /*控制图片的显示大小*/
        .content_picture {
          max-width: 50%;
        }
        /*控制视频显示大小*/
        .content_video {
          max-width: 50%;
        }
      }
    }

    .load {
      width: 3.6rem;
      position: absolute;
      top: 0;
    }
  }
</style>
