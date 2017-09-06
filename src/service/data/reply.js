import API from '../apiWrapper'
import { U2_HOST_TEST, BACKEND_HOST } from '../../config'
const ENTRIES = {
  categories: {
    method: 'GET',
    host: BACKEND_HOST,
    path: '/api/categories',
    timeout: 300
  },
  reply: {
    method: 'GET',
    host: U2_HOST_TEST,
    path: `/api/v2/internal/reply`,
    timeout: 300
  }
}
const api = new API(ENTRIES)
export default api
