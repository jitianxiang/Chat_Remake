<template>
  <div class="loading">
    <img src="../../assets/images/loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'loading',
    data() {
      return {}
    },
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    },
    components: {},
    computed: {},
    methods: {},
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>

  .loading {
    width: 100%;
    text-align: center;
    img {
      width: .24rem;
      height: .24rem;
    }
    .desc {
      line-height: .2rem;
      font-size: .14rem;
      color: black;
    }
  }
</style>
