<template>
  <div id="app">
    <router-view></router-view>

    <div class="picviewer-wrapper" v-if="pictureViewer.display">
      <picture-viewer :uniqueId="pictureViewer.uniqueId" :src="pictureViewer.src"></picture-viewer>
    </div>
  </div>
</template>

<script>
  import {getContacts} from './assets/js/utils'
  import {mapMutations,mapGetters} from 'vuex'
  import PictureViewer from './components/PictureViewer.vue'

  export default {
    name: 'App',
    mounted() {
      getContacts().then((contacts) => {
        this.setContacts(contacts)
      })
    },
    components: {PictureViewer},
    computed: {
      ...mapGetters({
        pictureViewer: 'GET_PICTURE_VIEWER'
      })
    },
    methods: {
      ...mapMutations({
        setContacts: 'SET_CONTACTS'
      })
    }
  }
</script>

<style lang="scss">
  @import "./assets/css/constants";

  html {
    @include pr-user-select;
  }

  #app {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    color: $color-text;

    .picviewer-wrapper {
      background: transparent;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
  }
</style>
