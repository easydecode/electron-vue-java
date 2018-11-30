const child_process = require('child_process')
const path = require('path')
const iconv = require('iconv-lite')

// 任何你期望执行的cmd命令，ls都可以
// java -version
const java = path.resolve('./static/java/jre/bin/java')

const jar = path.resolve('./static/java/web.jar')

const cmd = java + ' -jar ' + jar + ' --server.port=10138'
console.log(cmd)
// 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
const cmdPath = path.resolve()

const options = { cwd: cmdPath, encoding: 'GBK' }

// 子进程名称
let workerProcess
const java_log = []
function startJavaWeb() {
  // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
  workerProcess = child_process.exec(cmd, options)
  // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

  // 打印正常的后台可执行程序输出
  workerProcess.stdout.on('data', function(data) {
    java_log.push(data)
  })

  // 打印错误的后台可执行程序输出
  workerProcess.stderr.on('data', function(data) {
    console.log('stderr: ' + data)
    console.log('stderr: ' + iconv.decode(Buffer.concat(java_log), 'GBK'))
  })

  // 退出之后的输出
  workerProcess.on('close', function(code) {
    // console.log('killPid close：\n' + iconv.decode(Buffer.concat(java_log), 'GBK'))
    console.log('startJavaWeb out code：' + code)
  })
}

process.on("message", (msg) => {
  if (msg === 'start') {
    startJavaWeb()
  }
})
