import React from 'react';
import {Router, Route, IndexRedirect, useRouterHistory} from 'react-router';
import {createHistory} from 'history'
import OMGApp from './OMGApp';
import PersonalInfomation from '../views/PersonalInfomation/PersonalInfomation';
import OMGLogin from './OMGLogin';
import HomeAd from '../views/OperationManagement/HomeAd/HomeAd';
import GameCenter from '../views/OperationManagement/GameCenter/GameCenter';
import Session from '../views/Session';
import {AjaxUtil} from '../views/auth';
import {Modal} from 'antd';
import {History} from '../views/RoutePath/History';

export default class OMGRoutePath extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indexRedirect: null,
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

    changeRoute () {
        var path = ['/homeAd', '/gameCenter']; //保存当前用户可以访问的所有路由地址
        //查询用户登录前的请求路径,进行跳转
        var pathname = Session.getCurrentPath();
        if (pathname == '/' || pathname == '/login'|| pathname == '/Login' || path.indexOf(pathname) == -1) {
            pathname = path[0];
        }
        History.replace(pathname);
    }

    componentWillMount() {
        Session.setCurrentPath(location.pathname);
        var self = this;

        var cbsuccess = function (cont, txtStatus, xhr) {
            if (xhr.status === 200) {
                this.changeRoute();
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


    handleLogin() {
        this.changeRoute();
    }

    render() {
        this.key ++;
        return (
            <Router key={this.key} history={History}>
                <Route path="/">
                    <Route component={OMGApp}>
                        <Route path="PersonalInfomation" component={PersonalInfomation}/>
                        <Route path="homeAd" component={HomeAd} />
                        <Route path="gameCenter" component={GameCenter} />
                    </Route>
                    <Route path="login" component={OMGLogin} handleLogin={this.handleLogin.bind(this)}/>
                </Route>
            </Router>
        );
    }
}