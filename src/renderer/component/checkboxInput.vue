<template>
  <div class="input">
    <div class="checkbox-all">
      <Checkbox
        :indeterminate="indeterminate"
        :value="checkAll"
        @click.prevent.native="handleCheckAll"
      >全选</Checkbox>
    </div>
    <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
      <div class="box-scroll">
      <div class="input-box" v-for="(item, index) in value" :key="index">
        <Checkbox :label="index" v-model="item.checked">
          <span class="hide-ele"></span>
        </Checkbox>
        <Input type="text" v-model="item.content" :placeholder="firstPlaceholder" clearable />
        <span class="input-box-space">--</span>
        <Input type="textarea" v-model="item.replace" :autosize="{minRows: 3, maxRows: 5}" :placeholder="lastPlaceholder" clearable />
        <Icon
          class="input-box-add"
          type="md-add-circle"
          color="red"
          size="18"
          @click="addItem"
          v-if="index === 0 && icon"
        />
        <Icon
          class="input-box-add"
          type="md-remove-circle"
          color="green"
          size="18"
          v-if="index !== 0 && icon"
          @click="removeItem(index)"
        />
      </div>
      </div>
    </CheckboxGroup>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      // default: [{ content: "", replace: "" }]
      default: function(data) {
        console.log('----', data);
        let _temArr = []
        for (let i = 0; i < data.length; i++) {
          _temArr.push(i)
        }
        this.checkAllGroup = _temArr
      }
    },
    icon: {
      type: Boolean,
      default: true
    },
    firstPlaceholder: {
      type: String,
      default: "被替换内容"
    },
    lastPlaceholder: {
      type: String,
      default: "替换内容"
    }
  },
  computed: {
    checkAllGroup: {
      get: function() {
        console.log()
        let _temArr = []
        for (let i = 0; i < this.value.length; i++) {
          if (this.value[i].checked)
            _temArr.push(i)
        }
        return _temArr
      },
      set: function(data) {
      }
    }
  },
  data() {
    return {
      indeterminate: false,
      checkAll: true,
      // checkAllGroup: []
    };
  },
  mounted() {},
  methods: {
    addItem() {
      this.value.push({
        checked: false,
        content: "",
        replace: ""
      });
    },
    removeItem(i) {
      this.value.splice(i, 1);
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      if (this.checkAll) {
        let _len = this.value.length,
          _temArr = [];
        for (let i = 0; i < _len; i++) {
          _temArr.push(i);
          this.value[i].checked = true
        }
        this.checkAllGroup = _temArr;
      } else {
        this.checkAllGroup = [];
        let _len = this.value.length
        for (let i = 0; i < _len; i++) {
          this.value[i].checked = false
        }
      }
    },
    checkAllGroupChange(data) {
      let _len = this.value.length;
      if (data.length === _len) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    }
  }
};
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
.hide-ele {
  display: none;
}
.checkbox-all {
  border-bottom: 1px solid #e9e9e9;
  margin-bottom: 8px;
}
.box-scroll {
  height: 400px;
  overflow: auto;
  padding-right: 36px;
}
</style>