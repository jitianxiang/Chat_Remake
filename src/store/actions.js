import * as mutationTypes from './mutations-types'
import * as actionTypes from './actions-types'
import Message from '../assets/js/constants'
import {MESSAGE_TYPE} from '../assets/js/constants'
import {uuid} from '../assets/js/utils'

export default {
  //发送文本消息
  [actionTypes.SEND_TEXT_MESSAGE]({commit, state}, {content, contact}) {
    const uniqueId = uuid()
    const time = +new Date()
    let message = new Message({uniqueId, time})
    message.msgType = MESSAGE_TYPE.TEXT
    message.sendContact = state.loginUser.uniqueId
    message.receiveContact = contact.uniqueId
    message.content = content
    commit(mutationTypes.SAVE_MESSAGE, message)
  },

  //发送图片消息
  [actionTypes.SEND_PICTURE_MESSAGE]({commit, state}, {path, contact}) {
    const uniqueId = uuid()
    const time = +new Date()
    let message = new Message({uniqueId, time})
    message.msgType = MESSAGE_TYPE.PICTURE
    message.sendContact = state.loginUser.uniqueId
    message.receiveContact = contact.uniqueId
    message.attachment.path = path
    commit(mutationTypes.SAVE_MESSAGE, message)
  }
}
