export class ApiService {
  checkApiHealth = async () => {
    return {
      status: "healthy"
    }
  }
}
