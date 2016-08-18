import React from 'react';
import { Tabs, Icon } from 'antd';
import classNames from 'classnames';
import View from './View';
import './index.less';
const TabPane = Tabs.TabPane;

export default class PurchaseDiamonds extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEdit: false,
            newRow: [],
        };
    }

    render () {
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab={<span style={{fontSize: 18}}><Icon type="apple" />iOS</span>} key="1">
                    <View challenge={0}></View>
                </TabPane>
                <TabPane tab={<span style={{fontSize: 18}}><Icon type="android" />Android</span>} key="2">
                    <View challenge={1}></View>
                </TabPane>
            </Tabs>
        )
    }
}