<template>

  <div ref="bubble" :class="{'mine-bubble': isMine, 'other-bubble': !isMine && !isMerge, 'merge-bubble': isMerge}"
       :style="{background: isMerge?'':handleMsgBG(message),color: isBlack?'black':''}">
    <div class="triangle" ref="triangle"></div>
    <!--文本消息-->
    <p v-if="isText(message)" v-html="message.content"></p>
    <!--音频消息-->
    <div class="audio_content" v-else-if="isAudio(message.msgType)" @click="onClickAudio">
      <audio :src="'/static/avatars/' + message.attachment.src" v-show="false" ref="audio"></audio>
      <!--音频时长-->
      <p>
        <B>{{getDuration(message.attachment.duration)}}</B>
      </p>
      <img :src="audioAnimation.right[audioAnimationCounter]" v-if="isMine">
      <img :src="audioAnimation.left[audioAnimationCounter]" v-else>
    </div>
    <!--图片消息-->
    <div v-else-if="isPicture(message.msgType)" @click="onClickPicture" class="picture_content">
      <img ref="imgMsg" :src="picSrc" @load="loadImg">
    </div>
    <!--视频消息-->
    <div class="video_content" v-else-if="isVideo(message.msgType)" @click="onClickVideo">
      <video :src="message.attachment.src" preload="metadata"
             @loadeddata="onVideoDataLoaded"
             v-show="false" ref="video"></video>
      <img class="capture" src="" @load="loadImg" ref="imgMsg">
      <img class="icon" src="../../assets/images/btn_preview_start_normal.png" v-if="isImgLoaded"/>
    </div>
    <!--文件消息-->
    <div class="file_content" v-else-if="isFile(message.msgType)  && isReceiveSuccess()" @click="onClickFile">
      <div class="text">
        <span class="name">{{getFileName(message.attachment.src[0])}}</span>
        <span class="size">{{getFileSize(message.attachment.src[1])}}</span>
      </div>
      <div class="icon">
        <i class="iconfont icon-wenjian"></i>
      </div>
    </div>
    <!--态势消息-->
    <div class="situation_content" v-else-if="isSituation(message.msgType) && isReceiveSuccess()"
         @click="onClickFileSituation">
      <div class="text">
        <span class="name">{{getFileName(message.attachment.src[0])}}</span>
        <span class="size">{{getFileSize(message.attachment.src[1])}}</span>
      </div>
      <div class="icon">
        <i class="iconfont icon-jiaotongtaishi"></i>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import audio_animation_left_1 from '@/assets/images/audio_animation_list_left_1.png'
  import audio_animation_left_2 from '@/assets/images/audio_animation_list_left_2.png'
  import audio_animation_left_3 from '@/assets/images/audio_animation_list_left_3.png'
  import audio_animation_right_1 from '@/assets/images/audio_animation_list_right_1.png'
  import audio_animation_right_2 from '@/assets/images/audio_animation_list_right_2.png'
  import audio_animation_right_3 from '@/assets/images/audio_animation_list_right_3.png'
  import {SEND_STATUS, RECEIVE_STATUS, MESSAGE_TYPE} from '../../assets/js/constants'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {suffixRegex} from '../../assets/js/utils'

  export default {
    name: 'bubble',
    data() {
      return {
        audioAnimation: {
          left: [
            audio_animation_left_1,
            audio_animation_left_2,
            audio_animation_left_3
          ],
          right: [
            audio_animation_right_1,
            audio_animation_right_2,
            audio_animation_right_3
          ]
        },
        audioAnimationCounter: 2,
        audioAnimationTimer: null,
        receivingPercent: 0,
        timer: {},
        isImgLoaded: false,
        resetCount: 0
      }
    },
    props: {
      isMine: {
        type: Boolean,
        default: true
      },
      message: {
        type: Object,
        required: true
      },
      isMerge: {
        type: Boolean,
        default: true
      },
      isBlack: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      picSrc() {
        return this.message.attachment.path
      },
      isDownload: {
        get() {
          return this.message.attachment.isDownload
        },
        set(val) {
          this.message.attachment.isDownload = val
        }
      },
      /*文件扩展名*/
      suffix() {
        if (this.message.attachment.src) {
          const index = this.message.attachment.src.lastIndexOf('.')
          return this.message.attachment.src.slice(index)
        } else {
          return ''
        }
      },
      ...mapGetters({
        whichAudioPlaying: 'GET_WHICH_AUDIO_PLAYING'
      })
    },
    methods: {
      ...mapMutations({
        toggle_picture_viewer: 'TOGGLE_PICTURE_VIEWER_DISPLAY',
        toggle_video_viewer: 'TOGGLE_VIDEO_VIEWER_DISPLAY',
        toggle_audio_viewer: 'TOGGLE_AUDIO_VIEWER_DISPLAY',
        toggle_text_viewer: 'TOGGLE_TEXT_VIEWER_DISPLAY',
        set_which_audio_playing: 'SET_WHICH_AUIDO_PLAYING'
      }),
      //获取消息类型
      handleMsgBG(msg) {
        const type = msg.msgType
        if (this.isVideo(type)) return '';
        if (this.isPicture(type)) return `url(${this.picSrc}) -9999px 0 no-repeat`;
        if (this.isFile(type)) return 'white';
        if (this.isSituation(type)) return 'white';
        if (this.isText(msg) || this.isAudio(type) || this.isLockedText(msg) || this.isChatlog(type) ||
          this.isPhone(type)) {
          if (this.isMine) {
            return '#96dc58';
          } else {
            return 'white';
          }
        }
        return ''
      },
      //加载图片，控制气泡中小三角的样式
      loadImg() {
        let height = this.$refs.imgMsg.height
        let width = this.$refs.imgMsg.width
        const maxWidth = 160,
          maxHeight = 200

        if (width > height) {
          this.$refs.imgMsg.style.maxWidth = maxWidth + 'px'
        } else {
          this.$refs.imgMsg.style.maxHeight = maxHeight + 'px'
        }
        this.$refs.imgMsg.style.display = 'block'
        this.$refs.triangle.style.backgroundSize = `${this.$refs.imgMsg.width - 6}px auto`
        this.$refs.triangle.style.backgroundPosition =
          `${this.$refs.bubble.className.includes('other') ? 6 : (12 -
            this.$refs.imgMsg.width)}px -9.5px`

      },
      /*判断是否为文本消息*/
      isText(message) {
        return message.msgType === MESSAGE_TYPE.TEXT
      },
      /*判断是否为音频消息*/
      isAudio(msgType) {
        return msgType === MESSAGE_TYPE.AUDIO
      },
      /*判断是否为图片消息*/
      isPicture(msgType) {
        return msgType === MESSAGE_TYPE.PICTURE
      },
      /*判断是否为视频消息*/
      isVideo(msgType) {
        return msgType === MESSAGE_TYPE.VIDEO
      },
      /*判断是否为普通文件消息*/
      isFile(msgType) {
        return msgType === MESSAGE_TYPE.FILE
      },
      /*判断是否为态势文件消息*/
      isSituation(msgType) {
        return msgType === MESSAGE_TYPE.SITUATION
      },
      /*判断是否显示文件消息气泡*/
      isReceiveSuccess() {
        return this.message.sendContact === this.loginUser.uniqueId
      },
      /*音频消息时长显示*/
      getDuration(duration) {
        if (duration < 60) {
          return duration + '″'
        } else {
          const minute = parseInt(duration / 60)
          const second = duration % 60
          return minute + '′' + second + '″'
        }
      },
      /*点击放大图片*/
      onClickPicture() {
        this.toggle_picture_viewer({
          display: true,
          src: this.message.attachment.path,
          uniqueId: this.message.uniqueId
        })
      },
      /*点击播放音频*/
      onClickAudio() {
        const audio = this.$refs.audio
        let i = 0
        if (audio.error === null) {
          this.set_which_audio_playing(this.message.uniqueId)
          /*开启播放时动画*/
          this.audioAnimationTimer = setInterval(() => {
            i++
            if (audio.ended) {
              /*音频播放完毕*/
              clearInterval(this.audioAnimationTimer)
              this.audioAnimationCounter = 2
            } else {
              if (this.whichAudioPlaying !== this.message.uniqueId) {
                audio.pause()
              } else {
                this.audioAnimationCounter = i % 3
              }
            }
          }, 300)
          /*播放音频*/
          audio.play()
        } else {
          console.log('audio play error: ' + audio.error.code)
          this.$message.error('无法播放该语音！')
        }
      },
      /*点击播放视频*/
      onClickVideo() {
        this.toggle_video_viewer({
          display: true,
          src: this.message.attachment.src,
          uniqueId: this.message.uniqueId
        })
      },
      /*获取文件名*/
      getFileName(src) {
        return src.split('/').pop()
      },
      /*获取文件大小*/
      getFileSize(size) {
        let kb = (size / 1024).toFixed(2)
        return kb < 1024 ? kb + 'K' : (kb / 1024).toFixed(2) + 'M'
      },
      getCommitFromFileType(name) {
        let type = name.replace(/(.*)\.(.*)/, '$2')
        if (type === 'txt' || type === 'log' || type === 'xml' || type === 'json') return 'TOGGLE_TEXT_PLAYER_DISPLAY'
        else if (type === 'mp4' || type === 'ogg') return 'TOGGLE_VIDEO_PLAYER_DISPLAY'
        else if (type === 'jpg' || type === 'png' || type === 'jpeg' || type === 'gif') return 'TOGGLE_PICTURE_VIEWER_DISPLAY'
        else if (type === 'mp3' || type === 'wav' || type === 'aac') return 'TOGGLE_AUDIO_PLAYER_DISPLAY'
        else return ''
      },
      /*点击打开文件*/
      onClickFile() {
        let type = this.getCommitFromFileType(this.getFileName(this.message.attachment.src[0]))
        if (type === '') {
          this.$message.warning('不支持的格式')
        } else if (type === 'TOGGLE_PICTURE_VIEWER_DISPLAY') {
          this.toggle_picture_viewer({
            display: true,
            src: this.message.attachment.src,
            uniqueId: this.message.uniqueId
          })
        } else if (type === 'TOGGLE_VIDEO_PLAYER_DISPLAY') {
          this.toggle_video_viewer({
            display: true,
            src: this.message.attachment.src,
            uniqueId: this.message.uniqueId
          })
        } else if (type === 'TOGGLE_TEXT_PLAYER_DISPLAY') {
          this.toggle_text_viewer({
            display: true,
            src: this.message.attachment.src
          })
        } else if (type === 'TOGGLE_AUDIO_PLAYER_DISPLAY') {
          this.toggle_audio_viewer({
            display: true,
            src: this.message.attachment.src
          })
        }

      },
      onClickFileSituation() {
        this.$message.error('无法解析态势文件！')
      },
      /*检测文件类型*/
      checkFormat(type) {
        let re = new RegExp(suffixRegex[type])
        if (re.test(this.suffix)) {
          return true
        } else {
          return false
        }
      },
      /*视频数据加载*/
      onVideoDataLoaded() {
        this.captureImg()
      },
      /*生成视频缩略图*/
      captureImg() {
        let capture = this.$refs.imgMsg
        capture.src = this.message.attachment.src
        capture.onload = () => {
          this.isImgLoaded = true
        }
        this.$refs.bubble.style.background = `url(${capture.src}) -9999px 0 no-repeat`
      }
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/constants";/**/

  .mine-bubble {
    @include pr-border-radius(0.05rem);
    color: black;
    font-size: 0.16rem;
    position: relative;
    margin: 0.05rem 0.1rem 0 .06rem;

    .triangle {
      z-index: 0;
      width: 0;
      height: 0;
      position: absolute;
      top: 0.1rem;
      left: auto;
      right: -.1rem;
      border: solid #313329;
      border-width: .05rem .05rem;
      border-left-color: transparent;
      border-right-color: white;
      border-top-color: white;
      border-bottom-color: white;
      background-image: inherit;
      background-color: inherit;
      background-clip: border-box;
      background-origin: border-box;
    }

    > p {
      padding: .08rem .13rem .08rem .13rem;
      word-break: break-all;
      line-height: .22rem;
      text-align: start;
    }

    .audio_content {
      padding: 0.02rem;
      height: 0.38rem;
      min-width: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      > p {
        color: white;
        font-size: 0.17rem;
        margin: 0 0 0 0.1rem;
      }

      > img {
        height: 0.2rem;
        margin: 0 0.1rem 0 0;
      }
    }

    .picture_content {
      overflow: hidden;
      @include pr-border-radius(0.05rem);
      transform: rotate(0deg);

      img {
        display: none;
        @include pr-border-radius(0.05rem);
        position: relative;
        right: -.06rem;

      }
    }

    .video_content {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;

      .capture {
        max-width: 1.66rem;
        @include pr-border-radius(0.05rem);
        position: relative;
        display: block;
      }

      .icon {
        position: absolute;
        text-align: center;
        z-index: 2000;
        width: 0.5rem;
        height: 0.5rem;
      }
    }

    .file_content {
      margin: 0.02rem;
      background-color: white;
      border: 0.01rem solid #A8A8A8;
      display: flex;
      align-items: center;
      @include pr-border-radius(0.05rem);
      padding: 0.05rem 0.05rem .05rem 0;
      font-size: .14rem;
      .text {

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin: 0 0.1rem;
        & > :first-child {
          margin-bottom: .05rem;
        }
        .name {
          max-width: 1.7rem;
          word-wrap: break-word;
          font-size: 0.14rem;
          line-height: 0.2rem;
          color: black;
        }
        .size {
          font-size: 0.12rem;
          color: grey;
        }
      }
      .icon {
        i {
          font-size: .4rem;
        }
      }
    }

    .situation_content {
      margin: 0.02rem;
      background-color: white;
      border: 0.01rem solid #A8A8A8;
      display: flex;
      align-items: center;
      @include pr-border-radius(0.05rem);
      padding: 0.05rem 0.05rem .05rem 0;
      font-size: .14rem;
      .text {

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin: 0 0.1rem;
        & > :first-child {
          margin-bottom: .05rem;
        }
        .name {
          max-width: 1.7rem;
          word-wrap: break-word;
          font-size: 0.14rem;
          line-height: 0.2rem;
          color: black;
        }
        .size {
          font-size: 0.12rem;
          color: grey;
        }
      }
      .icon {
        i {
          font-size: .4rem;
        }
      }
    }
  }

  .other-bubble {
    @include pr-border-radius(0.05rem);
    color: black;
    font-size: 0.16rem;
    position: relative;
    margin: 0.05rem 0 0 0.1rem;

    .triangle {
      z-index: 0;
      position: absolute;
      top: 0.1rem;
      right: auto;
      left: -.1rem;
      border: solid #313329;
      border-width: .05rem .05rem;
      border-right-color: transparent;

      background-image: inherit;
      background-color: inherit;
      background-clip: border-box;
      background-origin: border-box;
    }
    > p {
      padding: .08rem .13rem .08rem .13rem;
      word-break: break-all;
      line-height: .22rem;
      text-align: start;

    }

    .audio_content {
      padding: 0.02rem;
      height: 0.38rem;
      min-width: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      > p {
        color: #a8a8a8;
        font-size: 0.17rem;
        margin: 0 0.1rem 0 0;
        order: 1;
      }

      > img {
        height: 0.2rem;
        margin: 0 0 0 0.1rem;
      }
    }

    .picture_content {
      @include pr-border-radius(0.05rem);
      overflow: hidden;
      transform: rotate(0deg);
      img {
        @include pr-border-radius(0.05rem);
        display: none;
        position: relative;
        left: -.06rem
      }
    }

    .video_content {
      margin: 0.02rem;
      display: flex;
      justify-content: center;
      align-items: center;

      .capture {
        max-width: 1.66rem;
        @include pr-border-radius(0.05rem);
        position: relative;
      }

      .icon {
        position: absolute;
        text-align: center;
        z-index: 2000;
        width: 0.5rem;
        height: 0.5rem;
      }

      .bos-progress {
        position: absolute;
        z-index: 2000;
      }
    }

    .file_content {
      margin: 0.02rem;
      background-color: white;
      border: 0.01rem solid #A8A8A8;
      display: flex;
      align-items: center;
      @include pr-border-radius(0.05rem);
      padding: 0.05rem 0.05rem .05rem 0;
      font-size: .14rem;
      .text {

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin: 0 0.1rem;
        & > :first-child {
          margin-bottom: .05rem;
        }
        .name {
          max-width: 1.7rem;
          word-wrap: break-word;
          font-size: 0.14rem;
          line-height: 0.2rem;
          color: black;
        }
        .size {
          font-size: 0.12rem;
          color: grey;
        }
      }
      .icon {
        i {
          font-size: .4rem;
        }
      }
    }

    .situation_content {
      margin: 0.02rem;
      background-color: white;
      border: 0.01rem solid #A8A8A8;
      display: flex;
      align-items: center;
      @include pr-border-radius(0.05rem);
      padding: 0.05rem 0.05rem .05rem 0;
      font-size: .14rem;
      .text {

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin: 0 0.1rem;
        & > :first-child {
          margin-bottom: .05rem;
        }
        .name {
          max-width: 1.7rem;
          word-wrap: break-word;
          font-size: 0.14rem;
          line-height: 0.2rem;
          color: black;
        }
        .size {
          font-size: 0.12rem;
          color: grey;
        }
      }
      .icon {
        i {
          font-size: .4rem;
        }
      }
    }
  }

</style>
