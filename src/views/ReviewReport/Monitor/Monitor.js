import React from 'react';
import { Row, Col,  Button, Modal, Icon,message} from 'antd';
import '../../../../node_modules/video.js/dist/video';
import 'video.js/dist/video-js.css'
import './index.less';
import VideoModal from './VideoModal';
import {AjaxUtil} from '../../auth'
import {getThumbUrl70} from  '../../../utils/CommonUtils';
import Session from '../../Session'

const confirm = Modal.confirm;

export default class Monitor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoModalVisibal: false,
            isVisibleUserAvatarModal: false,
            visibleUserModel: {},//
            channel_id: null,
            iconLoading: false,
            monitorDataList: []
        };
    }

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    tokenError(e) {
        var self = this;
        Modal.error({
            title: 'warning',
            content: 'Page login information has expired, please re login',
            okText: 'OK',
            onOk() {
                self.context.router.replace('/login');
                Session.setLogined(false);
            }
        });
    }

    error(text) {
        let self = this;
        Modal.error({
            title: 'warning',
            content: text,
            okText: 'OK'
        });
    }

    success() {
        message.success('Punish success');
    };

    /**
     *  点击处罚按钮事件
     */
    showConfirmPunishChannel(userId, channelId) {
        confirm({
            title: 'Are you sure you want to punish the channel?',
            onOk() {
                var cbsuccess = function (data, txtStatus, xhr) {
                    if (xhr.status === 200) {
                        console.log("处罚成功");
                        this.success.bind(this);
                    } else if (xhr.status === 403) {
                        this.error('用户所属角色权限不够，无法执行该方法');
                    } else {
                        this.error("添加用户失败");
                        console.log("添加用户失败", data);
                    }
                };
                var cberror = function(e) {
                    if (e.status===401) {
                        CheckToken.check();
                    }
                }
                const ajaxData = {
                    user_id: userId,
                    channel_id: channelId,
                    audit_result: 255,
                    ban_method : 1
                };
                console.log(userId, channelId);
                AjaxUtil.commitreport(cbsuccess.bind(this), cberror.bind(this), ajaxData);
            },
            onCancel() {
            },
            okText: 'OK',
            cancelText: 'Cancel'
        });
    }


    /**
     * 强制用户退出
     * @param userId
     * @param channelId
     */
    showConfirmLogoutChannel(userId, channelId) {
        var that = this;
        confirm({
            title: 'Are you sure you want to close the channel?',
            onOk() {
                AjaxUtil.monitorKillChannel(channelId,userId,function(){
                    message.success("operation succeed");
                    that.handleRefresh();
                });
            },
            onCancel() {
            },
            okText: 'OK',
            cancelText: 'Cancel'
        });
    }

    /**
     *  控制视频弹窗显示隐藏
     */
    handleVideoModal(event, channelId) {
        if ('x' === event) {
            this.setState({videoModalVisibal: false});
        }
        else if ('a' === event) {
            this.setState({videoModalVisibal: true});
        }
        this.setState({channel_id: channelId});

    }

    /**
     *  请求后台获取所有监控数据
     */
    handleGetMonitorData(data, txtStatus, xhr) {
        if (xhr.status === 200) {
            this.setState({
                monitorDataList: data,
                iconLoading: false
            });
        } else if (xhr.status === 403) {
            this.error('用户所属角色权限不够，无法执行该方法');
            this.setState({iconLoading: false});
        } else {
            this.error("error infamation");
            this.setState({iconLoading: false});
        }
    }

    handleError() {
        this.tokenError();
        this.setState({iconLoading: false});
    }


    /**
     *  进入页面时加载图片
     */
    componentDidMount() {
        this.handleRefresh();
    }

    /**
     *  点击刷新按钮重新加载图片
     */
    handleRefresh() {
        this.setState({iconLoading: true});
        AjaxUtil.monitorPicture(this.handleGetMonitorData.bind(this), this.handleError.bind(this));
    }

    /**
     * 点击用户头像
     */
    onClickUserAvatar(m) {
        this.setState({isVisibleUserAvatarModal: true, visibleUserModel: m});
    }

    renderShowUserAvatarModal() {
        var that = this;

        var handleCancel = function () {
            that.setState({isVisibleUserAvatarModal: false});
        };

        var m = that.state.visibleUserModel || {};
        return (
            <Modal title="User Avatar" visible={that.state.isVisibleUserAvatarModal} onCancel={handleCancel}
                   maskClosable={true} closable={true}
                   footer={<Button type="primary" onClick={handleCancel}>OK</Button>}>
                <div className="monitor-dialog-user">
                    <div className="user-text">
                        Pixy Id : {m.user_id || ""} <br />
                        Channel Id :{m.channel_id || ""}
                    </div>
                    <img src={m.avatar || ""}/>
                </div>
            </Modal>
        );
    }


    renderVideoModal() {
        var addVideoModal = null;
        if (this.state.videoModalVisibal) {
            addVideoModal = <VideoModal
                videoModalVisibal={this.state.videoModalVisibal}
                channel_id={this.state.channel_id}
                cancleVideoModal={this.handleVideoModal.bind(this,'x')}></VideoModal>
        }
        return addVideoModal;
    }


    render() {

        var monitorDataList = this.state.monitorDataList || [];
        var addMonitor = monitorDataList.map(function (m, i) {
            return (
                <div className="container_img" key={i}>
                    <img src={"data:image/jpg;base64,"+m.snapshot}
                         onClick={this.handleVideoModal.bind(this,'a', m.channel_id)}/>
                    <div className="monitor-avatar" onClick={this.onClickUserAvatar.bind(this,m)}>
                        <img src={getThumbUrl70(m.avatar)} title={m.user_id}/>
                    </div>
                    <div className="monitor-operation">
                        <div className="monitor-operation-mask"></div>
                        <Icon type="logout" className="logout_btn"
                              onClick={this.showConfirmLogoutChannel.bind(this,m.user_id,m.channel_id)}/>
                        <Icon type="cross-circle-o" className="punish_btn"
                              onClick={this.showConfirmPunishChannel.bind(this,m.user_id,m.channel_id)}/>
                    </div>
                </div>
            );
        }.bind(this));


        return (
            <div>
                <div className="monitor-container">
                    {this.renderVideoModal()}
                    {this.renderShowUserAvatarModal()}
                    <div className="imgContainer">
                        {addMonitor}
                    </div>
                    <Button className="Refresh" type="primary" size="large" loading={this.state.iconLoading}
                            onClick={this.handleRefresh.bind(this)}>
                        <Icon type="reload"/>Refresh
                    </Button>
                </div>
            </div>
        )
    }
}