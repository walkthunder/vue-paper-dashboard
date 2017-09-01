import { Router } from 'express'

const router = Router()

router.get('/api/v4/alternative_account/account_list', (req, res) => {
  const { manager_id, alt_id, alt_name, page_no, page_size } = req.query
  const mockData = {
    errorno: 0,
    errormsg: '',
    data: {
      page_no: 1,
      page_size: 20,
      total_alt: 4,
      alt_accounts: [{
        alt_id: 2211,
        alt_name: '我是马甲1',
        official: true,
        create_time: 15029382984,
        owners: [ '晓敏' ]
      }, {
        alt_id: 2212,
        alt_name: '我是马甲2',
        official: true,
        create_time: 15029382984,
        owners: [ '晓敏', '黄小白' ]
      }, {
        alt_id: 2213,
        alt_name: '我是马甲3',
        official: true,
        create_time: 15029382984,
        owners: [ '晓敏', '黄小白' ]
      }, {
        alt_id: 2214,
        alt_name: '我是马甲4',
        official: true,
        create_time: 15029382984,
        owners: [ '晓敏', '黄小白' ]
      }
      ]
    }
  }
  res.json(mockData)
})

export default router
