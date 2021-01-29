<template>
  <div class="home">
    <HistoryBox @readCondition="readCondition"/>
    <XiaolinTabs ref="XiaolinTabs"/>
  </div>
</template>

<script>
// @ is an alias to /src
import XiaolinTabs from '@/components/XiaolinTabs'
import HistoryBox from '@/components/HistoryBox'
export default {
  name: 'Home',
  components: {
    XiaolinTabs,
    HistoryBox
  },
  methods: {
    readCondition(item) {
      console.log(item)
      this.$refs['XiaolinTabs'].add(item)
    }
  }
}
</script>
<style lang="less" scoped>
.home{
  display: flex;
}
</style>