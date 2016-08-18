import React from 'react'
import classNames from 'classnames';
import { Row, Col, Icon, Table, Pagination, Modal, message,Input,Button,Spin,Form,Radio,Select,Upload,Switch,InputNumber} from 'antd';
const FormItem = Form.Item;
import {getThumbUrl40,isArray} from '../../utils/CommonUtils';

export default class SelectChannel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedChannel: null,
            disabledBtn: true,
            refreshLoading: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.calcDisableBtn(nextProps);
    }

    calcDisableBtn(props) {
        var robotList = props.robotList || [];
        var selectedChannel = this.state.selectedChannel;
        this.setState({
            disabledBtn: (robotList.length === 0 || !selectedChannel)
        });
    }

    handleChange(i) {
        i = parseInt(i, 10);
        var channelList = this.props.channelList || [];
        if (!isArray(channelList)){
            channelList = [];
        }
        var selectedChannel = channelList[i];
        this.state.selectedChannel = selectedChannel;
        this.setState({selectedChannel: selectedChannel});
        this.calcDisableBtn(this.props);
    }

    handleSubmit(e) {
        e.preventDefault();
        var isJoined = this.props.isJoined || false;
        var selectedChannel = this.state.selectedChannel;
        this.props.onChannelChanged(selectedChannel, (!isJoined));
        if(isJoined){
            this.setState({selectedChannel:null});
        }
    }


    onRefreshChannelList() {
        var isJoined = this.props.isJoined || false;
        var loading = this.props.loading;
        if(isJoined || loading){
            return;
        }

        var that = this;
        that.setState({refreshLoading: true});
        this.props.onRefreshChannelList(function () {
            that.setState({refreshLoading: false});
        });
    }

    filterSelectOption(inputValue, option) {
        inputValue = inputValue || "";
        if (!inputValue || inputValue.trim().length === 0) {
            return true;
        }

        var channelList = this.props.channelList || [];
        var index = option.props.value;
        var channel = channelList[index] || {};
        var pixy_id = channel.pixy_id || "";
        pixy_id = "" + pixy_id;
        pixy_id = pixy_id.toLowerCase();

        var name = channel.name || "";
        name = "" + name;
        name = name.toLowerCase();

        inputValue = inputValue.toLowerCase();

        return ( pixy_id.indexOf(inputValue) >= 0 || name.indexOf(inputValue) >= 0 );
    }

    render() {


        var channelList = this.props.channelList || [];

        if (!isArray(channelList)){
            channelList = [];
        }


        var options = channelList.map(function (channel, i) {
            return (
                <Option value={i} key={'select_option_'+(channel.channel_id || i)}>
                    <div>
                        <img src={getThumbUrl40(channel.avator)} className="selectChannelImg"/>
                        <div className="selectChannelRi">
                            <span className="selectChannelName">{channel.name}</span>
                            <span className="selectChannelPixyId">{channel.pixy_id}</span>
                        </div>
                        <div className="selectChannelNum">{channel.room_num}</div>
                        <div className="clear"></div>
                    </div>
                </Option>);
        });
        var isJoined = this.props.isJoined || false;

        var notFoundContent = this.state.refreshLoading ? "loading...":"Not Found";


        var selectChannelFormCls = classNames({
            selectChannelForm:true,
            selectChannelFormEmpty:!this.state.selectedChannel
        });


        var jonBtnText = isJoined ? 'Leave' : 'Join';
        if(this.props.loading){
            jonBtnText = 'Waiting...';
        }

        return (
            <div className="selectChannel">
                <Spin spining={this.state.refreshLoading} tip="loading...">
                <Row type="flex" justify="start">
                    <Col span="24">
                        <div className={selectChannelFormCls}>
                            <Form inline onSubmit={this.handleSubmit.bind(this)}>
                                <FormItem label="">
                                        <Select style={{ width: 400 }}
                                                showSearch = {false}
                                                filterOption={this.filterSelectOption.bind(this)}
                                                disabled={isJoined || this.props.loading}
                                                placeholder="please select channel"
                                                notFoundContent={notFoundContent}
                                                onClick={this.onRefreshChannelList.bind(this)}
                                                onChange={this.handleChange.bind(this)}>
                                            {options}
                                        </Select>
                                </FormItem>
                                <Button type="primary" htmlType="submit" loading={this.props.loading}
                                        disabled={this.state.disabledBtn}>
                                    {jonBtnText}
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
                </Spin>
            </div>
        )
    }
}