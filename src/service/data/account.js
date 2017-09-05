import API from '../apiWrapper'
import { BACKEND_HOST, U2_HOST_TEST } from '../../config'
const ENTRIES = {
  managers: {
    method: 'GET',
    host: BACKEND_HOST,
    path: '/api/managers',
    timeout: 300
  },
  accounts: {
    method: 'GET',
    host: U2_HOST_TEST,
    path: `/api/v2/internal/alternative_account/account_list`,
    timeout: 300
  },
  update_account: {
    method: 'PUT',
    host: U2_HOST_TEST,
    path: '/api/v2/internal/alternative_account',
    timeout: 300
  },
  post_account: {
    method: 'POST',
    host: U2_HOST_TEST,
    path: '/api/v2/internal/alternative_account',
    timeout: 300
  },
  upyun_token: {
    method: 'GET',
    host: BACKEND_HOST,
    path: '/api/upyun_token',
    timeout: 300
  }
}

const api = new API(ENTRIES)
export default api
