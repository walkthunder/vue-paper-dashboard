import API from '../apiWrapper'
import { U2_HOST, BACKEND_HOST } from '../../config'
const ENTRIES = {
  categories: {
    method: 'GET',
    host: BACKEND_HOST,
    path: '/api/categories',
    timeout: 300
  },
  reply: {
    method: 'GET',
    host: U2_HOST,
    path: `/api/v2/internal/reply`,
    timeout: 300
  },
  answer: {
    method: 'POST',
    host: U2_HOST,
    path: '/api/v2/internal/reply',
    timeout: 300
  },
  delete: {
    method: 'DELETE',
    host: U2_HOST,
    path: '/api/v2/internal/reply',
    timeout: 300
  },
  deleted_reply: {
    method: 'GET',
    host: U2_HOST,
    path: '/api/v2/internal/deleted_reply',
    timeout: 1000
  },
  recover_reply: {
    method: 'POST',
    host: U2_HOST,
    path: '/api/v2/internal/recover_reply',
    timeout: 300
  }
}
const api = new API(ENTRIES)
export default api
