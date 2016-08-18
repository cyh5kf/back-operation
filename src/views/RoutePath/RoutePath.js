import React from 'react';
import {Router, Route, IndexRedirect, useRouterHistory} from 'react-router';
import {createHistory} from 'history'
import App from '../App/App';
import PersonalInfomation from '../PersonalInfomation/PersonalInfomation';
import Login from '../Login/Login';
import Register from '../Register/Register';
import userQuery from '../UserQuery/UserQuery';
import reviewReport from '../ReviewReport/Report/ReviewReport';
import withdrawalApplication from '../WithdrawalApplication/WithdrawalApplication';
import HotRank from '../OperationManagement/HotRank/HotRank';
import PeakHours from '../OperationManagement/PeakHours/PeakHours';
import PurchaseDiamonds from '../OperationManagement/PurchaseDiamonds/PurchaseDiamonds';
import ExchangeDiamonds from '../OperationManagement/ExchangeDiamonds/ExchangeDiamonds';
import WithdrawalLimit from '../OperationManagement/WithdrawalLimit/WithdrawalLimit';
import TopicControl from '../OperationManagement/TopicControl/TopicControl';
import BannerManagement from '../BannerManagement/BannerManagement';
import ExpControl from '../OperationManagement/ExpControl/ExpControl';
import LiveNotification from '../OperationManagement/LiveNotification/LiveNotification';
import LiveInteraction from '../LiveInteraction/LiveInteraction';
import Sign from '../OperationManagement/Sign/Sign';
import Recommend from '../OperationManagement/RecommendBroadcasters/Recommend';
import JoinApplication from '../OperationManagement/JoinApplication/JoinApplication';
import JoinApplicationPixy from '../OperationManagement/JoinApplication/JoinApplicationPixy';
import BroadcasterSortWeight from '../OperationManagement/BroadcasterSortWeight/BroadcasterSortWeight';
import LiveLog from '../OperationManagement/BroadcasterLiveLog/LiveLog';
import Monitor from '../ReviewReport/Monitor/Monitor';
import Report from '../ReviewReport/Report/ReviewReport';
import Ban from '../ReviewReport/Ban/Ban';
import Session from 'views/Session';
import {AjaxUtil} from '../auth';
import {Modal} from 'antd';
import {History} from './History';
import TotalUserNumber from '../PixyData/TotalUserNumber';
import { TotalUser, NewUser, ActiveUser, UserLogin, UserRetention } from '../PixyData/BasicUserData';
import { Viewers, ViewDuration, Broadcasters, LiveCount, LiveDuration, Messages } from '../PixyData/BroadcastsData';
import { GiftCount, CashTopups, StarsTopups, Redeems } from '../PixyData/RevenueData';
import { NewRegisterUser, ChannelMessage, OnlineChannelCount, OnlineChannelUserCount } from '../PixyData/OnlineStatistics';
import { EventCode } from '../PixyData/FunctionData';
//const history = useRouterHistory(createHistory)({ basename: '' })
// const validate = function (next, replace, callback) {
//     const isLogined= Session.getLogined();
//     if (!isLogined && next.location.pathname != '/login') {
//         replace('/login')
//     }
//     callback()
// }
export default class RoutePath extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indexTo: '/',
            indexRedirect: null,
            routePath: [],
            sidebarMenu: []
        };
        this.key = 0;
    }

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    error(text) {
        let self = this;
        Modal.error({
            title: 'warning',
            content: text,
            okText:'OK'
        });
    }

    tokenError(e) {
        var self = this;
        Modal.error({
            title: 'warning',
            content: 'Page login information has expired, please re login',
            okText: 'OK',
            onOk() {
                History.replace('/login')
                Session.setLogined(false);
            }
        });
    }

    changeRoute (route_arr) {
        route_arr.sort(function (a, b) {
            var tmpDict = {'userQuery': 1, 'BannerManagement':2,'reviewReport': 3, 'withdrawalApplication': 4, 'operationManagement': 5,'liveInteraction':6};
            if (a in tmpDict && b in tmpDict) {
                return tmpDict[a] > tmpDict[b] ? true : false
            }
            return false
        });
        var route_obj = {'userQuery': userQuery,'reviewReport':reviewReport,'withdrawalApplication':withdrawalApplication};
        var route_configure = [];
        var path = [];          //保存当前用户可以访问的所有路由地址
        for(var i=0;i<route_arr.length; i++){
            if(route_arr[i]=="operationManagement"){
                route_configure.push(<Route key={i} path="operationManagement/hotRank" component={HotRank} />);
                // route_configure.push(<Route key={i} path="operationManagement/peakHours" component={PeakHours} />);
                //route_configure.push(<Route key={i} path="operationManagement/purchaseDiamonds" component={PurchaseDiamonds} />);
                route_configure.push(<Route key={i} path="operationManagement/exchangeDiamonds" component={ExchangeDiamonds} />);
                // route_configure.push(<Route key={i} path="operationManagement/withdrawalLimit" component={WithdrawalLimit} />);
                // route_configure.push(<Route key={i} path="operationManagement/expControl" component={ExpControl} />);
                route_configure.push(<Route key={i} path="operationManagement/bannerManagement" component={BannerManagement} />);
                route_configure.push(<Route key={i} path="operationManagement/Sign" component={Sign} />);
                route_configure.push(<Route key={i} path="operationManagement/liveNotification" component={LiveNotification} />);
                route_configure.push(<Route key={i} path="operationManagement/recommendBroadcasters" component={Recommend} />);
                route_configure.push(<Route key={i} path="operationManagement/joinApplication" component={JoinApplication} />);
                route_configure.push(<Route key={i} path="operationManagement/joinApplication/pixy" component={JoinApplicationPixy} />);
                route_configure.push(<Route key={i} path="operationManagement/broadcasterSortWeight" component={BroadcasterSortWeight} />);
                route_configure.push(<Route key={i} path="operationManagement/broadcasterLiveLog" component={LiveLog} />);
                //route_configure.push(<Route key={i} path="operationManagement/TopicControl" component={TopicControl} />);
                path.push('/operationManagement');
                //path.push('/operationManagement/hotRank');
                // path.push('/operationManagement/peakHours');
                //path.push('/operationManagement/purchaseDiamonds');
                path.push('/operationManagement/exchangeDiamonds');
                // path.push('/operationManagement/withdrawalLimit');
                // path.push('/operationManagement/expControl');
                path.push('/operationManagement/bannerManagement');
                path.push('/operationManagement/Sign');
                path.push('/operationManagement/liveNotification');
                path.push('/operationManagement/recommendBroadcasters');
                path.push('/operationManagement/joinApplication');
                path.push('/operationManagement/joinApplication/pixy');
                path.push('/operationManagement/broadcasterSortWeight');
                path.push('/operationManagement/broadcasterLiveLog');
                //path.push('/operationManagement/TopicControl');
            } else if (route_arr[i]=="reviewReport"){
                route_configure.push(<Route key={i} path="reviewReport/monitor" component={Monitor} />);
                route_configure.push(<Route key={i} path="reviewReport/report" component={Report} />);
                route_configure.push(<Route key={i} path="reviewReport/ban" component={Ban} />);
                path.push('/reviewReport');
                path.push('/reviewReport/monitor');
                path.push('/reviewReport/report');
                path.push('/reviewReport/ban');
            } else if (route_arr[i]=="userQuery") {
                route_configure.push(<Route key={i} path={route_arr[i]} component={route_obj[route_arr[i]]} />);
                path.push('/' + route_arr[i]);
            } else if (route_arr[i]==="liveInteraction") {
                route_configure.push(<Route key={i} path={route_arr[i]} component={LiveInteraction} />);
                path.push('/' + route_arr[i]);
            } else if (route_arr[i]==="withdrawalApplication") {
                route_configure.push(<Route key={i} path={route_arr[i]} component={withdrawalApplication} />);
                path.push('/' + route_arr[i]);
            } else if (route_arr[i]==="statisApplication") {

                route_configure.push(<Route path="basicUserData/totalUser" component={TotalUser}/>);
                route_configure.push(<Route path="basicUserData/newUser" component={NewUser}/>);
                route_configure.push(<Route path="basicUserData/activeUser" component={ActiveUser}/>);
                route_configure.push(<Route path="basicUserData/userLogin" component={UserLogin}/>);
                route_configure.push(<Route path="basicUserData/userRetention" component={UserRetention}/>);

                route_configure.push(<Route path="broadcastsData/viewers" component={Viewers}/>);
                route_configure.push(<Route path="broadcastsData/viewDuration" component={ViewDuration}/>);
                route_configure.push(<Route path="broadcastsData/broadcasters" component={Broadcasters}/>);
                route_configure.push(<Route path="broadcastsData/liveCount" component={LiveCount}/>);
                route_configure.push(<Route path="broadcastsData/liveDuration" component={LiveDuration}/>);
                route_configure.push(<Route path="broadcastsData/messages" component={Messages}/>);

                route_configure.push(<Route path="revenueData/giftCount" component={GiftCount}/>);
                route_configure.push(<Route path="revenueData/cashRecharge" component={CashTopups}/>);
                route_configure.push(<Route path="revenueData/starsRecharge" component={StarsTopups}/>);
                route_configure.push(<Route path="revenueData/redeems" component={Redeems}/>);

                route_configure.push(<Route path="functionData/eventCode" component={EventCode}/>);
                route_configure.push(<Route path="onlineStatistics/totalUser" component={TotalUserNumber}/>);
                route_configure.push(<Route path="onlineStatistics/newRegisterUser" component={NewRegisterUser}/>);
                route_configure.push(<Route path="onlineStatistics/channelMessage" component={ChannelMessage}/>);
                route_configure.push(<Route path="onlineStatistics/onlineChannelCount" component={OnlineChannelCount}/>);
                route_configure.push(<Route path="onlineStatistics/onlineChannelUserCount" component={OnlineChannelUserCount}/>);

                path.push('/basicUserData/totalUser');
                path.push('/basicUserData/newUser');
                path.push('/basicUserData/activeUser');
                path.push('/basicUserData/userLogin');
                path.push('/basicUserData/userRetention');
                path.push('/broadcastsData/viewers');
                path.push('/broadcastsData/viewDuration');
                path.push('/broadcastsData/broadcasters');
                path.push('/broadcastsData/liveCount');
                path.push('/broadcastsData/messages');
                path.push('/revenueData/giftCount');
                path.push('/revenueData/cashTopups');
                path.push('/revenueData/starsTopups');
                path.push('/revenueData/redeems');
                path.push('/functionData/eventCode');
                path.push('/onlineStatistics/totalUser');
                path.push('/onlineStatistics/newRegisterUser');
                path.push('/onlineStatistics/channelMessage');
                path.push('/onlineStatistics/onlineChannelCount');
                path.push('/onlineStatistics/onlineChannelUserCount');
            }
        }



        this.setState({
            routePath: route_configure,
            sidebarMenu: route_arr
        });

        //查询用户登录前的请求路径,进行跳转
        var pathname = Session.getCurrentPath();
        if (pathname == '/' || pathname == '/login'|| pathname == '/Login' || path.indexOf(pathname) == -1) {
            pathname = '/' + route_arr[0];
        }

        if (pathname == '/operationManagement') {
            pathname = '/operationManagement/bannerManagement';
        }
        else if (pathname == '/reviewReport') {
            pathname = '/reviewReport/monitor';
        }
        else if (pathname == '/statisApplication') {
            pathname = '/basicUserData/totalUser';
        }
        else if (pathname == '/onlineStatistics') {
            pathname = '/onlineStatistics/newRegisterUser';
        }

        History.replace(pathname)
        //this.error('Unauthorized!');
    }

    componentWillMount() {
        Session.setCurrentPath(location.pathname);
        var self = this;
        var route_arr = '';

        var cbsuccess = function (cont, txtStatus, xhr) {
            if (xhr.status === 200) {
                route_arr = cont.route_path;
                this.changeRoute(route_arr);

            } else if(xhr.status === 403){
                self.error('用户所属角色权限不够，无法执行该方法');
            } else {
                self.error("error modify password");
            }
        }

        var cberror = function () {
            self.tokenError();
        }

        if (location.pathname != '/login' && location.pathname != '/Login') {
            AjaxUtil.getrolepermission(cbsuccess.bind(this),cberror.bind(this));
        }

    }

    componentDidUpdate () {

    }


    handleLogin(route_path) {
        this.changeRoute(route_path);
    }

    render() {
        this.key ++;
        return (
            <Router key={this.key} history={History}>
                <Route path="/">
                    <Route component={App} sidebarMenu={this.state.sidebarMenu}>
                        <Route path="PersonalInfomation" component={PersonalInfomation}/>
                        {this.state.routePath}
                    </Route>
                    <Route path="login" component={Login} handleLogin={this.handleLogin.bind(this)}/>
                </Route>
            </Router>
        );
    }
}