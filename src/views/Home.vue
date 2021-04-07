<template>
  <div class="home">
    <HistoryBox @readCondition="readCondition"/>
    <XiaolinTabs ref="XiaolinTabs"/>
    <span class="fixedBtn">Ctrl+x open DevTools</span>
  </div>
</template>

<script>
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
      this.$refs['XiaolinTabs'].add(item)
    }
  }
}
</script>
<style lang="less" scoped>
.home{
  display: flex;
  .fixedBtn{
    position: fixed;
    right: 15px;
    bottom: 20px;
  }
}
</style>