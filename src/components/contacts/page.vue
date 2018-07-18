<template>
  <div class="contacts-page">
    <list-view :data="contactList" @emitClick="showChatPage"></list-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import ListView from '../../base/listview/listview.vue'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'contacts_page',
    data() {
      return {
        tempContactList: [],
        contactList: []
      }
    },
    created() {
      this.contacts.forEach(item => {
        const letter = pinyinlite(item.nickName)[0][0].substr(0, 1)
        const index = this.isRepeated(this.tempContactList, letter)
        if (index > -1) {
          this.tempContactList[index].items.push(item)
        } else {
          this.tempContactList.push({
            title: letter,
            items: [item]
          })
        }
      })
      this.contactList = this.tempContactList
    },
    components: {ListView},
    computed: {
      ...mapGetters({
        contacts: 'GET_CONTACTS'
      })
    },
    methods: {
      showChatPage(item) {
        //修改当前聊天用户；跳转路由
        this.set_current_chatwith_contact(item)
        this.$router.push('/chatPage')
      },
      isRepeated(arr, letter) {
        if (arr.length === 0) {
          return -2
        }
        const index = arr.findIndex((item) => {
          return item.title === letter
        })
        return index
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
  .contacts-page {
    position: fixed;
    top: .4rem;
    bottom: .54rem;
    left: 0;
    right: 0;
  }
</style>
