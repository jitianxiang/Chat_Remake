<template>
  <div class="header-wrapper">
    <slot name="left" class="left"></slot>
    <slot name="center" class="center"></slot>
    <slot name="right" class="right"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'header-bar',
        data() {
            return {}
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
  .header-wrapper {
    width: 100%;
    height: 100%;
    background: black;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      max-width: 40%;
    }

    .center {
      max-width: 60%;
    }

    .right {
      max-width: 40%;
    }
  }
</style>
