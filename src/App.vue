<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
.ant-input:focus,.ant-select-selection:focus,.ant-select-focused .ant-select-selection{
  box-shadow: none;
}
.jsoneditor-poweredBy,.jsoneditor-modes{
  display: none;
}
.jsoneditor-vue{
  height: 300px;
}

.method{
  font-weight: 600;
  &.GET{
    color: green;
  }
  &.POST{
    color: orange;
  }
}
::-webkit-scrollbar {
    width: 9px;
    height: 9px;
  }
::-webkit-scrollbar-thumb {
    background: #ddd;
}
::-webkit-scrollbar-track {
    background: transparent;
}
</style>
