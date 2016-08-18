import React from 'react'
import { Row, Col, Icon, Table, Pagination, Modal, message,Input,Button,Spin,Form,Radio,Select,Upload,Switch,InputNumber} from 'antd';
import classNames from 'classnames';

import {getThumbUrl40} from '../../utils/CommonUtils';

var id = 1;
var MAX_SHOW_MESSAGE_COUNT = 500;

export default class ChatCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sending: false, //发送中...
            inputMessage: '',
            isShowAllMessage:false,
            isShowInputFull:false
        };
        this.componentMessageListId = "messageListId_" + (id++);
    }


    handleSubmit(e) {
        e.preventDefault();

        //when sending , no action
        if (this.state.sending) {
            return;
        }
        var inputMessage = this.state.inputMessage || "";
        inputMessage = inputMessage.trim();
        if (!inputMessage) {
            return;
        }

        var that = this;
        that.setState({sending: true,isShowInputFull:false});
        this.props.onSendMessage(inputMessage, function (isOK) {
            if (isOK) {
                that.setState({inputMessage: '',isShowInputFull:false});
            }
            that.setState({sending: false});


            setTimeout(function () {
                var dom0 = document.getElementsByClassName(that.componentMessageListId)[0];
                dom0.scrollTop = (dom0.scrollTop + 1000)
            }, 10);
        });
    }


    handleInputChange(e) {
        var value = e.target.value || "";
        var isShowInputFull=(value.length>150);
        if(isShowInputFull){
            this.setState({
                isShowInputFull:isShowInputFull
            });
            return;
        }
        this.setState({
            inputMessage: value,
            isShowInputFull:isShowInputFull
        });
    }

    onChangeSwitchBtn(checked){
        this.setState({
            isShowAllMessage:checked
        });
    }


    renderMessageList(){
        var messageList = this.props.messageList || [];
        var selectedRobot = this.props.selectedRobot;
        var renderList = [];
        if (this.state.isShowAllMessage) {
            renderList = messageList;
        } else {
            for (var i = 0; i < messageList.length; i++) {
                var msg = messageList[i];
                if (msg.robot_id === selectedRobot.pixy_id) {
                    renderList.push(msg);
                }
            }
        }

        var start = (renderList.length - MAX_SHOW_MESSAGE_COUNT) < 0 ? 0 : (renderList.length - MAX_SHOW_MESSAGE_COUNT);
        renderList = renderList.slice(start, renderList.length);


        var messageListDOM = renderList.map(function (msg, i) {
            var msgExtra = msg.extra || [];
            var robot = msgExtra.robot;
            var createTimestamp = msgExtra.createTimestamp || i;
            return (
                <div className="messageItem" key={'msg_item_'+createTimestamp}>
                    <div className="messageRobot">
                        <div className="robotAvatar">
                            <img src={getThumbUrl40(robot.avator)}/>
                        </div>
                        <div className="robotName">
                            {robot.name}
                        </div>
                        <div className="robotTime">
                            {msgExtra.createTime}
                        </div>
                    </div>
                    <div className="messageContent">
                        {msg.message}
                    </div>
                    <div className="clear"></div>
                </div>
            );
        });

        return messageListDOM;
    }

    render() {
        var that = this;
        var selectedRobot = this.props.selectedRobot;
        var messageListCls = {
            messageList: true
        };
        messageListCls[that.componentMessageListId] = true;
        messageListCls = classNames(messageListCls);


        var messageSendCls = classNames({
            messageSend: true,
            messageSendDisabled: (!selectedRobot || selectedRobot.isJoined !== true)
        });
        selectedRobot = selectedRobot || {};

        return (
            <div className="ChatBox">
                <div className="messageTitle"></div>
                <div className={messageListCls}>
                    {that.renderMessageList()}
                </div>

                <div className={messageSendCls}>
                    <div className="messageSendHolder"></div>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <Input className="liveInterMessageSendInput" value={this.state.inputMessage} placeholder="please input message"
                               onChange={this.handleInputChange.bind(this)}/>
                        {this.state.isShowInputFull?(
                            <div className="messageSendInputFull">You can input only 150 characters at most</div>
                        ):null}
                        <div className="height20"></div>
                        <div>
                            <div className="currentUser">
                                <div className="imgWrapper avatar40"><img
                                    src={getThumbUrl40(selectedRobot.avatar || selectedRobot.avator)}/></div>
                                <div className="name">{selectedRobot.name}</div>
                                <div className="onlyThisUser">
                                    <Switch checked={that.state.isShowAllMessage} checkedChildren="On"
                                            unCheckedChildren="Off" onChange={that.onChangeSwitchBtn.bind(that)}/>
                                    &nbsp;&nbsp;
                                    Show all users
                                </div>
                            </div>
                            <Button loading={this.state.sending} style={{height:40,width:200}} type="primary"
                                    htmlType="submit">Send Message</Button>
                        </div>
                    </Form>
                </div>


            </div>
        )
    }
}