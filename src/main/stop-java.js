const child_process = require('child_process')
const iconv = require('iconv-lite')

let kill_process
const killOut = []

function killPid(pid) {
  kill_process = child_process.exec('cmd /c taskkill /F /pid ' + pid, { encoding: 'GBK' })
  kill_process.stdout.on('data', (data) => {
    killOut.push(data)
  })
  kill_process.stderr.on('data', (data) => {
    console.log('killPid stderr：\n' + data)
  })
  kill_process.on('close', (code) => {
    const str = iconv.decode(Buffer.concat(killOut), 'GBK')
    console.log('killPid close：\n' + str)
    console.log('killPid out code：' + code)
    if (str.indexOf('成功') !== -1) {
      console.log('退出java进程成功')
      process.send('success')
    }
  })
}

function kill_java() {
  child_process.exec('cmd /c netstat -ano | findstr "10138"', function(error, stdout, stderr) {
    if (error) {
      console.log('findPid error：\n' + error)
    }
    if (stdout) {
      console.log('findPid stdout：\n' + stdout)
      const pidArry = stdout.split('\r\n')
      if (pidArry !== []) {
        const firstPid = pidArry[0]
        const index = firstPid.indexOf('LISTENING') + 9
        const pid = firstPid.substr(index).trim()
        killPid(pid)
      }
    }
    if (stderr) {
      console.log('findPid stderr：\n' + stderr)
    }
  })
}

function check() {
  child_process.exec('cmd /c netstat -ano | findstr "10138"', function(error, stdout, stderr) {
    if (error) {
      console.log('findPid error：\n' + error)
    }
    if (stdout) {
      console.log('findPid stdout：\n' + stdout)
      const pidArry = stdout.split('\r\n')
      if (pidArry !== [] && pidArry[0].indexOf('10138') !== -1) {
        process.send('running')
      }
    }
    if (stderr) {
      console.log('findPid stderr：\n' + stderr)
    }
  })
}

process.on("message", (msg) => {
  if (msg === 'stop') {
    kill_java()
  }

  if (msg === 'check') {
    check()
  }
})
