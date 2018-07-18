import * as mutationTypes from './mutations-types'
import Vue from 'vue'

export default {
  [mutationTypes.SET_CONTACTS](state, contacts) {
    state.contacts = contacts
  },

  [mutationTypes.SET_CURRENT_TAB](state, tab) {
    state.currentTab = tab
  },

  [mutationTypes.SET_CURRENT_CHATWITH_CONTACT](state, contact) {
    state.current_chatWith_contact = contact
  },

  [mutationTypes.SET_FUNCTION_CHOOSE_STATUS](state, status) {
    state.functionChooseStatus = status
  },

  [mutationTypes.SAVE_MESSAGE](state, message) {
    const msg = JSON.parse(JSON.stringify(message))
    state.messagesList.push(msg)
  },

  [mutationTypes.DELETE_SINGLE_MESSAGE](state, message) {
    const index = state.messagesList.findIndex((msg) => {
      return msg.uniqueId === message.uniqueId
    })
    if (index > -1) {
      state.messagesList.slice(index, 1)
    }
  },

  //长按单个消息出现多功能选择面板
  [mutationTypes.SET_MULTICHOOSE_STATUS](state, status) {
    state.multiChooseStatus = status
  },

  [mutationTypes.TOGGLE_PICTURE_VIEWER_DISPLAY](state, payload) {
    Vue.set(state.pictureViewer, 'display', payload.display)
    if (payload.uniqueId) {
      Vue.set(state.pictureViewer, 'uniqueId', payload.uniqueId)
    }
    if (payload.src) {
      Vue.set(state.pictureViewer, 'src', payload.src)
    }
  },

  [mutationTypes.TOGGLE_VIDEO_VIEWER_DISPLAY](state, payload) {
    Vue.set(state.videoViewer, 'display', payload.display)
    if (payload.uniqueId) {
      Vue.set(state.videoViewer, 'uniqueId', payload.uniqueId)
    }
    if (payload.src) {
      Vue.set(state.videoViewer, 'src', payload.src)
    }
  },

  [mutationTypes.TOGGLE_AUDIO_VIEWER_DISPLAY](state, payload) {
    Vue.set(state.audioViewer, 'display', payload.display)
    if (payload.src) {
      Vue.set(state.audioViewer, 'src', payload.src)
    }
  },

  [mutationTypes.TOGGLE_TEXT_VIEWER_DISPLAY](state, payload) {
    Vue.set(state.textViewer, 'display', payload.display)
    if (payload.src) {
      Vue.set(state.textViewer, 'src', payload.src)
    }
  },

  [mutationTypes.SET_WHICH_AUIDO_PLAYING](state, uniqueId) {
    state.audio_playing_uniqueId = uniqueId
  }
}
