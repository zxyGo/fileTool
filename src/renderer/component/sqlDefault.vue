<template>
  <div>
    <Modal 
      v-model="modalShow"
      :loading="isLoading"
      @on-ok="ok('formItem')"
    >
        <p slot="header">数据库基本信息</p>
        <Form ref="formItem" :model="defaultItem" :rules="formValidate" label-position="left" :label-width="150">
          <FormItem label="数据库地址(host)" prop="host">
            <Input type="text" v-model="defaultItem.host" clearable/>
          </FormItem>
          <FormItem label="端口号(port)" prop="port">
            <Input type="text" v-model="defaultItem.port" clearable/>
          </FormItem>
          <FormItem label="数据库名(database)" prop="database">
            <Input type="text" v-model="defaultItem.database" clearable/>
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
import { setTimeout } from 'timers';
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
      // modalShow: this.isShow
    }
  },
  mounted() {
    let _formItem = localStorage.getItem('formItem')
    if (_formItem) {
      
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
      this.$emit('sqlInfo', this.defaultItem)
      this.$emit('cancel', false)
    },
  }
}
</script>