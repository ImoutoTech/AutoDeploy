// @see https://docs.aircode.io/guide/functions/
import aircode from 'aircode'

export default async function hello(params, context) {
  const { project } = params
  const projects = await aircode.db.table('projects')

  if (!project || !(await projects.where({ name: project }).find()).length) {
    return {
      msg: 'no such project',
    }
  }

  return {
    msg: 'done',
  }
}
