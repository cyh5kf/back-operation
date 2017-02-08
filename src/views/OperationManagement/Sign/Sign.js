import React from 'react'
import { Row, Col, Icon, Table, Input, Button, Tabs, DatePicker, Modal, Spin,message} from 'antd';
import classNames from 'classnames';
import SignInformation from './SignInformation/SignInformation';
import SignedList from './SignedList';
import './index.less';
import {AjaxUtil,CheckToken} from '../../auth';
const InputGroup = Input.Group;
const TabPane = Tabs.TabPane;
import {i18n} from '../../../utils/i18n';

export default class Sign extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            searchInputValue: '',
            focus: false,
            userPixyId: '',
            userInfo: null,
            isUserInfoShow: false,
            loading: false,
            isReloadTable:false
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
            searchInputValue: e.target.value
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
        this.setState({loading: true});
        AjaxUtil.queryUserInfo(this.handleQueryUserSuccess.bind(this), this.handleQueryUserError.bind(this), this.state.searchInputValue);
    }

    handleQueryUserSuccess (data, txtStatus, xhr) {
        this.setState({loading: false});
        if (data.uid == '0') {
            this.errorModal();
            return;
        }
        this.setState({
            userPixyId: data.uid,
            isUserInfoShow: true,
            userInfo: data,
            loading:false
        });
    }

    handleQueryUserError (e) {
        this.setState({loading: false});
        if (e.status===401) {
            CheckToken.check();
        }else {
            this.errorModal();
        }
    }
    

    handleInputKeyPress (e) {
        //监听enter键
        if (e.keyCode == '13') {
            this.handleSearch();
        }
    }

    handleLoading(val) {
        this.setState({loading: val});
    }


    finishReloadTableData(){
        this.setState({isReloadTable:false});
    }

    reloadTableData(){
        this.setState({isReloadTable:true,loading: true});
    }

    onChangeSignedCert(name,value){
        var that = this;
        var data = {"uid": this.state.userPixyId};
        data[name] = value?1:0;
        AjaxUtil.sign(function(){
            var userInfo = Object.assign({},that.state.userInfo);
            userInfo[name] = value?1:0;
            that.setState({
                userInfo:userInfo
            });
            message.success(i18n.msg.OperationSucceeded);
            that.reloadTableData()
        }, function(e){
                if (e.status===401) {
                    CheckToken.check();
                }
                else {
                    message.error(i18n.msg.OperationFailed);
                }
        }, data);
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
                <SignInformation userInfo={this.state.userInfo}
                                 onChangeCert={this.onChangeSignedCert.bind(this,"cert")}
                                 onChangeSigned={this.onChangeSignedCert.bind(this,"talker")} ></SignInformation>
            ]
        }
        var signedList = <SignedList isReloadTable={this.state.isReloadTable} finishReloadTableData={this.finishReloadTableData.bind(this)} loading={this.handleLoading.bind(this)}></SignedList>

        return(
            <Spin spining={this.state.loading} tip="loading...">
                <div className="m-signed-query">
                    <Row className={rowCls} type="flex" justify="start">
                        <Col className="c1" span="3">
                            PIXY ID:
                        </Col>
                        <Col span="8">
                            <div className="ant-search-input-wrapper">
                                <InputGroup className={searchCls}>
                                    <Input value={this.state.searchInputValue}
                                           onChange={this.handleInputChange.bind(this)}
                                           onKeyUp={this.handleInputKeyPress.bind(this)}
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
                    {signedList}
                </div>
            </Spin>
            
        )
    }
}