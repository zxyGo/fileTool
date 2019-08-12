<template>
  <div class="input">
    <div class="input-box" v-for="(item, index) in value" :key="index">
      <Input type="text" v-model="item.content" :placeholder="firstPlaceholder" clearable/>
      <span class="input-box-space">--</span>
      <Input type="text" v-model="item.replace" :placeholder="lastPlaceholder" clearable/>
      <Icon class="input-box-add" type="md-add-circle" color="red" size="18" @click="addItem" v-if="index === 0 && icon"/>
      <Icon class="input-box-add" type="md-remove-circle" color="green" size="18" v-if="index !== 0 && icon" @click="removeItem(index)"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default: [
        {content: '', replace: ''}
      ]
    },
    icon: {
      type: Boolean,
      default: true
    },
    firstPlaceholder: {
      type: String,
      default: '被替换内容'
    },
    lastPlaceholder: {
      type: String,
      default: '替换内容'
    }
  },
  mounted() {
    
  },
  methods: {
    addItem() {
      this.value.push({
        content: '', replace: ''
      })
    },
    removeItem(i) {
      this.value.splice(i, 1)
    }
  }
}
</script>
<style lang="less" scoped>
  .input-box:not(:first-child) {
    margin-top: 10px;
  }

  .input-box {
    display: flex;
    position: relative;
    &-space {
      text-align: center;
      width: 46px;
    }
    &-add {
      position: absolute;
      right: -25px;
      top: 7px;
    }
  }
</style>