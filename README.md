# oyoyo

## 安装 
`
npm install @oyoyo/cli -g
`

## 示例 
* 创建一个插件目录plugin-test
``` javascript
module.exports = cli => {
  cli.hook('command', () => {
    cli.command.registerCommand(
      'cmd-test',
      { isMenu: true, alias: '插件测试' },
      () => {
        console.log('测试插件命名执行')
      }
    )
  })
}

```
* 创建一个oyoyo.config.js ,并且将插件安装
``` javascript

const path = require('path')
module.exports = {
  plugins: [
    "./plugin-test"
  ]
}


```

* 执行oyoyo，将出现插件所设置的命令  

![alt text](https://xyqgithubassets.s3-ap-southeast-1.amazonaws.com/3C8F4B45-49EE-4D03-A399-C414F3171123.png)



* 最后选择并且执行即可



