<template>
<div class="HistoryBox">
    <a-button @click="readCondition">add</a-button>
</div>
</template>

<script>
export default {
    methods: {
        readCondition() {
            let history = JSON.parse(localStorage.history)
            this.$emit('readCondition', history[0])
        }
    }
}
</script>

<style lang='less' scoped>
.HistoryBox{
    width: 30%;
}
</style>