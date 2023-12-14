// @see https://docs.aircode.io/guide/functions/
import aircode from 'aircode'
import axios from 'axios'
import 'dotenv/config'

export default async function hello(params, context) {
  let res = null
  try {
    res = await axios.get(process.env.CONFIG_URL, {
      headers: {
        origin: process.env.CONFIG_ORIGIN,
      },
    })
  } catch (e) {
    return {
      msg: e.message,
    }
  }

  const { data: resData } = res
  const projects = await aircode.db.table('projects')

  // clear database
  await projects.delete(await projects.where().find())

  // update
  const promises = []
  resData.projects.forEach((project) => {
    promises.push(projects.save(project))
  })
  await Promise.all(promises)

  return {
    msg: 'done',
  }
}
