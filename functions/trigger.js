// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode')
const shell = require('shelljs')
const axios = require('axios')
require('dotenv').config()

function Logger() {
  this.logText = ''

  this.log = (text) => {
    this.logText += `${text}\n`
  }

  this.getLog = () => this.logText
}

function sendNotice(project, content, status) {
  return axios.post(
    `https://sctapi.ftqq.com/${process.env.SERVERCHAN_KEY}.send`,
    {
      channel: 9,
      title: `项目${project}触发构建日志`,
      short: `结果：${status}`,
      desp: content,
    },
    {
      Headers: {
        'Content-type': 'application/json',
      },
    }
  )
}

module.exports = async function (params, context) {
  const { project } = params
  const projects = await aircode.db.table('projects')

  const queryResult = await projects.where({ name: project }).find()
  if (!project || !queryResult.length) {
    return {
      msg: 'no such project',
    }
  }

  if (!shell.which('git')) {
    return {
      msg: 'git not found',
    }
  }

  const logger = new Logger()
  const { log } = logger
  const cmd = (line) => log(line.stderr || line.stdout)
  let errorFlag = false

  new Promise((rs) => setTimeout(rs, 1))
    .then(() => {
      const { git, path, envName, envValue } = queryResult[0]
      const workRootPath = shell.exec('pwd').stdout
      log(`当前路径: ${workRootPath}`)
      log('拉取项目至 ./tmp')
      cmd(shell.exec(`git clone ${git} ./tmp`))

      log('代码拉取完成，进入tmp目录并安装依赖')
      shell.cd('./tmp')
      cmd(shell.exec('pwd'))
      cmd(shell.exec('pnpm i'))

      log('依赖安装完成，创建env文件')
      cmd(shell.exec(`touch ${envName}`))
      const envString = Object.entries(envValue).reduce(
        (text, [key, value]) => {
          return text + `\n${key}='${value}'`
        },
        ''
      )
      log(`生成ENV文件内容: \n${envString}`)
      cmd(shell.exec(`echo "${envString}" >> ${envName}`))

      shell.cd(workRootPath)
    })
    .catch((error) => {
      log(`发生错误: \n${error.message}`)
      errorFlag = true
    })
    .finally(() => {
      log('操作已完成')
      cmd(shell.exec('pwd'))
      cmd(shell.rm('-rf', './tmp'))
      log('临时目录已清理')

      sendNotice(project, logger.getLog(), errorFlag ? '错误' : '成功')
    })

  return {
    msg: 'done',
  }
}
