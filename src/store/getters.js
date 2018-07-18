import *as gettersTypes from './getters-types'

export default {
  [gettersTypes.GET_CURRENT_TAB](state) {
    return state.currentTab
  },

  [gettersTypes.GET_CONTACTS](state) {
    return state.contacts
  },

  [gettersTypes.GET_CURRENT_CHATWITH_CONTACT](state) {
    return state.current_chatWith_contact
  },

  [gettersTypes.GET_FUNCTION_CHOOSE_STATUS](state) {
    return state.functionChooseStatus
  },

  [gettersTypes.GET_CLIPBOARD_CONTENT](state) {
    return state.clipboardContent
  },

  [gettersTypes.GET_MESSAGES_LIST](state){
    return state.messagesList
  },

  [gettersTypes.GET_LOGIN_USER](state){
    return state.loginUser
  },

  [gettersTypes.GET_WHICH_AUDIO_PLAYING](state){
    return state.audio_playing_uniqueId
  },

  [gettersTypes.GET_PICTURE_VIEWER](state){
    return state.pictureViewer
  },

  //获得与当前人员的聊天记录
  [gettersTypes.GET_CURRENT_CHAT_LIST](state) {
    let currentChatList = []
    for (let discussion of state.messagesList) {
      const chatwithId = state.current_chatWith_contact.uniqueId
      const loginUserId = state.loginUser.uniqueId
      if ([chatwithId, loginUserId].indexOf(discussion.receiveContact) > -1 && [chatwithId, loginUserId].indexOf(discussion.sendContact) > -1) {
        currentChatList.push(discussion);
      }
    }
    return currentChatList.sort((a, b) => {
      return a.time - b.time
    })
  },

  //获得所有聊天记录
  [gettersTypes.GET_ALL_CAHT_LIST](state) {
    let returnChatList = []
    const loginUserId = state.loginUser.uniqueId
    for (let discussion of state.messagesList) {
      //提取只和当前登陆人有关的聊天记录
      if ([discussion.sendContact, discussion.receiveContact].indexOf(loginUserId) > -1) {
        //处理当前登陆人发的消息
        if (discussion.sendContact === loginUserId) {
          const _user = state.contacts.find((user) => {
            return user.uniqueId === discussion.receiveContact
          })
          if(returnChatList.length === 0) {
            returnChatList.push({
              chatwith: _user,
              messages: [discussion]
            })
          }else {
            returnChatList.forEach((chat,index)=>{
              if(chat.chatwith.uniqueId === _user.uniqueId) {
                chat.messages.push(discussion)
              }else if(chat.chatwith.uniqueId !== _user.uniqueId && index === returnChatList.length - 1){
                returnChatList.push({
                  chatwith: _user,
                  messages: [discussion]
                })
              }
            })
          }
        } else {
          //处理别人发过来的消息
          const _user = state.contacts.find((user) => {
            return user.uniqueId === discussion.sendContact
          })
          if(returnChatList.length === 0) {
            returnChatList.push({
              chatwith: _user,
              messages: [discussion]
            })
          }else {
            returnChatList.forEach((chat,index)=>{
              if(chat.chatwith.uniqueId === _user.uniqueId) {
                chat.messages.push(discussion)
              }else if(chat.chatwith.uniqueId !== _user.uniqueId && index === returnChatList.length - 1){
                returnChatList.push({
                  chatwith: _user,
                  messages: [discussion]
                })
              }
            })
          }
        }
      }
    }
    return returnChatList
  }
}
