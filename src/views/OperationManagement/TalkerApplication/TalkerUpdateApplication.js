import React from 'react';
import {Table, Row, Col, Button, Radio, Input,message,Modal,Select,Spin,Icon,DatePicker} from 'antd';
import enUS from 'antd/lib/date-picker/locale/en_US';
import {AjaxUtil} from '../../auth';
import {i18n} from '../../../utils/i18n'
import {getThumbUrl40,getTimeOnlyDate} from '../../../utils/CommonUtils';
import './index.less';
import img from "../../../images/head_default.png";
import AudioWrapper from './AudioWrapper';
function formatNumber(x) {
    if (x < 10) {
        return '0' + x;
    }
    return x;
}

export default class TalkerUpdateApplication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            tableRows: [],
            tableTotalCount: 0,

            loading: false,
            visibleUserModel: {},
            visibleAlbumListModel: {},
            visibleCoverModel: {},
            isVisibleUserAvatarModal: false,
            isVisibleAlbumListModal: false,
            isVisibleCoverModal: false,
            /**
             * 查询条件
             */
            queryCondition: {
                pageNumber: 1,
                pageSize: 10
            }

        };

        this.displayTimeRange = "";
        this.initTableColumns();
    }

    /**
     * 第一次查询数据
     */
    componentWillMount() {
        this.queryTableContent();
    }

    renderAudio(text, row, index) {
        let link = text.replace(/amr/,"ogg");
        if (link){
            return ( <AudioWrapper src={link}></AudioWrapper>)
        }else {
            return <span></span>
        }
    }


    initTableColumns() {
        var renderTimestamp = this.renderTimestamp.bind(this);
        var renderAudio = this.renderAudio.bind(this);

        var that = this;
        this.tableColumns = [
            {
                title: 'Uid',
                dataIndex: 'uid',
                key: 'uid',
                width: 100
            },
            {
                title: 'Avatar',
                dataIndex: 'avatar',
                key: 'avatar',
                width:100,
                render: function (text, row, index) {
                    if (text){
                        return (<img onClick={that.onClickAvatar.bind(that,text,row)} className="avatar" src={getThumbUrl40(text)} alt=""/>)
                    }else {
                        return (<img className="avatar" src={img} />)
                    }
                }
            },{
                title: 'Signature',
                dataIndex: 'signature',
                key: 'signature',
                width: 200
            }, {
                title: 'Cover',
                dataIndex: 'cover',
                key: 'cover',
                width: 100,
                render: function (text, row, index) {
                    if (text){
                        return (<img onClick={that.onClickCover.bind(that,text,row)} className="cover" src={text} alt=""/>)
                    }else {
                        return <span></span>
                    }
                }

            }, {
                title: 'Album List',
                dataIndex: 'album_list',
                key: 'album_list',
                width: 200,
                render: (text, row, index) => {
                    if (text){
                        let imgList = [];
                        for (let key in text) {
                            imgList.push(<img className="album_list" onClick={that.onClickAlbumList.bind(that,text[key],row)} key={key} src={text[key]} alt=""/>);
                        }
                        return(<span>{imgList}</span>);
                    }else {
                        return <span></span>
                    }
                }
            },{
                title: 'Voice Demo',
                dataIndex: 'voice_demo',
                key: 'voice_demo',
                width: 150,
                render: renderAudio
            },{
                title: 'CreatedTime',
                dataIndex: 'created',
                key: 'created',
                width: 150,
                render: renderTimestamp
            },{
                title: 'Live lang',
                dataIndex: 'live_lang',
                key: 'live_lang',
                width: 50
            },{
                title: 'Operatioin',
                key: 'operation',
                width: 150,
                render: (text, row) => {
                    return(
                        <div className="Unhandled">
                            <div>
                                <a className="tableOperation" onClick={that.onClickRecordOperation.bind(that,'approve',row)} >Approval</a>
                            </div>
                            <span> ———— </span>
                            <div>
                                <a className="tableOperation" onClick={that.onClickRecordOperation.bind(that,'reject',row)} >Reject</a>
                            </div>
                        </div>
                    )
                    
                }
            }
        ];
    }

    renderTimestamp(text, row, index) {
        if (text) {
            var x = new Date(text);
            var v = x.getFullYear() + '-' + (x.getMonth() + 1) + '-' + (x.getDate()) + "  " + formatNumber(x.getHours()) + ":" + formatNumber(x.getMinutes());
            return <span>{v}</span>
        } else {
            return <span></span>
        }
    }


    onClickAvatar(text,row){
        this.setState({isVisibleUserAvatarModal: true,visibleUserModel:row});
    }

    onClickCover(text,row){
        this.setState({isVisibleCoverModal: true,visibleCoverModel:row});
    } 

    onClickAlbumList(text,row){
        this.setState({isVisibleAlbumListModal: true,visibleAlbumListModel:text});
    }

    onClickRecordOperation(operationType, record) {
        //return;

        var isReject = operationType == 'reject';
        var that = this;
        var tips = '';
        if (isReject) {
            tips = 'Are you sure you want to reject this application?';
        } else {
            tips = 'Are you sure you want to approve this application?';
        }

        var request = (isReject) ? AjaxUtil.TalkerApplicationUpdateReject : AjaxUtil.TalkerApplicationUpdateApprove;
        var condition = {uid: record.uid};

        Modal.confirm({
            title: 'Warning',
            content: tips,
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                request(condition, function () {
                    message.success(i18n.msg.OperationSucceeded);
                    that.queryTableContent();
                }, function () {
                    message.error(i18n.msg.OperationFailed);
                });
            },
            onCancel() {
            }
        });

    }

    queryTableContent() {
        var queryCondition = this.state.queryCondition;
        var that = this;
        that.setState({loading: true});

        AjaxUtil.queryTalkerUpdateApplicationList(queryCondition, function (d) {
            var applicationMoList = d.rows || [];
            applicationMoList.forEach(function (m, i) {
                m.key = i;
            });
            that.setState({
                loading: false,
                tableRows: applicationMoList,
                tableTotalCount: d.totalCount
            });
        });
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
                    <img src={m.avatar || ""}/>
                </div>
            </Modal>
        );
    }

    renderShowCoverModal() {
        var that = this;

        var handleCancel = function () {
            that.setState({isVisibleCoverModal: false});
        };

        var m = that.state.visibleCoverModel || {};
        return (
            <Modal title="Talker Cover" visible={that.state.isVisibleCoverModal} onCancel={handleCancel}
                   maskClosable={true} closable={true}
                   footer={<Button type="primary" onClick={handleCancel}>OK</Button>}>
                <div className="monitor-dialog-user">
                    <img src={m.cover || ""}/>
                </div>
            </Modal>
        );
    }

    renderShowAlbumListModal() {
        var that = this;

        var handleCancel = function () {
            that.setState({isVisibleAlbumListModal: false});
        };

        var m = that.state.visibleAlbumListModel || {};
        return (
            <Modal title="Album List" visible={that.state.isVisibleAlbumListModal} onCancel={handleCancel}
                maskClosable={true} closable={true}
                footer={<Button type="primary" onClick={handleCancel}>OK</Button>}>
                <div className="monitor-dialog-user">
                    <img src={m || ""}/>
                </div>
            </Modal>
        );
    }


    render() {
        var that = this;
        var state = that.state;
        var columns = this.tableColumns;
        var tableRows = this.state.tableRows || [];
        var pagination = {
            total: state.tableTotalCount || 0,
            showSizeChanger: true,
            pageSize: state.queryCondition.pageSize,
            onShowSizeChange(current, pageSize) {
                state.queryCondition.pageNumber = current;
                state.queryCondition.pageSize = pageSize;
                that.queryTableContent();
            },
            onChange(current) {
                state.queryCondition.pageNumber = current;
                that.queryTableContent();
            }
        };

        return (
            <div className="t-info-content talkerApplication">
                {this.renderShowUserAvatarModal()}
                {this.renderShowAlbumListModal()}
                {this.renderShowCoverModal()}
                <Spin spining={this.state.loading} tip="loading...">
                    <div>
                        <Row type="flex" justify="start">
                            <Col span="24" className="titleHead">
                                Talker Update Application
                            </Col>
                        </Row>

                        <div style={{ height: 20 }}></div>

                        <Row className="r3" type="flex" justify="start">
                            <Col span="24" className="tableWrapper">
                                <Table columns={columns} dataSource={tableRows} pagination={pagination}
                                    locale={i18n.tableLocale} scroll={{ x: 1500 }}></Table>
                            </Col>
                        </Row>
                    </div>
                </Spin>
            </div>
        );
    }


}
