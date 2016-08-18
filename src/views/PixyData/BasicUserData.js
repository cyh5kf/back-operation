/**
 * Created by zhengyingya on 16/7/1.
 */

import React from 'react';
import EChart from 'rc-echarts';
import BasicChart from './BasicChart';
import UserRetentionChart from './UserRetentionChart';

//const tabMenu = ['register_type', 'gender', 'region', 'version', 'dev_type'];
//const tabText = ['RegisterType', 'Sex', 'Countries', 'Version', 'Device'];

class BasicUserData extends React.Component {
    constructor (props, titleType, indicatorName, tabMenu, tabText, indicatorNameOneDim) {
        super(props);
        this.titleType = titleType;
        this.indicatorName = indicatorName;
        this.tabMenu = tabMenu || ['register_type', 'gender', 'region', 'version', 'dev_type'];
        this.tabText = tabText || ['RegisterType', 'Gender', 'Country', 'Version', 'Device'];
        this.indicatorNameOneDim = indicatorNameOneDim || indicatorName;
    }

    render () {
        return (
            <BasicChart titleType={this.titleType} indicatorName={this.indicatorName} indicatorNameOneDim={this.indicatorNameOneDim} tabMenu={this.tabMenu} tabText={this.tabText}></BasicChart>
        )
    }
}
/**
 * 当前总用户数(按版本分暂时未做)
 */
export class TotalUser extends BasicUserData {
    constructor () {
        const tabMenu = ['register_type', 'gender', 'region', 'dev_type'];
        const tabText = ['RegisterType', 'Gender', 'Country', 'Device'];
        super('', 'Total User', 'totalUserCount', tabMenu, tabText);
    }
}
/**
 * 每日新注册用户数(按版本分暂时未做)
 */
export class NewUser extends BasicUserData {
    constructor () {
        const tabMenu = ['register_type', 'gender', 'region', 'dev_type'];
        const tabText = ['RegisterType', 'Gender', 'Country', 'Device'];
        super('', 'New User', 'newRegisterCount', tabMenu, tabText);
    }
}
/**
 * 每日打开app总用户数
 */
export class ActiveUser extends BasicUserData {
    constructor () {
        const tabMenu = ['version', 'dev_type', 'region'];
        const tabText = ['Version', 'Device', 'Countries'];
        super('', 'Active User', 'uploadUserActiveStatusPerDay', tabMenu, tabText);
    }
}
/**
 * 每日登陆用户数
 */
export class UserLogin extends BasicUserData {
    constructor () {
        const tabMenu = ['version', 'dev_type', 'region'];
        const tabText = ['Version', 'Device', 'Countries'];
        super('', 'User Login', 'userLogUV', tabMenu, tabText);
    }
}
/**
 * 7天留存(key 未给)
 */
export class UserRetention extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <UserRetentionChart></UserRetentionChart>
        )
    }
}