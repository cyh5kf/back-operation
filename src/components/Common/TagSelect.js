/**
 * Created by zhengyingya on 16/7/18.
 */

import React from 'react'
import classNames from 'classnames';
import { Select } from 'antd';
import './common.less'

export default class TagSelect extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            focus: false
        };
    }

    render() {
        const { tag, options, value, onSelect, showSearch } = this.props;
        const style = this.props.style || {};
        const _style = {width: style.selectWidth || ''};
        return (
            <div className="f-vcenter m-tag-select">
                <div className="tag">{tag}</div>
                <Select value={value}
                        showSearch={showSearch || false}
                        onSelect={onSelect}
                        className="sel"
                        style={_style}>
                    {options}
                </Select>
            </div>
        );
    }
};

