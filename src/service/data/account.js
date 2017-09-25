import API from '../apiWrapper'
import { BACKEND_HOST, U2_HOST, U2_HOST_ONLINE, PAY_HOST } from '../../config'
const ENTRIES = {
  managers: {
    method: 'GET',
    host: BACKEND_HOST,
    path: '/api/managers',
    timeout: 300
  },
  accounts: {
    method: 'GET',
    host: U2_HOST,
    path: `/api/v2/internal/alternative_account/account_list`,
    timeout: 300
  },
  update_account: {
    method: 'PUT',
    host: U2_HOST,
    path: '/api/v2/internal/alternative_account',
    timeout: 300
  },
  post_account: {
    method: 'POST',
    host: U2_HOST,
    path: '/api/v2/internal/alternative_account',
    timeout: 300
  },
  upyun_token: {
    method: 'GET',
    host: BACKEND_HOST,
    path: '/api/upyun_token',
    timeout: 300
  },
  random: {
    method: 'GET',
    host: U2_HOST,
    path: '/api/v2/internal/alternative_account/random',
    timeout: 300
  },
  account: {
    method: 'GET',
    host: U2_HOST_ONLINE,
    path: '/u2/api/v4/user',
    timeout: 300
  },
  shop_list: {
    method: 'GET',
    host: PAY_HOST,
    path: '/api/v1/subscriptions',
    timeout: 600
  },
  shop_item_info: {
    method: 'GET',
    host: PAY_HOST,
    path: '/api/v1/purchase_entities/entity_ids',
    timeout: 600
  },
  ban: {
    method: 'POST',
    host: U2_HOST,
    path: '/api/v2/internal/banned_user',
    timeout: 300
  },
  unban: {
    method: 'DELETE',
    host: U2_HOST,
    path: '/api/v2/internal/banned_user',
    timeout: 300
  },
  banned_list: {
    method: 'GET',
    host: U2_HOST,
    path: '/api/v2/internal/banned_user',
    timeout: 300
  },
  messages: {
    method: 'GET',
    host: U2_HOST,
    path: '/api/v2/internal/manager_msg',
    timeout: 300
  }
}

const api = new API(ENTRIES)
export default api
