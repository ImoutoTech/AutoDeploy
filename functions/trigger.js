// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode')
const shell = require('shelljs')

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

  new Promise((rs) => setTimeout(rs, 1))
    .then(() => {
      const { git, path } = queryResult[0]
      shell.exec(`git clone ${git} ./tmp`)
      shell.exec('pwd')
    })
    .finally(() => {
      console.log('action finished')
      shell.rm('-rf', './tmp')
      console.log('tmp cleared')
    })

  return {
    msg: 'done',
  }
}
