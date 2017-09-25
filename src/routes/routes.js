import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Login from 'src/components/Dashboard/Views/Login.vue'
import Accounts from 'src/components/Dashboard/Views/Accounts.vue'
import Reply from 'src/components/Dashboard/Views/Reply.vue'
import Account from 'src/components/Dashboard/Views/Account.vue'
import BannedUser from 'src/components/Dashboard/Views/BannedUser.vue'
import Messages from 'src/components/Dashboard/Views/Messages.vue'
import DeletedReply from 'src/components/Dashboard/Views/DeletedReply.vue'

const routes = [
  {
    path: '/community/admin/',
    component: DashboardLayout,
    redirect: '/messages',
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login
      },
      {
        path: 'accounts',
        name: 'accounts',
        component: Accounts
      },
      {
        path: 'reply/:category_id?',
        name: 'reply',
        component: Reply
      },
      {
        path: 'account/:user_id?',
        name: 'account',
        component: Account
      },
      {
        path: 'banned-users',
        name: 'banned-users',
        component: BannedUser
      },
      {
        path: 'messages',
        name: 'messages',
        component: Messages
      },
      {
        path: 'deleted-reply',
        name: 'deleted-reply',
        component: DeletedReply
      }
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
