<template>
  <div>
    <Modal 
      v-model="modalShow"
      :loading="isLoading"
      @on-ok="ok('formItem')"
      class-name="vertical-center-modal"
    >
        <p slot="header">文件替换信息</p>
        <Form ref="formItem" :model="defaultItem" :rules="formValidate" label-position="left" :label-width="150" style="marginRight: 16px">
          <FormItem label="文件名替换" prop="replaceFileName">
            <module-input v-model="defaultItem.replaceFileName" :icon="false"></module-input>
          </FormItem>
          <FormItem label="文件内容替换字符" prop="replaceContent">
            <module-input v-model="defaultItem.replaceContent"></module-input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
import ModuleInput from '../component/moduleInput'

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
  data() {
    // 替换字符验证
    const contentRule = (rule, value, callback) => {
      const result = value.every(item => {
        return item.content !== '' && item.replace !== '';
      })
      if(!result) {
        return callback(new Error('替换字符不能为空！'))
      } else {
        callback()
      }
    }
    return {
      isLoading: true,
      defaultItem: {
        replaceContent: [{content: '', replace: ''}],
        replaceFileName: [{content: '', replace: ''}],
      },
      formValidate: {
        replaceContent: [
          {required: true, validator: contentRule, trigger: 'blur'}
        ],
        replaceFileName: [
          {required: true, validator: contentRule, trigger: 'blur'}
        ],
      }
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
      this.$emit('replaceInfo', this.defaultItem)
      this.$emit('cancel', false)
    },
    setDefaultValue() {
      const _tem = this.$store.state.Test.defaultConfig
      if (_tem.replaceContents) {
        this.defaultItem.replaceContent = _tem.replaceContents
      }
      if (_tem.replaceFileNames) {
        this.defaultItem.replaceFileName = _tem.replaceFileNames
      }
      if (_tem.replaceContents && _tem.replaceFileNames) {
        this.$emit('replaceInfo', this.defaultItem)
      }
    }
  },
  components: {
    ModuleInput
  }
}
</script>