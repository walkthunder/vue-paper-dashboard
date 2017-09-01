import API from '../apiWrapper'
import { U2_HOST_TEST } from '../../config'
const ENTRIES = {
  accounts: {
    method: 'GET',
    host: U2_HOST_TEST,
    path: `/api/v2/internal/alternative_account/account_list?manager_id={0}&alt_id={1}&alt_name={2}&page_no={3}&page_size={4}`,
    timeout: 300
  }
}

const api = new API(ENTRIES)
export default api
