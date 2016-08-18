import React from 'react';
import { Row, Col, Input, Button, Dropdown, Menu, Icon, Select,Alert,Spin,message,Modal} from 'antd';
import BasicInformation from '../../BasicInformation/BasicInformation'
import SearchInput from '../../../components/Common/SearchInput';
import {AjaxUtil,CheckToken} from '../../auth';
import './index.less';


var MESSAGE_DEFAULT = 'You can search by pixy ID';
var MESSAGE_NO_USER = 'User does not exist, please check the ID';

export default class LiveNotification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: null,
            message: MESSAGE_DEFAULT,
            alertType: 'info',
            loading:false
        };
    }


    /**
     * 搜索人员
     * @param value
     */
    handleSearch(value) {
        var that = this;
        var searchInputValue = value ? value.trim() : "";
        searchInputValue = parseInt(searchInputValue, 10);

        if (!searchInputValue) {
            that.setState({
                userInfo: null,
                message: MESSAGE_NO_USER
            });
        }

        that.setState({
            loading: true
        });
        AjaxUtil.queryUserInfo(
            function (data) {
                var uid = data.uid;
                if (!uid) {
                    data = null;
                }
                that.setState({
                    userInfo: data,
                    loading: false,
                    message: MESSAGE_NO_USER
                });
            }, function (e) {
                that.setState({
                    loading: false
                });
                if (e.status === 401) {
                    CheckToken.check();
                }
                else {
                    that.setState({
                        userInfo: null,
                        message: MESSAGE_NO_USER
                    });
                }
            }, searchInputValue);
    }



    onConfirmSendNotice(){

        var that = this;
        var pixyId = this.state.userInfo.uid;
        AjaxUtil.sendLiveNotice(pixyId,function(e){
            if(e&& (e.status ===207)){
                message.error(e.message);
            }
            else {
                message.success('Send notification successfully');
            }
        },function(e){
            if (e.status === 401) {
                CheckToken.check();
            }else {
                message.error('failed to send notification');
            }
        });
    }

    /**
     * 发送消息通知
     */
    onClickSendNotice(){
        var that = this;
        Modal.confirm({
            title: 'Warning',
            content: 'Are you sure you want to send notification ?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                that.onConfirmSendNotice();
            },
            onCancel() {}
        });
    }

    render() {

        var state = this.state;
        var userInfo = state.userInfo;
        var that = this;

        return (
            <div className="liveNotification">

                <Row type="flex" justify="start">
                    <Col span="24" className="titleHead">
                        Live Notification
                    </Col>
                </Row>
                <Row className="search" type="flex" justify="start">
                    <Col span="20">
                        <div style={{ height: 20 }}></div>
                        <SearchInput
                            preTitle="PIXY ID:"
                            placeholder="input PIXY ID "
                            onSearch={that.handleSearch.bind(that)} style={{ width: 400 }}/>
                        <div style={{ height: 20 }}></div>
                    </Col>
                    <Col span="4">
                    </Col>
                </Row>
                <Row type="flex" justify="start">
                        <Col span="24">
                            <Spin spining={that.state.loading} tip="loading...">
                                <div>
                                    {(!userInfo) ?
                                        (
                                            <div>
                                                <Alert message={state.message}
                                                       showIcon
                                                       type={state.alertType}
                                                />
                                            </div>
                                        ) :
                                        (
                                            <div>
                                                <BasicInformation userInfo={userInfo}></BasicInformation>
                                                <Button onClick={that.onClickSendNotice.bind(that)} className="sendNoticeButton" size="large" type="primary">Send Notification</Button>
                                            </div>
                                        )
                                    }
                                </div>
                            </Spin>
                        </Col>
                </Row>
            </div>
        );

    }

}