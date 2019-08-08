<template>
  <div class="home">
    <Form ref="formItem" :model="formItem" :rules="formValidate" label-position="left" :label-width="150">
      <FormItem label="模版文件路径" prop="modulePath">
        <Input type="text" v-model="formItem.modulePath" placeholder="Mac(/D/test/)   Windows(C:\Users\DSHui\Desktop\)" clearable/>
      </FormItem>
      <FormItem label="模版文件匹配的字段" prop="modulePathFile">
        <Input type="text" v-model="formItem.modulePathFile" placeholder="例如：.java，test.vue" clearable/>
      </FormItem>
      <FormItem>
        <Checkbox v-model="single">是否调用接口</Checkbox>
      </FormItem>
      <template v-if="single">
        <FormItem>
          <a class="clickStyle" @click="openSqlModal">数据库基本信息</a>
        </FormItem>
        <FormItem label="表名(tableName)" prop="tableName">
          <Input type="text" v-model="formItem.tableName" clearable/>
        </FormItem>
        <FormItem label="实体主键(keyId)" prop="keyId">
          <Input type="text" v-model="formItem.keyId" clearable/>
        </FormItem>
        <FormItem label="实体名(entityName)" prop="entityName">
          <Input type="text" v-model="formItem.entityName" clearable/>
        </FormItem>
        <FormItem label="模块名(moduleName)" prop="moduleName">
          <Input type="text" v-model="formItem.moduleName" clearable/>
        </FormItem>
      </template>
      <FormItem label="文件内替换字符" prop="replaceContent">
        <module-input v-model="formItem.replaceContent"></module-input>
      </FormItem>
      <FormItem label="文件名替换" prop="replaceFileName">
        <module-input v-model="formItem.replaceFileName" :icon="false"></module-input>
      </FormItem>
      <FormItem label="生成文件路径(path)" prop="path">
        <!-- <module-input></module-input> -->
        <Input type="text" v-model="formItem.path" placeholder="Mac(/D/test/)   Windows(C:\\Users\\DSHui\\Desktop\\)" clearable/>
        <Checkbox v-model="isNextPath" @change="readJson()">精确生成路径</Checkbox>
      </FormItem>
      <template v-if="isNextPath">
        <FormItem label="精确下级路径" prop="nextPath" class="next-item">
          <module-input v-model="formItem.nextPath" :firstPlaceholder="'文件名的正则匹配'" :lastPlaceholder="'下级路径'"></module-input>
        </FormItem>
      </template>

    </Form>
    <div class="home-btn">
      <Button type="primary" @click="createClassFile('formItem')">生成实体类</Button>
      <Button style="margin-left: 10px" @click="resetForm('formItem')">重置</Button>
    </div>
    <sql-default :isShow="sqlShow" @cancel="sqlCancel" @sqlInfo="sqlInfo"></sql-default>
  </div>
</template>
<script>
import fs from 'fs'
import qs from 'querystring'
import path from 'path'
import ModuleInput from '../component/moduleInput'

// 数据库信息默认组件
import SqlDefault from '../component/sqlDefault'


let plat = '';
export default {
  name: 'home-page',
  data () {
    // 路径正则验证
    const pathReg = (rule, value, callback) => {
      if(!value) {
        return callback(new Error('路径不能为空！'))
      } else if (!(/^\/.*\/$/.test(value) || /^[CDEF]:.*\\$/.test(value))) {
        return callback(new Error('路径格式不正确，例如 Mac(/D/test/)--- Windows(C:\\Users\\DSHui\\Desktop\\)'))
      } else {
        callback()
      }
    }

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

    return {
      single: true,
      isNextPath: false,
      sqlShow: false,
      formItem: {
        modulePath: '',
        modulePathFile: '',
        host: '',
        port: '',
        database: '',
        username: '',
        password: '',
        tableName: 'member',
        keyId: 'memberId',
        entityName: 'Member',
        moduleName: 'member',
        replaceContent: [{content: '', replace: ''}],
        replaceFileName: [{content: '', replace: ''}],
        path: '',
        nextPath: [{content: '', replace: ''}]
      },
      formValidate: {
        modulePath: [
          {required: true, validator: pathReg, trigger: 'blur'}
        ],
        modulePathFile: [
          {required: true, message: '模版文件匹配的字段不能为空！', trigger: 'blur'}
        ],
        // host: [
        //   {required: true, message: 'The host cannot be empty', trigger: 'blur'}
        // ],
        // port: [
        //   {required: true, message: 'The port cannot be empty', trigger: 'blur'}
        // ],
        // database: [
        //   {required: true, message: 'The database cannot be empty', trigger: 'blur'}
        // ],
        // username: [
        //   {required: true, message: 'The username cannot be empty', trigger: 'blur'}
        // ],
        // password: [
        //   {required: true, message: 'The password cannot be empty', trigger: 'blur'}
        // ],
        tableName: [
          {required: true, message: 'The tableName cannot be empty', trigger: 'blur'}
        ],
        keyId: [
          {required: true, message: 'The keyId cannot be empty', trigger: 'blur'}
        ],
        entityName: [
          {required: true, message: 'The entityName cannot be empty', trigger: 'blur'}
        ],
        moduleName: [
          {required: true, message: 'The moduleName cannot be empty', trigger: 'blur'}
        ],
        replaceContent: [
          {required: true, validator: contentRule, trigger: 'blur'}
        ],
        replaceFileName: [
          {required: true, validator: contentRule, trigger: 'blur'}
        ],
        path: [
          {required:true, validator: pathReg, trigger: 'blur'}
        ],
        nextPath: [
          {required: true, validator: pathRule, trigger: 'blur'}
        ],
      }
    }
  },
  mounted() {
    plat = process.platform
    let _formItem = localStorage.getItem('formItem')
    let _single = localStorage.getItem('single')
    let _isNextPath = localStorage.getItem('isNextPath')
    if (_formItem)
      this.formItem = JSON.parse(_formItem)
    if (_single !== null)
      this.single = _single === 'true'
    if (_isNextPath !== null) 
      this.isNextPath = _isNextPath === 'true'
  },
  methods: {
    async createClassFile(name) {
      // 验证
      const formResult = await this.$refs[name].validate((valid) => {
        // if (valid) {
        //   this.$Message.success('Success!');
        // } else {
        //   this.$Message.error('Fail!');
        // }
      })
      if (!formResult) return
      // 验证模版文件位置是否正确
      if (!fs.existsSync(this.formItem.modulePath)) {
        return this.$Message.error({
          content: '模版文件路径不存在，请检查！',
          duration: 10,
          closable: true
        })
      }


      const createFloderBack = await this.createFloder(this.formItem.path);
      if (!createFloderBack) {
        return this.$Message.error({
          content: '文件路径错误，请检查！',
          duration: 10,
          closable: true
        })
      }

      // 调用接口生成文件
      if (this.single) {
        this.createFile()
      }

      const fileNames = [];
      const temFileNames = fs.readdirSync(this.formItem.modulePath);
      temFileNames.forEach(item => {
        if (item.indexOf(this.formItem.modulePathFile) !== -1) {
          fileNames.push(item);
        }
      })
      if (fileNames.length === 0) {
        return this.$Message.error({
          content: '没有匹配到文件，请检查！',
          duration: 10,
          closable: true
        })
      }
      fileNames.forEach(async item => {
        const content = fs.readFileSync(this.formItem.modulePath + item, 'utf-8')
        // 获取模版文件的内容,并修改
        let newContent = content;
        this.formItem.replaceContent.forEach(item => {
          newContent = newContent.replace(new RegExp(item.content, 'g'), item.replace)
        })
        // const newContent = content.replace(new RegExp('templateModule', 'g'), this.formItem.moduleName)
        //                           .replace(new RegExp('TemplateModule', 'g'), this.formItem.moduleName.replace(/^\S/,s => s.toUpperCase()))
        //                           .replace(new RegExp('templateName', 'g'), this.formItem.entityName)
        //                           .replace(new RegExp('TemplateName', 'g'), this.formItem.entityName.replace(/^\S/,s => s.toUpperCase()))
        //                           .replace(new RegExp('tempalteMainIdStr', 'g'), this.formItem.keyId)
        //                           .replace(new RegExp('TempalteMainIdStr', 'g'), this.formItem.keyId.replace(/^\S/,s => s.toUpperCase()))
        //                           .replace(new RegExp('TEMPLATENAMEPROVIDER', 'g'), this.formItem.entityName.toUpperCase() + 'PROVIDER')
        if (!this.isNextPath) {
          fs.writeFileSync(`${this.formItem.path}${item.replace(this.formItem.replaceFileName[0].content, this.formItem.replaceFileName[0].replace)}`, newContent, (res) => {
            console.log(res);
          }) 
        } else {
          // 精确匹配
          const result = this.formItem.nextPath.filter(ele => {
            return item.indexOf(ele.content) !== -1
          })
          if (result.length !== 0) {
            for(let i  = 0; i < result.length; i++) {
              const createFloderBack = await this.createFloder(this.formItem.path + result[i].replace);
              if (!createFloderBack) {
                return this.$Message.error({
                  content: '文件路径错误，请检查！',
                  duration: 10,
                  closable: true
                })
              }
              fs.writeFileSync(`${this.formItem.path + result[i].replace}${item.replace(this.formItem.replaceFileName[0].content, this.formItem.replaceFileName[0].replace)}`, newContent, (res) => {
                console.log(res);
              }) 
            }
            
          } else {
            // 未匹配到按照原先的
            fs.writeFileSync(`${this.formItem.path}${item.replace(this.formItem.replaceFileName[0].content, this.formItem.replaceFileName[0].replace)}`, newContent, (res) => {
              console.log(res);
            }) 
          }
        }
              
      })
      this.saveHistoryData();
      this.$Message.success({
        content: '实体类生成成功！',
        duration: 10,
        closable: true
      })
    },
    createFloder(path) {
      return new Promise((resolve, reject) => {
        // 生成路径
        if (plat == 'darwin') {
          const hierarchyFolder = path.split('/').filter(d => d);
          console.log(hierarchyFolder)
          if (fs.existsSync(path)) {
            return resolve(true)
          } else {
            if (!fs.existsSync(`/${hierarchyFolder[0]}`)) {
              return resolve(false)
            } else {
              let temPath = '';
              hierarchyFolder.forEach(item => {
                temPath += `/${item}`;
                if (!fs.existsSync(temPath)) {
                  fs.mkdirSync(temPath)
                }
              })
              resolve(true)
            }
          }
        } else {
          const hierarchyFolder = path.split('\\').filter(d => d);
          if (fs.existsSync(path)) {
            return resolve(true)
          } else {
            console.log(hierarchyFolder[0])
            if (!fs.existsSync(`${hierarchyFolder[0]}`)) {
              return resolve(false)
            } else {
              let temPath = '';
              hierarchyFolder.forEach(item => {
                temPath += `${item}\\`;
                if (!fs.existsSync(temPath)) {
                  fs.mkdirSync(temPath)
                }
              })
              resolve(true)
            }
          }
        }
      })
    },
    // 通过接口获取创建文件内容，并创建
    createFile() {
      const params = {
        host: this.formItem.host,
        port: this.formItem.port,
        database: this.formItem.database,
        username: this.formItem.username,
        password: this.formItem.password,
        tableName: this.formItem.tableName,
        keyId: this.formItem.keyId,
        entityName: this.formItem.entityName,
        moduleName: this.formItem.moduleName
      }
      this.$http({
        url: 'https://cs.mclon.com/config/develop/getModel',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({jsonObject: encodeURI(JSON.stringify(params))})
      }).then(res => {
        if (res.data.status === '00000') {
          fs.writeFile(`${this.formItem.path}${this.formItem.entityName}.java`, res.data.t, (res) => {

          })
        }
      })
    },
    resetForm(name) {
      this.$refs[name].resetFields()
    },
    saveHistoryData() {
      localStorage.setItem('formItem', JSON.stringify(this.formItem))
      localStorage.setItem('single', this.single)
      localStorage.setItem('isNextPath', this.isNextPath)
    },
    readJson() {
      if (this.isNextPath) {

      }
    },
    // 数据库基本信息
    openSqlModal() {
      this.sqlShow = true
    },
    sqlCancel(e) {
      this.sqlShow = false
    },
    sqlInfo(data) {
      Object.assign(this.formItem, data)
    }
  },
  components: {
    ModuleInput,
    SqlDefault
  }
}
</script>
<style lang="less">
  .home {
    padding: 3% 20%;
    &-btn {
      text-align: center;
    }
  }
  .next-item {
    margin-left: 150px;
  }

  .clickStyle {
    font-size: 14px;
  }
</style>