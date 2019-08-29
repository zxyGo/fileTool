<template>
  <div>
    <Modal 
      v-model="modalShow"
      :loading="isLoading"
      :width="820"
      @on-ok="ok('formItem')"
      class-name="vertical-center-modal"
    >
        <p slot="header">下级路径信息</p>
        <Form ref="formItem" :model="defaultItem" :rules="formValidate" label-position="left" :label-width="120" style="marginRight: 16px">
          <FormItem label="接口文件下级路径" prop="urlPath">
            <module-input v-model="defaultItem.urlPath" :firstPlaceholder="'文件名的正则匹配'" :lastPlaceholder="'下级路径'" :icon="false"></module-input>
          </FormItem>
          <FormItem label="通用下级路径" prop="nextPath">
            <checkbox-input v-model="defaultItem.nextPath" :firstPlaceholder="'文件名的正则匹配'" :lastPlaceholder="'下级路径'"></checkbox-input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
import ModuleInput from '../component/moduleInput'
import CheckboxInput from '../component/checkboxInput'

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    modalShow: {
      get: function() {
        return this.isShow
      },
      set: function(newValue) {
        this.$emit('cancel', newValue)
        // this.isShow = newValue
      }
    }
  },
  mounted() {
    this.setDefaultValue()
  },
  data() {
    // 下级路径验证
    const pathRule = (rule, value, callback) => {
      const result = value.every(item => {
        return item.content !== '' && item.replace !== '';
      })
      if(!result) {
        return callback(new Error('下级路径不能为空！'))
      } else {
        callback()
      }
    }
    // 下级路径验证
    const urlPathRule = (rule, value, callback) => {
      const result = value.every(item => {
        return (item.content !== '' && item.replace !== '') || (!item.content && !item.replace);
      })
      if(!result) {
        return callback(new Error('下级路径不能为空！'))
      } else {
        callback()
      }
    }
    return {
      isLoading: true,
      defaultItem: {
        nextPath: [{checked: true, content: '', replace: ''}],
        urlPath: [{content: '', replace: ''}],
      },
      formValidate: {
        nextPath: [
          {required: true, validator: pathRule, trigger: 'blur'}
        ],
        urlPath: [
          {validator: urlPathRule, trigger: 'blur'}
        ],
      },
      // modalShow: this.isShow
    }
  },
  methods: {
    async ok(name) {
      const formResult = await this.$refs[name].validate()
      if (!formResult) {
        this.isLoading = false
        setTimeout(() => {
          this.isLoading = true
        }, 50)
        return
      }
      this.$emit('pathInfo', this.defaultItem)
      this.$emit('cancel', false)
    },
    setDefaultValue() {
      const _tem = this.$store.state.Test.defaultConfig
      if (_tem.createFileNextPaths) {
        _tem.createFileNextPaths.forEach(item => item.checked = true)
        this.defaultItem.nextPath = _tem.createFileNextPaths
      }
      if (_tem.createUrlFileNextPaths) {
        this.defaultItem.urlPath = _tem.createUrlFileNextPaths
      }
      if (_tem.createFileNextPaths && _tem.createUrlFileNextPaths) {
        this.$emit('pathInfo', this.defaultItem)
      }
    },
    setNewValue(moduleName) {
      const _tem = JSON.parse(JSON.stringify(this.$store.state.Test.defaultConfig))
      if (_tem.createFileNextPaths) {
        _tem.createFileNextPaths.map(createFileNextPath => {
          const path = createFileNextPath.replace.replace(/__templateModule/g,moduleName)
          createFileNextPath.replace = path
          return createFileNextPath
        })
        _tem.createFileNextPaths.forEach(item => item.checked = true)
        this.defaultItem.nextPath = _tem.createFileNextPaths
      }
      if (_tem.createUrlFileNextPaths) {
        _tem.createUrlFileNextPaths.map(urlFileNextPath => {
          const path = urlFileNextPath.replace.replace(/__templateModule/g,moduleName)
          urlFileNextPath.replace = path
          return urlFileNextPath
        })
        this.defaultItem.urlPath = _tem.createUrlFileNextPaths
      }
      if (_tem.createFileNextPaths && _tem.createUrlFileNextPaths) {
        this.$emit('pathInfo', this.defaultItem)
      }
    },
    // 重置
    resetForm() {
      this.$refs.formItem.resetFields()
    }
  },
  components: {
    ModuleInput,
    CheckboxInput
  }
}
</script>
