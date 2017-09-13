import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Overview from 'src/components/Dashboard/Views/Overview.vue'
import Notifications from 'src/components/Dashboard/Views/Notifications.vue'
import Icons from 'src/components/Dashboard/Views/Icons.vue'
import Typography from 'src/components/Dashboard/Views/Typography.vue'
import TableList from 'src/components/Dashboard/Views/TableList.vue'
import Login from 'src/components/Dashboard/Views/Login.vue'
import Accounts from 'src/components/Dashboard/Views/Accounts.vue'
import Reply from 'src/components/Dashboard/Views/Reply.vue'
import Account from 'src/components/Dashboard/Views/Account.vue'
import BannedUser from 'src/components/Dashboard/Views/BannedUser.vue'
import Messages from 'src/components/Dashboard/Views/Messages.vue'
import DeletedReply from 'src/components/Dashboard/Views/DeletedReply.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/overview',
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: Overview
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: Notifications
      },
      {
        path: 'icons',
        name: 'icons',
        component: Icons
      },
      {
        path: 'typography',
        name: 'typography',
        component: Typography
      },
      {
        path: 'table-list',
        name: 'table-list',
        component: TableList
      },
      {
        path: 'login',
        name: 'login',
        component: Login
      },
      {
        path: 'accounts',
        name: '马甲管理',
        component: Accounts
      },
      {
        path: 'reply/:category_id?',
        name: '评论管理',
        component: Reply
      },
      {
        path: 'account/:user_id?',
        name: '用户管理',
        component: Account
      },
      {
        path: 'banned-users',
        name: '封禁用户',
        component: BannedUser
      },
      {
        path: 'messages',
        name: '消息',
        component: Messages
      },
      {
        path: 'deleted-reply',
        name: '删除评论',
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
