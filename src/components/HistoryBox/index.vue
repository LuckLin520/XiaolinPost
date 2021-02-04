<template>
<div class="HistoryBox">
    <a-button @click="readCondition">add</a-button>
    <a-tabs :animated="false">
            <a-tab-pane tab="History" key="Params">
                <a-menu
                    :default-open-keys="['sub1']"
                    mode="inline"
                >
                <a-sub-menu key="sub1">
                    <span slot="title"><a-icon type="mail" /><span>Navigation One</span></span>
                    <a-menu-item key="5">
                    Option 5
                    </a-menu-item>
                    <a-menu-item key="6">
                    Option 6
                    </a-menu-item>
                    <a-menu-item key="7">
                    Option 7
                    </a-menu-item>
                    <a-menu-item key="8">
                    Option 8
                    </a-menu-item>
                </a-sub-menu>
                </a-menu>
            </a-tab-pane>
    </a-tabs>
</div>
</template>

<script>
export default {
    computed: {
        history() {
            return this.$store.state.history
        }
    },
    methods: {
        readCondition() {
            this.$emit('readCondition', this.history[0])
        }
    }
}
</script>

<style lang='less' scoped>
.HistoryBox{
    width: 25%;
}
</style>