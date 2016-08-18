import React from 'react';
import { Row, Col, Input, Button, Dropdown, Menu, Icon, Select,Alert,Spin,message,Modal} from 'antd';
import classNames from 'classnames';
import BasicInformation from '../../BasicInformation/BasicInformation';
import BanTable from './BanTable';
import SearchInput from '../../../components/Common/SearchInput';
import {AjaxUtil,CheckToken} from '../../auth';
import './index.less';
import {i18n} from '../../../utils/i18n';
const InputGroup = Input.Group;
const confirm = Modal.confirm;

var MESSAGE_DEFAULT = 'You can search by pixy ID';
var MESSAGE_NO_USER = 'User does not exist, please check the ID';
export default class Ban extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isUserInfoShow: false,
            loading: false,
            queryBanData: [],
            pagination: '',
            tableTotalCount: 0,
            pageNumber: 1,
            pageSize: 10,
            userInfo: '',
            message: MESSAGE_DEFAULT,
            info_loading: '',
            alertType: 'info',
            channelinfo: '',
            channel_id: '',
            banChecked: '',
            disabled: '',
            livePauseVisible: true,
            banVisible: true
        };
    }

    errorModal (text) {
        Modal.error({
            title: 'Warning',
            content: text,
            okText:'OK'
        });
    }

    //查询已被ban用户
    componentWillMount() {
        var data = {
            "pageNumber": 1,
            "pageSize": 10
        };
        this.setState({loading: true});
        this.ajaxQueryBan(data);
        
    }

    ajaxQueryBan (data) {
        AjaxUtil.queryBan(this.handleQueryBanSuccess.bind(this), this.handleQueryBanError.bind(this), data);
    }

    handleQueryBanSuccess (data) {
        var queryBanData = [];
        for (let i=0, len=data.rows.length; i<len; i++) {
            queryBanData.push({
                key: (this.state.pageNumber-1)*10 + i,
                uid: data.rows[i].uid,
                name: data.rows[i].name,
                gender: data.rows[i].gender,
                avatar: data.rows[i].avatar,
                email: data.rows[i].email,
                level: data.rows[i].level,
                language: data.rows[i].lang,
                signed: data.rows[i].signed,
                cert: data.rows[i].cert,
                ban_level: data.rows[i].ban_level
            })
        }
        var tableTotalCount = data.totalCount;
        this.setState({
            queryBanData: queryBanData,
            tableTotalCount: tableTotalCount,
            loading: false
        })
        console.log("queryBanData:",this.state.queryBanData);
    }

    handleQueryBanError (e) {
        if (e.status===401) {
            CheckToken.check();
        }
        this.setState({
            loading: false
        })
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
            info_loading: true
        });
        AjaxUtil.queryUserInfo(
            function (data) {
                var uid = data.uid;
                if (!uid) {
                    data = null;
                }
                var ban_level = data.ban_level;
                if (ban_level == '0') {
                    that.setState({banChecked: false});
                } else if(ban_level == '255') {
                    that.setState({banChecked: true});
                }
                that.setState({
                    userInfo: data,
                    info_loading: false,
                    message: MESSAGE_NO_USER
                });
            }, function (e) {
                that.setState({
                    info_loading: false
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

        AjaxUtil.queryChannelInfo(
            function(data) {
                var channel_id = data.channel_id;
                if (channel_id !== null && channel_id !== '') {
                    that.setState({disabled: ''});
                } else {
                    that.setState({disabled: 'disabled'});
                }
                console.log(that.state.disabled);
                that.setState({
                    channel_id: channel_id,
                    info_loading: false
                });
            },function (e) {
            that.setState({
                info_loading: false
            });
            if (e.status === 401) {
                CheckToken.check();
            }
        }, searchInputValue);
    }

    //查询表格信息
    queryTableContent() {
        var data = {
            "pageNumber": this.state.pageNumber,
            "pageSize": this.state.pageSize
        };
        this.setState({loading: true});
        this.ajaxQueryBan(data);
    }

    //关闭频道事件
    handleLivePause() {

        //对话框确认函数
        function onOk () {
            var that = this;
            var channel_id = that.state.channel_id;
            AjaxUtil.closeChannel(
                function (data) {
                    message.success('Close this channel successfully');
                    that.setState({
                        disabled: 'disabled',
                        info_loading: false
                    });
                }, function (e) {
                    that.setState({
                        info_loading: false
                    });
                    if (e.status === 401) {
                        CheckToken.check();
                    }
                }, channel_id);
            }
            //提示对话框
            confirm({
                title: 'Are you sure you want to close the channel',
                onOk: onOk.bind(this),
                onCancel() {},
                okText:'Ok',
                cancelText:'Cancle',
            });
        
    }

    //ban/recover事件
    handleBan(value) {
        var that = this;
        var uid = that.state.userInfo.uid;
        var channel_id = that.state.channel_id;
        if (value) {
            const ajaxData = {
                user_id: uid,
                channel_id: channel_id,
                audit_result: 255,
                ban_method : 2
            };
             AjaxUtil.commitreport(
                function(data) {
                    that.queryTableContent();
                    message.success('ban the channel successfully');
                    that.setState({
                        banChecked: true,
                        info_loading: false
                    });
                },function (e) {
                    if (e.status === 401) {
                        CheckToken.check();
                    }
                }, ajaxData);
        } else {
            AjaxUtil.recoverChannel(
                function (data) {
                    that.queryTableContent();
                    message.success('recover the channel successfully');
                    that.setState({
                        banChecked: false,
                        info_loading: false
                    });
                }, function (e) {
                    if (e.status === 401) {
                        CheckToken.check();
                    }
                }, uid);
            }
        }
        

    render () {
        var pagination = {
            total: this.state.tableTotalCount || 0,
            showSizeChanger: true,
            pageSize: this.state.pageSize,
            onShowSizeChange:function (current, pageSize) {
                this.state.pageNumber = current;
                this.state.pageSize = pageSize;
                this.queryTableContent();
            }.bind(this),
            onChange:function(current) {
                this.state.pageNumber = current;
                this.queryTableContent();
            }.bind(this)
        };
         
        var banTable = <BanTable 
                            queryBanData={this.state.queryBanData}
                            pagination={pagination}
                            ></BanTable>

        var userInfo = this.state.userInfo;
        var banChecked = this.state.banChecked;
        var channel_id = this.state.channel_id;
        var disabled = this.state.disabled;
        var that = this;
        var state = that.state;

        return(
            <Spin spining={state.loading} tip="loading...">
                <div className="m-signed-query">
                    <Row type="flex" justify="start">
                        <Col span="24" className="titleHead">
                            Ban Broadcaster
                        </Col>
                    </Row>
                    <div style={{ height: 20 }}></div>
                    <Row type="flex" justify="start">
                        <Col span="20">
                            <div>
                                <SearchInput
                                    placeholder="Search by PIXY ID"
                                    onSearch={that.handleSearch.bind(that)} style={{ width:400 }} />
                            </div>
                        </Col>
                    </Row>
                    <div style={{ height: 20 }}></div>
                    <Row type="flex" justify="start">
                        <Col span="24">
                            <Spin spining={state.info_loading} tip="loading...">
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
                                                <BasicInformation 
                                                    userInfo={userInfo} 
                                                    livePause={that.handleLivePause.bind(that)} 
                                                    banChecked={banChecked}
                                                    onChangeBan={that.handleBan.bind(that)}
                                                    disabled={disabled}
                                                    livePauseVisible={that.state.livePauseVisible}
                                                    banVisible={that.state.banVisible}
                                                ></BasicInformation>
                                            </div>
                                        )
                                    }
                                </div>
                            </Spin>
                        </Col>
                    </Row>
                    {banTable}
                </div>
            </Spin>
            
        )
    }
}