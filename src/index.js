import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRedirect, useRouterHistory} from 'react-router';
import {createHistory} from 'history'

import RoutePath from './views/RoutePath/RoutePath';
import App from './views/App/App';
import PersonalInfomation from './views/PersonalInfomation/PersonalInfomation';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import userQuery from './views/UserQuery/UserQuery';
import Report from './views/ReviewReport/Report/ReviewReport';
import Monitor from './views/ReviewReport/Monitor/Monitor';
import withdrawalApplication from './views/WithdrawalApplication/WithdrawalApplication';
import HotRank from './views/OperationManagement/HotRank/HotRank';
import PeakHours from './views/OperationManagement/PeakHours/PeakHours';
import PurchaseDiamonds from './views/OperationManagement/PurchaseDiamonds/PurchaseDiamonds';
import ExchangeDiamonds from './views/OperationManagement/ExchangeDiamonds/ExchangeDiamonds';
import WithdrawalLimit from './views/OperationManagement/WithdrawalLimit/WithdrawalLimit';
import ExpControl from './views/OperationManagement/ExpControl/ExpControl';
import BannerManagement from './views/OperationManagement/BannerManagement/BannerManagement';

import Session from 'views/Session'
import { Modal, Button } from 'antd'
import {AjaxUtil} from 'views/auth'

const history = useRouterHistory(createHistory)({ basename: '' })

const validate = function (next, replace, callback) {
    const isLogined= Session.getLogined();
    if (!isLogined && next.location.pathname != '/login') {
        replace('/login')
    }
    callback()
}

ReactDOM.render(
     //<Router history={history}>
     //   <Route path="/" >
     //       <IndexRedirect to="PersonalInfomation"/>
     //       <Route component={App} sidebarMenu={['userQuery','BannerManagement', 'reviewReport', 'withdrawalApplication']}>
     //           <Route path="PersonalInfomation" component={PersonalInfomation}/>
     //           <Route path="UserQuery" component={userQuery}/>
     //           <Route path="ReviewReport" >
     //               <Route path="Monitor" component={Monitor}></Route>
     //               <Route path="Report" component={Report}></Route>
     //           </Route>
     //           <Route path="OperationManagement">
     //               <Route path="HotRank" component={HotRank}></Route>
     //               <Route path="PeakHours" component={PeakHours}></Route>
     //               <Route path="PurchaseDiamonds" component={PurchaseDiamonds}></Route>
     //               <Route path="WithdrawalLimit" component={WithdrawalLimit}></Route>
     //               <Route path="BannerManagement" component={BannerManagement}></Route>
     //           </Route>
     //       </Route>
     //       <Route path="login" component={Login}/>
     //   </Route>
     //</Router>,
    <RoutePath></RoutePath>,
    document.getElementById('root')
);