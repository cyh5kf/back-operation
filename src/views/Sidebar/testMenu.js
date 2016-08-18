/**
 * Created by zhengyingya on 16/7/1.
 *
 * 开始时用的menu,在sidebar中引入,发布时可以在sidebar中注释掉
 */
import React from 'react'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router'
const SubMenu = Menu.SubMenu;

export const testMenu = [
    <SubMenu key="/fixyData"
             title={<span style={{fontSize: 13}}><Icon type="bar-chart"/><span>Offline Statistics</span></span>}>
        <SubMenu key="/basicUserData"
                 title={<span style={{fontSize: 13}}><span>Basic User Data</span></span>}>
            <Menu.Item key="/basicUserData/totalUser">
                <Link to="/basicUserData/totalUser">
                    Total User
                </Link>
            </Menu.Item>

            <Menu.Item key="/basicUserData/newUser">
                <Link to="/basicUserData/newUser">
                    New User
                </Link>
            </Menu.Item>
            <Menu.Item key="/basicUserData/activeUser">
                <Link to="/basicUserData/activeUser">
                    Active User
                </Link>
            </Menu.Item>
            <Menu.Item key="/basicUserData/userLogin">
                <Link to="/basicUserData/userLogin">
                    User Login
                </Link>
            </Menu.Item>
            <Menu.Item key="/basicUserData/userRetention">
                <Link to="/basicUserData/userRetention">
                    User Retention
                </Link>
            </Menu.Item>
        </SubMenu>
        <SubMenu key="/broadcastsData"
                 title={<span style={{fontSize: 13}}><span>Broadcasts Data</span></span>}>
            <Menu.Item key="/broadcastsData/viewers">
                <Link to="/broadcastsData/viewers">
                    Viewers
                </Link>
            </Menu.Item>
            <Menu.Item key="/broadcastsData/viewDuration">
                <Link to="/broadcastsData/viewDuration">
                    View Duration
                </Link>
            </Menu.Item>
            <Menu.Item key="/broadcastsData/broadcasters">
                <Link to="/broadcastsData/broadcasters">
                    Broadcasters
                </Link>
            </Menu.Item>
            <Menu.Item key="/broadcastsData/liveDuration">
                <Link to="/broadcastsData/liveDuration">
                    Live Duration
                </Link>
            </Menu.Item>
            <Menu.Item key="/broadcastsData/liveCount">
                <Link to="/broadcastsData/liveCount">
                    Live Count
                </Link>
            </Menu.Item>
            <Menu.Item key="/broadcastsData/messages">
                <Link to="/broadcastsData/messages">
                    Messages
                </Link>
            </Menu.Item>
        </SubMenu>
        <SubMenu key="/revenueData"
                 title={<span style={{fontSize: 13}}><span>Revenue Data</span></span>}>
            <Menu.Item key="/revenueData/giftCount">
                <Link to="/revenueData/giftCount">
                    Gift Count
                </Link>
            </Menu.Item>

            <Menu.Item key="/revenueData/cashRecharge">
                <Link to="/revenueData/cashRecharge">
                    Cash Recharge
                </Link>
            </Menu.Item>

            <Menu.Item key="/revenueData/starsRecharge">
                <Link to="/revenueData/starsRecharge">
                    Stars Recharge
                </Link>
            </Menu.Item>

            <Menu.Item key="/revenueData/redeems">
                <Link to="/revenueData/redeems">
                    Redeems
                </Link>
            </Menu.Item>
        </SubMenu>
        <SubMenu key="/functionData"
                 title={<span style={{fontSize: 13}}><span>Function Data</span></span>}>
            <Menu.Item key="/functionData/eventCode">
                <Link to="/functionData/eventCode">
                    Event Code
                </Link>
            </Menu.Item>
        </SubMenu>
    </SubMenu>,
    <SubMenu key="/onlineStatistics"
             title={<span style={{fontSize: 13}}><Icon type="line-chart"/><span>Online Statistics</span></span>}>
        <Menu.Item key="/onlineStatistics/totalUser">
            <Link to="/onlineStatistics/totalUser">
                <span style={{fontSize: 13}}><span>Total User</span></span>
            </Link>
        </Menu.Item>
        <Menu.Item key="/onlineStatistics/newRegisterUser">
            <Link to="/onlineStatistics/newRegisterUser">
                New Register User
            </Link>
        </Menu.Item>

        <Menu.Item key="/onlineStatistics/channelMessage">
            <Link to="/onlineStatistics/channelMessage">
                Channel Message
            </Link>
        </Menu.Item>
        <Menu.Item key="/onlineStatistics/onlineChannelCount">
            <Link to="/onlineStatistics/onlineChannelCount">
                Online Channel Count
            </Link>
        </Menu.Item>
        <Menu.Item key="/onlineStatistics/onlineChannelUserCount">
            <Link to="/onlineStatistics/onlineChannelUserCount">
                Online Channel User Count
            </Link>
        </Menu.Item>
    </SubMenu>
];

//<Menu.Item key="/broadcastsData/viewDuration">
//    <Link to="/broadcastsData/viewDuration">
//        View Duration
//    </Link>
//</Menu.Item>
//<Menu.Item key="/broadcastsData/viewDurationDistribution">
//    <Link to="/broadcastsData/viewDurationDistribution">
//    View Duration Distribution
//</Link>
//</Menu.Item>


//<Menu.Item key="/broadcastsData/liveDuration">
//    <Link to="/broadcastsData/liveDuration">
//        Live Duration
//    </Link>
//</Menu.Item>
//<Menu.Item key="/broadcastsData/messages">
//    <Link to="/broadcastsData/messages">
//    Messages
//    </Link>
//</Menu.Item>
