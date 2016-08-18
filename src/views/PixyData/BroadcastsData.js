/**
 * Created by zhengyingya on 16/7/5.
 */

import React from 'react';
import EChart from 'rc-echarts';
import BasicChart from './BasicChart';

const tabMenu = ['region', 'dev_type', 'version'];
const tabText = ['Countries', 'Device', 'Version'];

class BroadcastsData extends React.Component {
    constructor (props, titleType, indicatorName, tabMenu, tabText, indicatorNameOneDim) {
        super(props);
        this.titleType = titleType;
        this.indicatorName = indicatorName;
        this.tabMenu = tabMenu || ['region', 'dev_type'];
        this.tabText = tabText || ['Countries', 'Device'];
        this.indicatorNameOneDim = indicatorNameOneDim || indicatorName;
    }

    render () {
        return (
            <BasicChart titleType={this.titleType} indicatorName={this.indicatorName} indicatorNameOneDim={this.indicatorNameOneDim} tabMenu={this.tabMenu} tabText={this.tabText}></BasicChart>
        )
    }
}
/**
 * 观看直播用户数
 */
export class Viewers extends BroadcastsData {
    constructor () {
        super('', 'Viewers', 'joinChannelUserCountPerDay');
    }
}
/**
 * 观看直播总时长(key 未给)
 */
export class ViewDuration extends BroadcastsData {
    constructor () {
        const tabMenu = ['region', 'version', 'dev_type'];
        const tabText = ['Country', 'Version', 'Device Type'];
        super('', 'View Duration', 'channelViewDurationPerDay', tabMenu, tabText);
    }
}
/**
 * 观看直播总时长分布(key 未给)
 */
export class ViewDurationDistribution extends BroadcastsData {
    constructor () {
        super('', 'View Duration', '');
    }
}
/**
 * 直播用户数
 */
export class Broadcasters extends BroadcastsData {
    constructor () {
        super('', 'Broadcasters', 'createChannelUserCountPerDay');
    }
}
/**
 * 直播总数
 */
export class LiveCount extends BroadcastsData {
    constructor () {
        super('', 'Live Count', 'createChannelCountPerDay');
    }
}
/**
 * 直播总时长
 */
export class LiveDuration extends BroadcastsData {
    constructor () {
        const tabMenu = ['region', 'version', 'dev_type'];
        const tabText = ['Country', 'Version', 'Device Type'];
        super('', 'Live Duration', 'channelLiveDurationPerDay', tabMenu, tabText);
    }
}
/**
 * 直播消息总数
 */
export class Messages extends BroadcastsData {
    constructor () {
        const tabMenu = ['type', 'region', 'dev_type'];
        const tabText = ['Message Type', 'Country', 'Device Type'];
        super('', 'Messages', 'sendMessageCountPerDay', tabMenu, tabText);
    }
}