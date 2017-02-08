import React, { PropTypes } from 'react'
import { Menu, Icon } from 'antd'
import {Link} from 'react-router'

const SubMenu = Menu.SubMenu;

import './index.less'
import { testMenu } from './testMenu'

class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openKeys: []
        };
        this.menuData = {
            'userQuery': [<Menu.Item key="/userQuery">
                <Link to="/userQuery">
                    <span style={{fontSize: 13}}><Icon type="search"/><span>User Query</span></span>
                </Link>
            </Menu.Item>],
            'reviewReport': [
                <SubMenu key="/reviewReport"
                         title={<span style={{fontSize: 13}}><Icon type="desktop" /><span>Review Report</span></span>}>
                    <Menu.Item key="/reviewReport/monitor">
                        <Link to="/reviewReport/monitor">
                            Monitor
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/reviewReport/report">
                        <Link to="/reviewReport/report">
                            Report
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/reviewReport/ban">
                        <Link to="/reviewReport/ban">
                            Ban
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/reviewReport/broadcasterSortWeight">
                        <Link to="/reviewReport/broadcasterSortWeight">
                            Broadcaster Sort Weight
                        </Link>
                    </Menu.Item>
                </SubMenu>
            ],
            'withdrawalApplication': [
                <Menu.Item key="/withdrawalApplication">
                    <Link to="/withdrawalApplication">
                        <span style={{fontSize: 13}}><Icon type="appstore"/><span>Withdrawal Application</span></span>
                    </Link>
                </Menu.Item>
            ],
            'operationManagement': [
                <SubMenu key="/operationManagement"
                         title={<span style={{fontSize: 13}}><Icon type="setting" /><span>Operation Management</span></span>}>
                    <Menu.Item key="/operationManagement/bannerManagement">
                        <Link to="/operationManagement/bannerManagement">
                            Banner Management
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="/operationManagement/homeAd">
                        <Link to="/operationManagement/homeAd">
                            SOMA Home Advertisement
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="/operationManagement/gameCenter">
                        <Link to="/operationManagement/gameCenter">
                            SOMA Game Center
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="/operationManagement/Sign">
                        <Link to="/operationManagement/Sign">
                            Sign & Cert Control
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="/operationManagement/liveNotification">
                        <Link to="/operationManagement/liveNotification">
                            Live Notification
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="/operationManagement/recommendBroadcasters">
                        <Link to="/operationManagement/recommendBroadcasters">
                            Recommend Broadcasters
                        </Link>
                    </Menu.Item>

                    <SubMenu key="/operationManagement/joinApplication"
                             title={<span style={{fontSize: 13}}><span> Broadcaster Recruit</span></span>}
                    >

                        <Menu.Item key="/operationManagement/joinApplication">
                            <Link to="/operationManagement/joinApplication">
                                from SOMA
                            </Link>
                        </Menu.Item>

                        <Menu.Item key="/operationManagement/joinApplication/pixy">
                            <Link to="/operationManagement/joinApplication/pixy">
                                from PIXY
                            </Link>
                        </Menu.Item>

                    </SubMenu>

                    <Menu.Item key="/operationManagement/broadcasterSortWeight">
                        <Link to="/operationManagement/broadcasterSortWeight">
                            Broadcaster Sort Weight
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="/operationManagement/talkerSortWeight">
                        <Link to="/operationManagement/talkerSortWeight">
                            Talker Sort Weight
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="/operationManagement/broadcasterLiveLog">
                        <Link to="/operationManagement/broadcasterLiveLog">
                            Broadcaster Live Log
                        </Link>
                    </Menu.Item>

                    <SubMenu key="/operationManagement/talkerApplication"
                             title={<span style={{fontSize: 13}}><span> Talker Application</span></span>}
                    >

                        <Menu.Item key="/operationManagement/talkerApplication">
                            <Link to="/operationManagement/talkerApplication">
                                Application
                            </Link>
                        </Menu.Item>

                        <Menu.Item key="/operationManagement/talkerUpdateApplication">
                            <Link to="/operationManagement/talkerUpdateApplication">
                                Update
                            </Link>
                        </Menu.Item>

                    </SubMenu>

                </SubMenu>],

            'liveInteraction':[
                <Menu.Item key="/liveInteraction">
                    <Link to="/liveInteraction">
                    <span style={{fontSize: 13}}><Icon type="team"/><span>Live Interaction</span></span>
                    </Link>
                </Menu.Item>
            ],

            'statisApplication': testMenu

        }
    }

    componentWillMount () {
        const pathname = location.pathname;
        if (pathname.indexOf('/OperationManagement') != -1 || pathname.indexOf('/operationManagement') != -1) {
            this.state.openKeys = ['/operationManagement'];
        }
        else if (pathname.indexOf('/ReviewReport') != -1 || pathname.indexOf('/reviewReport') != -1) {
            this.state.openKeys = ['/reviewReport'];
        }
        else if (pathname.indexOf('/TotalUserNumber') != -1 || pathname.indexOf('/totalUserNumber') != -1) {
            this.state.openKeys = ['/fixyData', '/totalUserNumber'];
        }
        else if (pathname.indexOf('/BasicUserData') != -1 || pathname.indexOf('/basicUserData') != -1) {
            this.state.openKeys = ['/fixyData', '/basicUserData'];
        }
        else if (pathname.indexOf('/BroadcastsData') != -1 || pathname.indexOf('/broadcastsData') != -1) {
            this.state.openKeys = ['/fixyData', '/broadcastsData'];
        }
        else if (pathname.indexOf('/RevenueData') != -1 || pathname.indexOf('/revenueData') != -1) {
            this.state.openKeys = ['/fixyData', '/revenueData'];
        }
        else if (pathname.indexOf('/FunctionData') != -1 || pathname.indexOf('/functionData') != -1) {
            this.state.openKeys = ['/fixyData', '/functionData'];
        }
        else if (pathname.indexOf('/onlineStatistics') != -1 || pathname.indexOf('/onlineStatistics') != -1) {
            this.state.openKeys = ['/onlineStatistics'];
        }
    }

    onToggle(info) {
        this.setState({
            openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
        });
    }

    onClick(e) {
        const key = e.key;
        if (key.indexOf('/operationManagement') == -1
            && key.indexOf('/fixyData') == -1
            && key.indexOf('/totalUserNumber') == -1
            && key.indexOf('/reviewReport') == -1
            && key.indexOf('/basicUserData') == -1
            && key.indexOf('/broadcastsData') == -1
            && key.indexOf('/revenueData') == -1
            && key.indexOf('/functionData') == -1
            && key.indexOf('/onlineStatistics') == -1) {
            this.setState({
                openKeys: []
            });
        }
    }

    render () {
        var pathname = location.pathname;
        //var s = pathname[1];
        //s = s.toUpperCase();
        //pathname = pathname.replace(pathname[1], s);
        const selectedKeys = [pathname];

        var menuContent = [];
        var sidebarMenu = this.props.sidebarMenu;

        /**
         *  菜单需要排序下,按'userQuery', 'reviewReport', 'withdrawalApplication', 'operationManagement'顺序
         *  默认后台传过来不是这个顺序
         */
        sidebarMenu.sort(function (a, b) {
            var tmpDict = {'userQuery': 1, 'BannerManagement':2,'reviewReport': 3, 'withdrawalApplication': 4, 'operationManagement': 5,'liveInteraction':6, 'statisApplication': 7};
            if (a in tmpDict && b in tmpDict) {
                return tmpDict[a] > tmpDict[b] ? true : false
            }
            return true
        });

        /**
         *  将需要渲染的菜单加入内容数组
         */
        for (let i=0, len=sidebarMenu.length; i<len; i++) {
            if (sidebarMenu[i] in this.menuData) {
                menuContent.push(this.menuData[sidebarMenu[i]]);
            }
        }

        return (
            <div className={this.props.class_name}>
                <Menu onClick={this.onClick.bind(this)}
                      onOpen={this.onToggle.bind(this)}
                      onClose={this.onToggle.bind(this)}
                      mode="inline"
                      style={{height: "100%"}}
                      selectedKeys = {selectedKeys}
                      openKeys = {this.state.openKeys}>
                    {menuContent}
                </Menu>
            </div>
        )
    }
}

export default Sidebar
