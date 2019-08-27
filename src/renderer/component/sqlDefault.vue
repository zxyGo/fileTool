<template>
  <div>
    <Modal 
      v-model="modalShow"
      :loading="isLoading"
      @on-ok="ok('formItem')"
      class-name="vertical-center-modal"
    >
        <p slot="header">接口调用信息</p>
        <Form ref="formItem" :model="defaultItem" :rules="formValidate" label-position="left" :label-width="150">
          <FormItem label="接口地址(url)" prop="url">
            <Input type="text" v-model="defaultItem.url" clearable/>
          </FormItem>
          <FormItem label="数据库地址(host)" prop="host">
            <Input type="text" v-model="defaultItem.host" clearable/>
          </FormItem>
          <FormItem label="端口号(port)" prop="port">
            <Input type="text" v-model="defaultItem.port" clearable/>
          </FormItem>
          <FormItem label="数据库名(database)" prop="database">
            <!-- <Input type="text" v-model="defaultItem.database" clearable/> -->
            <Select v-model="defaultItem.database" style="width:200px">
              <Option v-for="(item, index) in databaseList" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="用户名(username)" prop="username">
            <Input type="text" v-model="defaultItem.username" clearable/>
          </FormItem>
          <FormItem label="密码(password)" prop="password">
            <Input type="text" v-model="defaultItem.password" clearable/>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
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
    return {
      isLoading: true,
      defaultItem: {
        url: 'https://cs.mclon.com',
        host: '',
        port: '3306',
        database: '',
        username: '',
        password: '',
      },
      formValidate: {
        host: [
          {required: true, message: 'The host cannot be empty', trigger: 'blur'}
        ],
        port: [
          {required: true, message: 'The port cannot be empty', trigger: 'blur'}
        ],
        database: [
          {required: true, message: 'The database cannot be empty', trigger: 'blur'}
        ],
        username: [
          {required: true, message: 'The username cannot be empty', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'The password cannot be empty', trigger: 'blur'}
        ],
      },
      databaseList: []
      // modalShow: this.isShow
    }
  },
  mounted() {
    const _formItem = localStorage.getItem('formItem')
    const _databaseList = localStorage.getItem('databaseList')
    if (_databaseList) {
      this.databaseList = JSON.parse(_databaseList)
    }
    if (_formItem) {
      const _data = JSON.parse(_formItem)
      this.defaultItem.host = _data.host
      this.defaultItem.port = _data.port
      this.defaultItem.database = _data.database
      this.defaultItem.username = _data.username
      this.defaultItem.password = _data.password
    }
  },
  methods: {
    async ok(name) {
      const formResult = await this.$refs[name].validate()
      console.log(this.defaultItem)
      if (!formResult) {
        this.isLoading = false
        setTimeout(() => {
          this.isLoading = true
        }, 50)
        return
      }
      this.$emit('sqlInfo', this.defaultItem)
      this.$emit('cancel', false)
    },
    setDefaultValue() {
      const _tem = this.$store.state.Test.defaultConfig
      this.defaultItem = {
        url: _tem.url || this.defaultItem.url,
        host: _tem.host,
        port: _tem.port ? _tem.port.toString() : '3306',
        database: '',
        username: _tem.username,
        password: _tem.password,
      }
      if (_tem.databases) {
        this.databaseList = _tem.databases;
      }
      if (_tem.host && _tem.port && _tem.username && _tem.password) {
        this.$emit('sqlInfo', this.defaultItem)
        localStorage.setItem('databaseList', JSON.stringify(this.databaseList))
      }
    }
  }
}
</script>