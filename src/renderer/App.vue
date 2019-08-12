<template>
  <div id="app">
    <router-view></router-view>
    <update-modal></update-modal>
  </div>
</template>

<script>
import UpdateModal from './component/updateModal'
  export default {
    name: 'file_tool',
    data() {
      return {
        showUpdater: false,
        downloadProcess: null
      }
    },
    created() {

    },
    components: {
      UpdateModal
    }
  }
</script>

<style>
  /* CSS */
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vertical-center-modal .ivu-modal{
      top: 0;
    }
</style>
