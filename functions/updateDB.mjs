// @see https://docs.aircode.io/guide/functions/
import aircode from 'aircode'
import axios from 'axios'
import 'dotenv/config'

export default async function hello(params, context) {
  let res = null
  try {
    res = await axios.get(process.env.CONFIG_URL, {
      headers: {
        origin: 'autodeploy.com',
      },
    })
  } catch (e) {
    return {
      msg: e.message,
    }
  }

  const { data: resData } = res

  return {
    msg: 'done',
    data: res.data,
  }
}
