// @see https://docs.aircode.io/guide/functions/
import aircode from 'aircode'
import 'dotenv/config'

export default async function hello(params, context) {
  console.log('🤔 process.env 是 ', process.env)
  return {
    data: process.env.CONFIG_URL,
  }
}
