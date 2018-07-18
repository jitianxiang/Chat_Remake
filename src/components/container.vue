<template>
  <div class="container">
    <div class="header">
      <header-bar>
        <div class="left" slot="left"></div>
        <div class="center" slot="center">通讯记录</div>
        <div class="right" slot="right">
          <i class="iconfont icon-shezhi"></i>
        </div>
      </header-bar>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <div class="footer">
      <footer-bar></footer-bar>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import FooterBar from '../base/footer-bar/FooterTab.vue'
  import HeaderBar from '../base/header-bar/header-bar.vue'

  export default {
    name: 'container',
    data() {
      return {}
    },
    components: {FooterBar, HeaderBar},
    computed: {},
    methods: {},
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .container {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    left: 0;
    right: 0;

    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: .4rem;
      width: 100%;
      font-size: .2rem;
      .left,.right {
        width: .4rem;
        text-align: center;
        .icon-shezhi {
          font-size: .25rem;
        }
      }
    }

    .footer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: .54rem;
      width: 100%;
    }
  }
</style>
