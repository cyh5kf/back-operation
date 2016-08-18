import React from 'react'
import classNames from 'classnames';
import { Row, Col, Icon, Table, Pagination, Modal, message,Input,Button,Spin,Form,Radio,Select,Upload,Switch,InputNumber} from 'antd';

import PageTitle from '../../components/Common/PageTitle'
import SelectChannel from './SelectChannel';
import ChatCard from './ChatCard';
import RobotCard from './RobotCard';
import {AjaxUtil,CheckToken} from '../auth'

import './index.less';

var MAX_STORE_MESSAGE_COUNT = 5000;

export default class LiveInteraction extends React.Component {


    constructor(props) {
        super(props);
        this.state = {

            //当前是否已经加入了频道
            isJoinedChannel: false,

            //频道列表
            channelList: [
                //{channel_id:'1',pixy_id:"111",name:'111',avator:'http://ddd.xx',room_num:10},
            ],

            //机器人列表
            robotList: [
                //{pixy_id:'11',name:'111',avator:"http://www.sss.ss"},
            ],

            //当前选中的机器人
            selectedRobot: null,
            //当前选中的频道
            selectedChannel: null,
            //加载中...
            isSelectChannelLoading: false,
            //加载机器人
            loadingRobot:false
        };

        //消息记录
        this.state.messageList = [
            //发送的一条消息
            //{
            //    channel_id: "111", robot_id: "222", message: "hello",
            //    extra: {
            //        robot: {},
            //        channel: {},
            //        createTime: "2016年06月29日19:39:08"
            //    }
            //}
        ];

        this.completeRobotCount = 0;
    }


    onRefreshChannelList(callback) {
        var that = this;
        var onSuccess = (d)=>{
            that.setState({channelList: d});
            callback();
        };
        var onError = (e)=>{
            that.handleRequestError(e);
            callback();
        };
        that.setState({channelList: []});
        AjaxUtil.getChannelList(onSuccess,onError);
    }

    /**
     * 第一次查询数据
     */
    componentWillMount() {
        //this.onRefreshChannelList(function(){
        //});
        this.onClickGetRobots();
    }

    handleRequestError(e) {
        if (e.status === 401) {
            CheckToken.check();
        }
    }


    onChannelChangedOneRobot(robot, channel, isWillJoin, onComplete) {
        var that = this;
        var robot_id = robot.pixy_id;
        var callback = ()=> {
            robot.isJoined = isWillJoin;
            that.setState({});
        };

        var actionMo = {
            channel_id: channel.channel_id,
            robot_id: robot_id,
            message: ''
        };

        var onError = (e)=> {
            that.handleRequestError(e);
        };

        if (isWillJoin) {
            AjaxUtil.enterRoomAction(actionMo, callback, onError, onComplete);
        } else {
            AjaxUtil.leaveRoomAction(actionMo, callback, onError, onComplete);
        }
    }


    /**
     * 加入或退出频道
     * @param channel
     * @param isWillJoin
     */
    onChannelChanged(channel, isWillJoin) {
        console.log(channel, isWillJoin);

        var that = this;
        var robotList = this.state.robotList || [];

        that.completeRobotCount = 0;
        that.setState({isSelectChannelLoading: true});
        var onComplete = ()=> {
            that.completeRobotCount++;
            if (that.completeRobotCount === robotList.length) {
                that.setState({isSelectChannelLoading: false});
            }
        };


        robotList.forEach(function (robot, i) {
            setTimeout(function () {
                that.onChannelChangedOneRobot(robot, channel, isWillJoin, onComplete);
            }, i * 1000);
        });

        that.setState({
            selectedChannel: isWillJoin ? channel : null,
            isJoinedChannel: isWillJoin,
            messageList: [] //加入或退出频道时,聊天记录删掉
        });

    }


    /**
     * 选中了一个robot
     * @param robot
     */
    onSelectRobot(robot) {
        var robotList = this.state.robotList ||[];
        robotList.forEach((robot)=>{robot.isSelected=false;});
        robot.isSelected = true;
        this.setState({
            selectedRobot: robot
        });

        setTimeout(function(){
            var input0 = document.getElementsByClassName('liveInterMessageSendInput')[0];
            input0.focus();
        },10)
    }


    //点击获取一批机器人
    onClickGetRobots() {

        if(this.state.loadingRobot){
            return;
        }

        var that = this;
        that.setState({loadingRobot: true});
        AjaxUtil.getRobotList((d)=> {
            that.setState({robotList: d});
            that.setState({loadingRobot: false});
        });
    }


    //发送消息
    onSendMessage(inputMessage, callback) {
        var that = this;
        var selectedRobot = this.state.selectedRobot || {};
        var selectedChannel = this.state.selectedChannel || {};

        var actionMo = {
            channel_id: selectedChannel.channel_id,
            robot_id: selectedRobot.pixy_id,
            message: inputMessage
        };

        var onSuccess = ()=> {
            var messageList = that.state.messageList || [];
            messageList.push(
                {
                    channel_id: selectedChannel.channel_id || "",
                    robot_id: selectedRobot.pixy_id || "",
                    message: inputMessage,
                    extra: {
                        robot: selectedRobot,
                        channel: selectedChannel,
                        createTime: (new Date().toLocaleString()),
                        createTimestamp: (new Date().getTime())
                    }
                }
            );


            var start = (messageList.length - MAX_STORE_MESSAGE_COUNT) < 0 ? 0 : (messageList.length - MAX_STORE_MESSAGE_COUNT);
            messageList = messageList.slice(start, messageList.length);
            that.setState({
                messageList: messageList
            });

            callback(true);
        };


        var onError = (e)=> {
            that.handleRequestError(e);
            callback(false);
        };

        AjaxUtil.sendInteractionMsg(actionMo, onSuccess, onError);

    }

    render() {
        return (
            <div className="channelList">
                <PageTitle>Live Interaction</PageTitle>
                <SelectChannel channelList={this.state.channelList}
                               robotList={this.state.robotList}
                               isJoined={this.state.isJoinedChannel}
                               loading={this.state.isSelectChannelLoading}
                               onRefreshChannelList={this.onRefreshChannelList.bind(this)}
                               onChannelChanged={this.onChannelChanged.bind(this)}></SelectChannel>
                <div className="height20"></div>

                <Row type="flex" justify="start">
                    <Col span="5">
                        <RobotCard selectedRobot={this.state.selectedRobot} robotList={this.state.robotList}
                                   onSelectRobot={this.onSelectRobot.bind(this)}></RobotCard>
                        <div className="height20"></div>
                        {
                            this.state.isJoinedChannel?(null):(
                                <Button type="primary" onClick={this.onClickGetRobots.bind(this)} loading={this.state.loadingRobot} >Get Robots</Button>
                            )
                        }
                    </Col>
                    <Col span="19">
                        <ChatCard selectedRobot={this.state.selectedRobot} messageList={this.state.messageList}
                                  onSendMessage={this.onSendMessage.bind(this)}></ChatCard>
                    </Col>
                </Row>

            </div>
        )
    }
}