/**
 * Created by zhengyingya on 16/7/5.
 */

import React from 'react';
import EChart from 'rc-echarts';
import BasicChart from './BasicChart';

class RevenueData extends React.Component {
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
 * 每日礼物总数(按设备类型分未做)
 */
export class GiftCount extends RevenueData {
    constructor () {
        const tabMenu = ['type'];
        const tabText = ['Gift Type'];
        super('', 'All Gifts', 'giftCount', tabMenu, tabText);
    }
}
/**
 * 每日现金充值总数
 */
export class CashTopups extends RevenueData {
    constructor () {
        const tabMenu = ['product_id', 'dev_type'];
        const tabText = ['Product Type', 'Device'];
        super('', 'Cash Recharge', 'cashChargeAmount', tabMenu, tabText, 'cashChargeCount');
    }
}
/**
 * 每日star充值总数
 */
export class StarsTopups extends RevenueData {
    constructor () {
        const tabMenu = ['product_id', 'dev_type'];
        const tabText = ['Product Type', 'Device'];
        super('', 'Stars Recharge', 'starChargeAmount', tabMenu, tabText, 'starChargeCount');
    }
}
/**
 * 每日申请提现总数
 */
export class Redeems extends RevenueData {
    constructor () {
        super('', 'Redeems', 'withdrawAmout');
    }
}