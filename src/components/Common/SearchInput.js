/**
 * Created by luanhaipeng on 16/6/21.
 */

import React from 'react'
import classNames from 'classnames';
import { Row, Col, Icon, Table, Pagination, Modal, message,Input,Button} from 'antd';
var InputGroup = Input.Group;
import './common.less'

export default class SearchInput extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            focus: false
        };
    }

    handleInputChange(e) {
        this.setState({
            value: e.target.value,
        });
    }

    handleSearch() {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.value);
        }
    }


    searchInputKeyPress (e) {
        //监听enter键
        if (e.keyCode == '13') {
            this.handleSearch();
        }
    }

    renderPreTitle(preTitle){
        if(preTitle && preTitle.trim().length > 0 ){
            return (
                <div className="searchinput-preTitle">
                    {preTitle}
                </div>);
        }
        return null;
    }

    render() {
        const { style, size, preTitle,...restProps } = this.props;
        const btnCls = classNames({
            'ant-search-btn': true,
            'ant-search-btn-noempty': !!this.state.value.trim(),
        });
        const searchCls = classNames({
            'ant-search-input': true,
            'ant-search-input-focus': this.state.focus
        });

        const wrapperCls = classNames({
            'ant-search-input-wrapper':true,
            'searchinput-wrapper':true
        });

        var preTitleRendered = this.renderPreTitle(preTitle);
        return (
            <div>
                {preTitleRendered}
                <div className={wrapperCls} style={style}>
                    <InputGroup className={searchCls}>
                        <Input placeholder={this.props.placeholder||""} value={this.state.value} onChange={this.handleInputChange.bind(this)} onKeyUp={this.searchInputKeyPress.bind(this)} />
                        <div className="ant-input-group-wrap">
                            <Button icon="search" className={btnCls} size={size} onClick={this.handleSearch.bind(this)} >
                                <Icon type="search" />
                            </Button>
                        </div>
                    </InputGroup>
                </div>
                <div style={{clear:'both'}}></div>
            </div>
        );
    }
};

