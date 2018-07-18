<template>
  <div class="function-bar">
    <div class="input-bar" ref="input_bar">
      <i class="iconfont icon-yuyin" v-if="!isVoiceModel" @click="toggleModel" ref="voice">
      </i>
      <i class="iconfont icon-jianpan" v-else @click="toggleModel">
      </i>

      <!--用于粘贴的一个克隆层-->
      <div class="paste" v-show="isPasteShow" ref="paste" @click.stop="pasteContent"
           v-click-outside="clearPaste">
        <el-button type="text">粘贴</el-button>
        <div class="triangle"></div>
      </div>

      <!--文本输入框-->
      <el-input
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 5}"
        v-model="message"
        ref="inp"
        v-if="!isVoiceModel"
        @focus="inputFocus"
        @blur="unFocus">
      </el-input>

      <!--“按住说话”按钮-->
      <div class="record-button" v-else @touchstart="onTouchStart" @touchend="onTouchEnd">
        <span>按住说话</span>
      </div>

      <div class="send-part" ref="send_part">
        <i class="iconfont icon-iconfasong" v-if="message && !isVoiceModel" @click="sendTextMsg"></i>
        <i class="iconfont icon-jia" v-else @click="toggleFunction"></i>
      </div>
    </div>
    <transition name="moveup">
      <div class="function-choose" v-click-outside="closeFunctionChoose" v-if="functionChooseStatus">
        <function-choose></function-choose>
      </div>
    </transition>
    <!--录音提示界面-->
    <div class="recordPopup" v-if="popupVisible">
      <i class="iconfont icon-yuyin"></i>
      <div class="voice"><img :src="recordAnimation[recordTime % 4]"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {MESSAGE_TYPE} from '../../assets/js/constants.js'
  import {uuid} from '../../assets/js/utils.js'
  import FunctionChoose from './FunctionChoose'
  import voice_amp1 from '@/assets/images/voice_amp1.png'
  import voice_amp2 from '@/assets/images/voice_amp2.png'
  import voice_amp3 from '@/assets/images/voice_amp3.png'
  import voice_amp4 from '@/assets/images/voice_amp4.png'
  import voice_amp5 from '@/assets/images/voice_amp5.png'
  import voice_amp6 from '@/assets/images/voice_amp6.png'
  import {mapGetters, mapMutations,mapActions} from 'vuex'
  import ClickOutside from 'vue-click-outside'

  export default {
    name: 'function-bar',
    components: {
      'function-choose': FunctionChoose
    },
    computed: {
      ...mapGetters({
        functionChooseStatus: 'GET_FUNCTION_CHOOSE_STATUS',
        clipboardContent: 'GET_CLIPBOARD_CONTENT',
        chatWithContact: 'GET_CURRENT_CHATWITH_CONTACT'
      })
    },
    data() {
      return {
        isVoiceModel: false,
        message: '',
        recordTimer: null,
        recordTime: 0,
        popupVisible: false,
        recordAnimation: [
          voice_amp1,
          voice_amp2,
          voice_amp3,
          voice_amp4
        ],
        isPasteShow: false,
        isShuRuFaOn: false,
        textOffset: 0
      }
    },
    methods: {
      ...mapMutations({
        set_functionchoose_status: 'SET_FUNCTION_CHOOSE_STATUS'
      }),
      ...mapActions({
        send_text_message: 'SEND_TEXT_MESSAGE'
      }),
      clearPaste(e) {
        this.isPasteShow = false
      },
      getCursorPos(elem) {
        //创建clone层
        const cloneDiv = '{clone_div}'
        const cloneCursor = '{clone_cursor}'
        const cloneText = '{clone_text}'

        let div = elem[cloneDiv] || document.createElement('div')
        let cursor = elem[cloneCursor] || document.createElement('span')
        let text = elem[cloneText] || document.createElement('span')
        if (!elem[cloneDiv]) {
          div.appendChild(text)
          div.appendChild(cursor)

          elem.parentNode.appendChild(div)
          elem[cloneDiv] = div
          elem[cloneCursor] = cursor
          elem[cloneText] = text

          cursor.innerHTML = '|'
          cursor.style.cssText = 'display:inline-block;width:0px;overflow:hidden;z-index:-100;word-wrap:break-word;word-break:break-all'
          div.style.cssText = 'visibility:hidden;display:inline-block;position:fixed;overflow:hidden;z-index:-100;word-wrap:break-word;word-break:break-all'
        }
        //将textarea的css属性复制给clone层
        for (let name in window.getComputedStyle(elem)) {
          if (name === 'length') {
            continue
          }
          if (name === 'parentRule') {
            continue
          }
          div.style[name] = window.getComputedStyle(elem)[name]
        }
        //根据计算的结果定位clone层
        div.style.cssText += 'visibility:hidden;display:inline-block;position:fixed;overflow:scroll;z-index:-100;word-wrap:break-word;word-break:break-all'
        div.style.left = elem.getBoundingClientRect().left + 'px'
        div.style.top = elem.getBoundingClientRect().top - elem.scrollTop + 'px'

        //将光标前的文字复制给clone层的text
        const strTmp = this.message.substring(0, this.textOffset).replace(/</g, '<').replace(/>/g, '>').replace(/\n/g, '<br/>').replace(/\s/g, "<span style='white-space:pre-wrap;'> </span></span>")
        text.innerHTML = strTmp
        cursor.style.display = 'inline-block'
        //返回cursor的位置，即为光标的位置
        return {
          left: cursor.getBoundingClientRect().left,
          top: cursor.getBoundingClientRect().top
        }
      },
      getClipboardContent(e) {
        if (this.isShuRuFaOn && this.clipboardContent) {
          this.textOffset = this.$refs.inp.$refs.textarea.selectionStart
          const {top, left} = this.getCursorPos(this.$refs.inp.$refs.textarea)
          this.$refs.paste.style.top = top - 45 + 'px'
          this.$refs.paste.style.left = left - 46 + 'px'
          this.isPasteShow = true
        }
      },
      pasteContent() {
        this.$refs.inp.$refs.textarea.focus()
        const str = this.clipboardContent.substring(1, this.$store.state.clipboardContent.length - 1)
        this.message = this.message.slice(0, this.textOffset) + str + this.message.slice(this.textOffset)
        this.isPasteShow = false
        this.isShuRuFaOn = false
      },
      /*切换语音和文本输入模式*/
      toggleModel() {
        this.isVoiceModel = !this.isVoiceModel
      },
      /*切换功能选择界面显示*/
      toggleFunction() {
        this.functionChooseStatus && this.$refs.inp.focus()
        this.set_functionchoose_status(!this.functionChooseStatus)
      },
      //关闭多功能聊天框
      closeFunctionChoose() {
        this.set_functionchoose_status(false)
      },
      /*切换显示录音界面*/
      toggleRecordPopup(isShow) {
        this.popupVisible = isShow
      },
      /*文本输入框获取焦点*/
      inputFocus() {
        this.isShuRuFaOn = false
        setTimeout(() => {
          this.isShuRuFaOn = true
        }, 200)
      },
      unFocus() {
        setTimeout(() => {
          this.isShowPaste = false
          this.isShuRuFaOn = false
        }, 200)
      },

      /*发送一条文字消息*/
      sendTextMsg() {
        this.send_text_message({
          content: this.message,
          contact: this.chatWithContact
        })
        this.message = ''
      },
      /*按下按钮开始录音*/
      onTouchStart() {
        //调取更底层的录音接口
      },
      /*抬起结束录音*/
      onTouchEnd() {
        //手指抬起就算发送一个已存在的假的录音文件
        /*隐藏录音弹窗*/
        this.toggleRecordPopup(false)

        this.$store.dispatch({
          type: 'sendFileRequest',
          msgType: this.$constans.MESSAGE_TYPE.AUDIO,
          content: '[语音]',
          CHATID: this.$store.state.chatwithUser.id,
          attachment: {
            src: filePath,
            duration: recordTime
          },
          group: {},
          isGroup: false,
          members: [this.$store.state.chatwithUser]
        })
      },
      _blurInputBtn(){
        this.$refs.inp.blur()
      }
    },
    watch: {
      message: function (oldVal, newVal) {
        if (oldVal !== newVal) {
          this.isPasteShow = false
        }
      }
    },
    mounted() {
      this.$refs.inp.$el.addEventListener('click', _ => {
        this.getClipboardContent()
      })

      this.$refs.inp.$refs.textarea.style.scrollHeight = 30 + 'px'

    },
    directives: {
      ClickOutside
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/constants";

  .function-bar {
    .input-bar {
      min-height: .33rem;
      width: 100%;
      background-color: #1b1c16;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: .05rem 0 .05rem 0;
      z-index: 3000;

      i {
        font-size: .3rem;
      }

      .el-textarea {
        flex-grow: 1;
      }

      .paste {
        position: fixed;
        width: .8rem;
        height: 0.3rem;
        background-color: black;
        border-radius: 0.05rem;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 4001;
        color: white;

        .triangle {
          content: '';
          width: 0px;
          height: 0px;
          border-color: black transparent transparent transparent;
          border-style: solid;
          border-width: 0.1rem;
          position: absolute;
          top: .3rem;
          left: 0.38rem;
          z-index: 3000;
        }
      }

      .record-button {
        flex-grow: 1;
        border: 0.01rem solid white;
        font-size: 0.18rem;
        font-weight: bold;
        @include pr-border-radius(0.05rem);
        background-color: white;
        color: #3c3c3c;
        display: flex;
        justify-content: center;
        align-items: center;
        animation-duration: 0.1s;
        height: .32rem;

        &:active {
          background-color: #dfdfdf;
          color: black;
        }
      }

      .send-part {
        width: 0.4rem;
        flex-shrink: 0;
        text-align: center;
      }

    }

    .function-choose {
      width: 100%;
      &.moveup-enter-active, &.moveup-leave-active {
        transition: all 0.3s;
        height: .92rem;
      }

      &.moveup-enter, &.moveup-leave-to {
        height: 0;
        transform: translate3d(0, 100%, 0);
      }
    }

    .popup {
      background-color: transparent;

      .recordPopup {
        width: 1rem;
        height: 1rem;
        background-color: rgba(0, 0, 0, 0.5);
        @include pr-border-radius(0.1rem);
        display: flex;
        flex-direction: row;
        align-items: center;
        i {
          color: white;
          font-size: 0.5rem;
          margin: 0 0 0 0.1rem;
        }

        .voice {
          position: relative;
          width: 0.4rem;
          height: 0.5rem;
          img {
            max-width: 0.3rem;
            max-height: 0.5rem;
            position: absolute;
            bottom: 0;
          }
        }
      }
    }
  }

</style>
