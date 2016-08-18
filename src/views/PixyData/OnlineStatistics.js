/**
 * Created by zhengyingya on 16/7/18.
 */

import React from 'react';
import EChart from 'rc-echarts';
import BasicChart from './BasicChart';
import OnlineStatisticsChart from './OnlineStatisticsChart';

//const tabMenu = ['register_type', 'gender', 'region', 'version', 'dev_type'];
//const tabText = ['RegisterType', 'Sex', 'Countries', 'Version', 'Device'];

class OnlineStatistics extends React.Component {
    constructor (props, titleType, indicatorName) {
        super(props);
        this.titleType = titleType;
        this.indicatorName = indicatorName;
    }

    render () {
        return (
            <OnlineStatisticsChart titleType={this.titleType} indicatorName={this.indicatorName}></OnlineStatisticsChart>
        )
    }
}
/**
 * 新注册用户
 */
export class NewRegisterUser extends OnlineStatistics {
    constructor () {
        super('', 'New Register User', 'newRegisterUser');
    }
}
/**
 * 频道消息
 */
export class ChannelMessage extends OnlineStatistics {
    constructor () {
        super('', 'Channel Message', 'channelMessage');
    }
}
/**
 * 在线频道数
 */
export class OnlineChannelCount extends OnlineStatistics {
    constructor () {
        super('', 'Online Channel Count', 'onlineChannelCount');
    }
}
/**
 * 在线频道用户数
 */
export class OnlineChannelUserCount extends OnlineStatistics {
    constructor () {
        super('', 'Online Channel User Count', 'onlineChannelUserCount');
    }
}