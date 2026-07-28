import { checkApiHealth } from "../../app/health.service.js"

export const getHealthStatus = async() => {
  return {
    api: await checkApiHealth()
  }
}
