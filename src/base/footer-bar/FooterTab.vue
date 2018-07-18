<template>
  <footer class="foot-wrapper">
    <div class=" tab" @click.stop="changeTab('chatHistoryPage')">
      <img src="../../assets/images/212.png" v-if="currentTab === 'contactsPage'"/>
      <img src="../../assets/images/22.png" v-else/>
    </div>
    <div class="tab" @click.stop="changeTab('contactsPage')">
      <img src="../../assets/images/213.png" v-if="currentTab === 'chatHistoryPage'"/>
      <img src="../../assets/images/21.png" v-else/>
    </div>
  </footer>
</template>

<script>
  import {mapMutations,mapGetters} from 'vuex'
  export default{
    computed: {
      ...mapGetters({
        currentTab: 'GET_CURRENT_TAB'
      })
    },
    methods: {
      changeTab(tab){
        this.setCurrentTab(tab)
        this.$router.push('/container/' + tab)
      },
      ...mapMutations({
        setCurrentTab: 'SET_CURRENT_TAB'
      })
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss" scoped="">

  .foot-wrapper {
    display: flex;
    .tab {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50%;
      font-weight: bold;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
