// 定义一个混入对象
var myMixin = {
  created() {
    console.log('子组件testone的混入created');
  },
  mounted() {
    console.log('子组件testone混入mounted');
  },
  beforeDestroy() {
    console.log('子组件testone混入beforeDestroy');
  },
  destroyed() {
    console.log('子组件testone混入destroyed');
  },
  methods: {
    hello() {
      console.log('hello from mixin!')
    }
  }
}

export default myMixin
