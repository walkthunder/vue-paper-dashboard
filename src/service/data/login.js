import API from '../apiWrapper'
import { BACKEND_HOST } from '../../config'
const ENTRIES = {
  login: {
    method: 'GET',
    host: BACKEND_HOST,
    path: `/api/jwt?username={0}&password={1}`,
    timeout: 300
  }
}
const api = new API(ENTRIES)
export default api
