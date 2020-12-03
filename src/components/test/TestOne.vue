<template>
  <div id="test1">
    <span class="test">
      <span>测试1</span>
      <span>测试2</span>
      <span>测试3</span>
    </span>
    <span>111111</span>
  </div>
</template>

<script>
  export default {
    created() {
      console.log('testOne created');
    },
    beforeDestroy() {
      console.log('testOne beforeDestroy');
    },
    activated() {
      console.log('testOne activated');
    },
    deactivated() {
      console.log('testOne deactivated');
    }
  }

</script>

<style scoped lang="less">
  #test1 {

    .test {
      height: 400px;
      width: 600px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      span {
        text-align: center;
        line-height: 40px;
        height: 40px;
        background-color: pink;
      }
    }
  }

</style>
