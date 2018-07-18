/*
 * Created by jitianxiang on 2018/7/12
 */

export default class Message {
  constructor({uniqueId,time}){
    this.uniqueId = uniqueId
    /*唯一识别id*/
    this.time = time
    /*消息的生成时间*/
    this.msgType = ''
    /*消息类型*/
    this.content = ''
    /*文本消息内容*/
    this.receiveContact = ''
    /*接收方ID*/
    this.sendContact = ''
    /*发送者*/
    this.sendStatus = SEND_STATUS.FAILED
    /*发送状态*/
    this.readStatus = READ_STATUS.UNREAD
    /*阅读状态*/
    this.receiveStatus = RECEIVE_STATUS.RECEIVING
    /*接收状态*/
    this.attachment = {
      path: '',
      duration: 0,
      size: 0
    }
    /*附件*/
  }
}

export const MESSAGE_TYPE = {
  TEXT: '0', /*文本消息*/
  AUDIO: '1', /*音频*/
  PICTURE: '2', /*图片*/
  FILE: '3', /*文件*/
  VIDEO: '4', /*视频*/
  SITUATION: '5',  /*态势*/
  PHONE: '6',  /*电话*/
  CHATLOG: '7' /*聊天记录*/
}

/*发送状态*/
export const SEND_STATUS = {
  FAILED: '0',
  SENDING: '1',
  SUCCESS: '2'
}
/*接收状态*/
export const RECEIVE_STATUS = {
  FAILED: '0',
  RECEIVING: '1',
  SUCCESS: '2'
}
/*阅读状态状态*/
export const READ_STATUS = {
  UNREAD: '0',
  READ: '1'
}
