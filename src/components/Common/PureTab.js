/**
 * Created by zhengyingya on 16/7/1.
 * 用于echart绘图的一个tab组件,可以在tab右侧设置tool按钮\菜单等
 */

import React from 'react'
import { Row, Col, Icon, Table, Input, Button, Checkbox, DatePicker } from 'antd'
import classNames from 'classnames'
import './common.less'

export const TabTool = React.createClass({
    render: () => {
        return null
    }
})

export class PureTab extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selectIndex: 0,
            firstRender: true,
            renderArray: [0]
        };
    }

    componentDidMount () {
        this.state.firstRender = false;
    }

    tabClick (index, key) {
        this.setState({
            selectIndex: index
        });
        if (this.state.renderArray.indexOf(index) == -1) {
            this.state.renderArray.push(index);
        }
        this.props.onChange(index);

    }

    render () {
        const _props = this.props;
        const _children = _props.children;
        //if (_children.isarray()) {
        //    _children = _
        //}
        var tabHeaderTool = _props.children.map( (child, index) => {
            if (child.type.displayName == 'TabTool') {
                return (
                    <div key={index} style={{marginRight: 10}}>
                        {child.props.children}
                    </div>
                )
            }
        });

        var tabHeaderContent = _props.children.map( (child, index) => {
            if (child.type.displayName != 'TabTool') {
                const key = child.props.key || index;
                const tabClass = classNames({
                    'tab': true,
                    'tab-active': this.state.selectIndex == index ? true : false,
                    'tab-active-first': this.state.selectIndex == index ? (index == 0 ? true : false) : false
                })
                return (
                    <div key={key} className={tabClass} onClick={this.tabClick.bind(this, index, key)}>
                        {child.props.tab}
                    </div>
                )
            }
        });

        var tabBodyContent = _props.children.map( (child, index) => {
            if (this.state.renderArray.indexOf(index) == -1 ) {
                return null;
            }
            const key = child.props.key || index;
            const tabClass = classNames({
                'hidden': this.state.selectIndex == index ? false: true,
            })
            return (
                <div key={key} className={tabClass}>
                    {child.props.children}
                </div>
            )
        });

        return (
            <div className="m-puretab">
                <div className="header">
                    <div style={{flex: '1', display:'flex', }}>
                        {tabHeaderContent}
                    </div>
                    {tabHeaderTool}
                </div>
                <div className="body">
                    {tabBodyContent}
                </div>
            </div>
        )
    }
}

