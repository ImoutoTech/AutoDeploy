// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode')
const shell = require('shelljs')

module.exports = async function (params, context) {
  const { project } = params
  const projects = await aircode.db.table('projects')

  if (!project || !(await projects.where({ name: project }).find()).length) {
    return {
      msg: 'no such project',
    }
  }

  if (!shell.which('git')) {
    return {
      msg: 'git not found',
    }
  }

  return {
    msg: 'done',
  }
}
