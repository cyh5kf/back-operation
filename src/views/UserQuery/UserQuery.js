import React from 'react'
import { Row, Col, Icon, Table, Input, Button, Tabs, DatePicker, Modal, Spin} from 'antd';
import classNames from 'classnames';
import BasicInformation from '../BasicInformation/BasicInformation'
import RechargeRecords from './RechargeRecords'
import ExchangeRecords from './ExchangeRecords'
import WithdrawalRecords from './WithdrawalRecords'
import IllegalRecords from './IllegalRecords'
import DiamondsGiftedRecords from './DiamondsGiftedRecords'
import StarsReceivedRecords from './StarsReceivedRecords'
import './index.less'
import {AjaxUtil,CheckToken} from '../auth';
const InputGroup = Input.Group;
const TabPane = Tabs.TabPane;

export default class userQuery extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            childUpdateState: false,
            searchInputValue: '',
            focus: false,
            userPixyId: '',
            userInfo: null,
            isUserInfoShow: false,
        };
    }

    errorModal () {
        Modal.error({
            title: 'Warning',
            content: 'User does not exist, please check the ID',
            okText:'OK'
        });
    }


    handleInputChange(e) {
        this.setState({
            searchInputValue: e.target.value,
        });
    }

    handleFocusBlur(e) {
        this.setState({
            focus: e.target === document.activeElement,
        });
    }

    handleSearch() {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.value);
        }
        this.setState({
            userPixyId: this.state.searchInputValue,
            loading: true,
            childUpdateState: !this.state.childUpdateState
        })
        AjaxUtil.queryUserInfo(this.handleQueryUserSuccess.bind(this), this.handleQueryUserError.bind(this), this.state.searchInputValue);
    }

    handleQueryUserSuccess (data, txtStatus, xhr) {
        if (data.uid == '0') {
            this.errorModal();
            this.setState({
                loading: false
            });
            return;
        }
        this.setState({
            userPixyId: data.uid,
            isUserInfoShow: true,
            userInfo: data,
            loading: false
        })
    }

    handleQueryUserError (e) {
        this.setState({
            loading: false
        })
        if (e.status===401) {
            CheckToken.check();
        }
        else {
            this.errorModal();
        }
    }

    tabsChange () {

    }

    searchInputKeyPress (e) {
        //监听enter键
        if (e.keyCode == '13') {
            this.handleSearch();
        }
    }

    render () {
        const btnCls = classNames({
            'ant-search-btn': true,
            'ant-search-btn-noempty': !!this.state.searchInputValue.trim(),
        });

        const searchCls = classNames({
            'ant-search-input': true,
            'ant-search-input-focus': this.state.focus,
        });

        var rowCls = classNames({
            'search': true,
            'search-1': this.state.isUserInfoShow ? true : false
        });

        var userInfoContent = null;
        if (this.state.isUserInfoShow) {
            userInfoContent = [
                <Row type="flex" justify="start">
                    <Col span="24" className="titleHead">
                        Basic Information
                    </Col>
                </Row>,
                <BasicInformation userInfo={this.state.userInfo}></BasicInformation>,
                <Tabs defaultActiveKey="1" onChange={this.tabsChange.bind(this)}>
                    <TabPane tab={<span style={{fontSize: 18}}>Recharge</span>} key="1"><RechargeRecords userPixyId={this.state.userPixyId} updateState={this.state.childUpdateState}></RechargeRecords></TabPane>
                    <TabPane tab={<span style={{fontSize: 18}}>Exchange</span>} key="2"><ExchangeRecords userPixyId={this.state.userPixyId} updateState={this.state.childUpdateState}></ExchangeRecords></TabPane>
                    <TabPane tab={<span style={{fontSize: 18}}>Withdrawal</span>} key="3"><WithdrawalRecords userPixyId={this.state.userPixyId} updateState={this.state.childUpdateState}></WithdrawalRecords></TabPane>
                    <TabPane tab={<span style={{fontSize: 18}}>Illegal</span>} key="4"><IllegalRecords userPixyId={this.state.userPixyId} updateState={this.state.childUpdateState}></IllegalRecords></TabPane>
                    <TabPane tab={<span style={{fontSize: 18}}>Diamonds Gifted</span>} key="5"><DiamondsGiftedRecords userPixyId={this.state.userPixyId} updateState={this.state.childUpdateState}></DiamondsGiftedRecords></TabPane>
                    <TabPane tab={<span style={{fontSize: 18}}>Stars Received</span>} key="6"><StarsReceivedRecords userPixyId={this.state.userPixyId} updateState={this.state.childUpdateState}></StarsReceivedRecords></TabPane>
                </Tabs>
            ]
        }

        return(
            <div className="m-user-query">
                <Spin spining={this.state.loading}>
                    <Row className={rowCls} type="flex" justify="start">
                        <Col className="c1" span="3">
                            PIXY ID:
                        </Col>
                        <Col span="8">
                            <div className="ant-search-input-wrapper">
                                <InputGroup className={searchCls}>
                                    <Input value={this.state.searchInputValue}
                                           onChange={this.handleInputChange.bind(this)}
                                           onKeyUp={this.searchInputKeyPress.bind(this)}
                                    />
                                    <div className="ant-input-group-wrap">
                                        <Button className={btnCls} onClick={this.handleSearch.bind(this)} style={{height: 26}}>
                                            <Icon type="search" />
                                        </Button>
                                    </div>
                                </InputGroup>
                            </div>
                        </Col>
                    </Row>
                    {userInfoContent}
                </Spin>
            </div>
        )
    }
}