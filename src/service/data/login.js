import API from '../apiWrapper'
import { BACKEND_HOST } from '../../config'
const ENTRIES = {
  login: {
    method: 'GET',
    host: BACKEND_HOST,
    path: `/api/jwt`,
    timeout: 300
  }
}
const api = new API(ENTRIES)
export default api
