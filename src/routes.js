/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from 'views/Dashboard.js';
import Icons from 'views/Icons.js';
import Map from 'views/Map.js';
import Notifications from 'views/Notifications.js';
// import Rtl from 'views/Rtl2.js';
import TableList from 'views/TableList.js';
import Typography from 'views/Typography.js';
import UserProfile from 'views/UserProfile.js';
import Investments from 'views/InvestmentsList.js';
import InvestmentDetails from 'views/InvestmentDetails';
import Login from 'views/Login?#';

var routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    rtlName: 'لوحة القيادة',
    icon: 'tim-icons icon-chart-pie-36',
    component: Dashboard,
    layout: '/app',
  },
  {
    path: '/investments',
    name: 'Investimentos',
    rtlName: 'لوحة القيادة',
    icon: 'tim-icons icon-wallet-43',
    component: Investments,
    layout: '/app',
  },
  {
    path: '/investment/:id',
    name: 'Novo Investimento',
    rtlName: 'لوحة القيادة',
    icon: 'tim-icons icon-wallet-43',
    component: InvestmentDetails,
    layout: '/app',
  },
  {
    path: '/icons',
    name: 'Icons',
    rtlName: 'الرموز',
    icon: 'tim-icons icon-atom',
    component: Icons,
    layout: '/app',
  },
  {
    path: '/map',
    name: 'Map',
    rtlName: 'خرائط',
    icon: 'tim-icons icon-pin',
    component: Map,
    layout: '/app',
  },
  {
    path: '/notifications',
    name: 'Notifications',
    rtlName: 'إخطارات',
    icon: 'tim-icons icon-bell-55',
    component: Notifications,
    layout: '/app',
  },
  {
    path: '/user-profile',
    name: 'User Profile',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: 'tim-icons icon-single-02',
    component: UserProfile,
    layout: '/app',
  },
  {
    path: '/tables',
    name: 'Table List',
    rtlName: 'قائمة الجدول',
    icon: 'tim-icons icon-puzzle-10',
    component: TableList,
    layout: '/app',
  },
  {
    path: '/typography',
    name: 'Typography',
    rtlName: 'طباعة',
    icon: 'tim-icons icon-align-center',
    component: Typography,
    layout: '/app',
  },
  {
    path: '/login',
    name: 'Login',
    rtlName: 'لوحة القيادة',
    icon: 'tim-icons icon-chart-pie-36',
    component: Login,
    layout: '/login',
  },
  // {
  //   path: '/rtl-support',
  //   name: 'RTL Support',
  //   rtlName: 'ار تي ال',
  //   icon: 'tim-icons icon-world',
  //   component: Rtl,
  //   layout: '/rtl',
  // },
];
export default routes;
