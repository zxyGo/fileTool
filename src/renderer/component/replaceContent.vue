<template>
  <div>
    <Modal 
      v-model="modalShow"
      :loading="isLoading"
      @on-ok="ok('formItem')"
      :width="620"
      class-name="vertical-center-modal"
    >
        <p slot="header">文件替换信息</p>
        <Form ref="formItem" :model="defaultItem" :rules="formValidate" label-position="left" :label-width="120" style="marginRight: 16px">
          <FormItem label="文件名替换" prop="replaceFileName">
            <module-input v-model="defaultItem.replaceFileName" :icon="false"></module-input>
          </FormItem>
          <FormItem label="文件内容替换字符" prop="replaceContent">
            <Button type="info" class="replate-btn" @click="updateRule">服务端默认规则</Button>
            <module-input v-model="defaultItem.replaceContent"></module-input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
import ModuleInput from '../component/moduleInput'
import { parseTime } from '../utils/index'
import { debuglog } from 'util';

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    tableName: {
      type: String,
      default: ''
    },
    moduleName: {
      type: String,
      default: ''
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
    },
    // 更新规则
    updateRule() {
      // const _temArr = this.tableName.split('_')
      // const smallCamelCase = _temArr.reduce((acc, cur, index) => {
      //     index !== 0 ? acc.push(cur.replace(/^\S/, s => s.toUpperCase())) : acc.push(cur)
      //     return acc
      //   }, []).join('');
      // const bigCamelCase = _temArr.reduce((acc, cur) => {
      //     acc.push(cur.replace(/^\S/, s => s.toUpperCase()))
      //     return acc
      //   }, []).join('');
      // const upperCase = _temArr.reduce((acc, cur) => {
      //   acc.push(cur.toUpperCase)
      //   return acc
      // }, []).join('');
      this.defaultItem.replaceFileName[0].replace = this.bigCamelCase(this.tableName);
      this.defaultItem.replaceContent.forEach(item => {
        switch (item.content) {
          case 'TemplateName':
            item.replace = this.bigCamelCase(this.tableName);
            break;
          case 'TEMPLATENAMEPROVIDER':
            item.replace = this.upperCase(this.tableName) + 'PROVIDER';
            break;
          case 'TempalteMainIdStr':
            item.replace = this.bigCamelCase(this.tableName) + 'Id';
            break;
          case 'tempalteMainIdStr':
            item.replace = this.smallCamelCase(this.tableName) + 'Id';
            break;
          case 'templateName':
            item.replace = this.smallCamelCase(this.tableName);
            break;
          case 'TemplateModule':
            item.replace = this.bigCamelCase(this.moduleName);
            break;
          case 'templateModule':
            item.replace = this.smallCamelCase(this.moduleName);
            break;
          case 'TemplateCreateDate':
            item.replace = parseTime(new Date(), '{y}-{m}-{d}')
        }
      })
    },
    smallCamelCase(moduleString) {
      const _temArr = moduleString.split('_')
      const smallCamelCase = _temArr.reduce((acc, cur, index) => {
          index !== 0 ? acc.push(cur.replace(/^\S/, s => s.toUpperCase())) : acc.push(cur)
          return acc
        }, []).join('');
      return smallCamelCase;
    },
    bigCamelCase(moduleString) {
      const _temArr = moduleString.split('_')
      const bigCamelCase = _temArr.reduce((acc, cur) => {
          acc.push(cur.replace(/^\S/, s => s.toUpperCase()))
          return acc
        }, []).join('');
      return bigCamelCase;
    },
    upperCase(moduleString) {
      const _temArr = moduleString.split('_')
      const upperCase = _temArr.reduce((acc, cur) => {
        acc.push(cur.toUpperCase())
        return acc
      }, []).join('');
      return upperCase;
    }
  },
  components: {
    ModuleInput
  }
}
</script>
<style lang="less" scoped>
  .replate-btn {
    margin-bottom: 10px;
  }
</style>