import React from 'react';
import {Table, Row, Col, Button, Radio, Input,message,Modal,Select,Spin,Icon,DatePicker} from 'antd';
import enUS from 'antd/lib/date-picker/locale/en_US';
const RangePicker = DatePicker.RangePicker;
import SearchCondition from './SearchCondition';
import {AjaxUtil} from '../../auth';
import {i18n} from '../../../utils/i18n'
import {getThumbUrl40,getTimeOnlyDate} from '../../../utils/CommonUtils';
import './index.less';
function formatNumber(x) {
    if (x < 10) {
        return '0' + x;
    }
    return x;
}

export default class JoinApplicationPixy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            tableRows: [],
            tableTotalCount: 0,

            loading: false,
            visibleUserModel: {},
            isVisibleUserAvatarModal: false,

            //select count(0) where lang = {变量} and timeRange = {变量} and status = 0;
            statusUnhandledCount: 0,
            ////select count(0) where lang = {变量} and timeRange = {变量};
            statusAllCount: 0,
            //select count(0) where lang = {变量} and timeRange = {变量} and status = 1;
            statusApprovedCount: 0,


            /**
             * 查询条件
             */
            queryCondition: {
                pageNumber: 1,
                pageSize: 20,
                language: "all",
                status: "-1",
                gender:"-1",
                searchTextField:"name",
                searchText:"",
                searchTimeFrom: "", //开始时间
                searchTimeTo: "" //结束时间
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


    initTableColumns() {

        var renderLink = this.renderLink.bind(this);
        var renderOperation = this.renderOperation.bind(this);
        var renderStatus = this.renderStatus.bind(this);
        var renderTimestamp = this.renderTimestamp.bind(this);

        var that = this;
        this.tableColumns = [
            {
                title: 'ID',
                dataIndex: 'app_id',
                key: 'app_id',
                width: 40
            },
            {
                title: 'Avatar',
                dataIndex: 'avatar_url',
                key: 'avatar_url',
                width: 50,
                render: function (text, row, index) {
                    if (text){
                        return (<img onClick={that.onClickAvatar.bind(that,text,row)} className="avatar" src={getThumbUrl40(text)} alt=""/>)
                    }else {
                        return <span></span>
                    }
                }
            }, {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: 120
            },
            {
                title: 'Gender',
                dataIndex: 'gender',
                key: 'gender',
                render: (text, record, index) => {
                    var gender = '';
                    if(record.gender == 1) {
                        gender = 'female';
                    } else if(record.gender == 2) {
                        gender = 'male';
                    }
                    return (
                        <span>{gender}</span>
                    )
                }
            }, {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: 140
            }, {
                title: 'Region',
                dataIndex: 'country',
                key: 'country',
                width: 100
            }, {
                title: 'Introduction',
                dataIndex: 'self_introduction',
                key: 'self_introduction',
                width: 400
            },
            {
                title: 'Lang',
                dataIndex: 'lang',
                key: 'lang',
                width: 80
            },
            {
                title: 'PixyId',
                dataIndex: 'pixy_id',
                key: 'pixy_id',
                width: 80
            },
            {
                title: 'CreatedTime',
                dataIndex: 'created',
                key: 'created',
                render: renderTimestamp,
                width: 140
            },
            //{
            //    title: 'Status',
            //    dataIndex: 'status',
            //    key: 'status',
            //    render: renderStatus
            //},
            {
                title: 'Operatioin',
                dataIndex: 'mmmmKey',
                key: 'mmmmKey',
                width: 150,
                render: renderOperation
            }
        ];
    }

    renderStatus(text, row, index) {
        row = row || {};
        var status = row.status;///0未处理, 1:通过， 2:拒绝',
        if (status === 0) {
            return (<div className="Unhandled" style={{color:"#000"}} title="Unhandled">Unhandled</div>);
        }
        if (status === 1) {
            return (
                <div className="Approved" title="approved">
                    <Icon type="check-circle" />
                </div>);
        }
        if (status === 2) {
            return (<div className="Rejected" title="rejected">
                <Icon type="cross-circle" />
            </div>);
        }
        return (<div></div>);
    }

    renderLink(text, row, index) {
        text = text || "";
        return <a href={text} target="_blank">{text}</a>
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

    renderOperation(text, row, index) {
        var that = this;
        row = row || {};
        var status = row.status;///0未处理, 1:通过， 2:拒绝',

        if (status === 0) {
            //tableOperationDisabled
            //onClick={that.onClickRecordOperation.bind(that,'approve',row)}
            //onClick={that.onClickRecordOperation.bind(that,'reject',row)}
            return (
                <div className="Unhandled">
                    <a className="tableOperation" onClick={that.onClickRecordOperation.bind(that,'approve',row)} >Approval</a>
                    <span> | </span>
                    <a className="tableOperation" onClick={that.onClickRecordOperation.bind(that,'reject',row)}>Reject</a>
                </div>
            );
        }

        if (status === 1) {
            return (
                <div className="Approved" style={{color:"green"}} title="approved">
                    <Icon type="check-circle" />
                </div>);
        }

        if (status === 2) {
            return (
                <div className="Rejected" style={{color:"red"}} title="rejected">
                    <Icon type="cross-circle" />
                </div>);
        }
        return (<div></div>);

    }


    onClickAvatar(text,row){
        this.setState({isVisibleUserAvatarModal: true,visibleUserModel:row});
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

        var request = (isReject) ? AjaxUtil.rejectPixyJoinApplication : AjaxUtil.approvePixyJoinApplication;

        Modal.confirm({
            title: 'Warning',
            content: tips,
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                request(record, function () {
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


    /**
     * 设置查询条件
     * @param condition
     */
    setQueryCondition(condition) {
        var queryCondition = this.state.queryCondition;
        queryCondition = Object.assign({}, queryCondition, condition);
        this.state.queryCondition = queryCondition;
        this.setState({
            queryCondition: queryCondition
        });
    }

    changeSelectLanguage(a, b, c) {
        this.setQueryCondition({
            pageNumber:1,
            language:a
        });
        this.queryTableContent();
    }

    changeSelectStatus(a,b,c){
        this.setQueryCondition({
            pageNumber:1,
            status:a
        });
        this.queryTableContent();
    }

    changeSelectGender(a){
        this.setQueryCondition({
            pageNumber:1,
            gender:a
        });
        this.queryTableContent();
    }

    /**
     * 时间选择发生变换
     * @param timeRange
     */
    onChangeDatePicker(timeRange,a,b,c) {

        var startDate = timeRange[0];
        var endDate = timeRange[1];
        startDate = startDate ? "" + getTimeOnlyDate(startDate): null;

        if(endDate){
            endDate.setDate(endDate.getDate()+1);
        }
        endDate = endDate ? "" + getTimeOnlyDate(endDate): null;

        this.setQueryCondition({
            searchTimeFrom: startDate,
            searchTimeTo: endDate
        });
        this.queryTableContent();
    }

    onChangeSearchTextField(a,b,c){
        this.setQueryCondition({
            searchTextField: a
        });
    }

    onChangeSearchInput(a,b,c){
        var v = a.target.value;
        this.setQueryCondition({
            searchText: v
        });
    }


    queryTableContent() {
        var queryCondition = this.state.queryCondition;
        var that = this;
        that.setState({loading: true});

        queryCondition = Object.assign({},queryCondition);
        queryCondition.status = parseInt(queryCondition.status,10);

        AjaxUtil.queryPixyJoinApplicationList(queryCondition, function (d) {
            var applicationMoList = d.applicationMoList || [];
            applicationMoList.forEach(function (m, i) {
                m.key = i;
                m.mmmmKey = i;
            });
            that.setState({
                loading: false,
                tableRows: applicationMoList,
                tableTotalCount: d.totalCount,

                statusUnhandledCount: d.statusUnhandledCount || 0,
                statusAllCount: d.statusAllCount || 0,
                statusApprovedCount: d.statusApprovedCount||0
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
                    <img src={m.avatar_url || ""}/>
                </div>
            </Modal>
        );
    }

    renderSummary(){
        var language = this.state.queryCondition.language;
        return (
            <div className="summary">
                <b>Summary</b>
                total:<span className="count">{this.state.statusAllCount}</span>
                unhandled:<span className="count">{this.state.statusUnhandledCount}</span>
                approved:<span className="count">{this.state.statusApprovedCount}</span>
            </div>
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

        //'0:未处理, 1:通过， 2:拒绝',
        return (
            <div className="t-info-content joinApplication">
                {this.renderShowUserAvatarModal()}
                <Spin spining={this.state.loading} tip="loading...">
                    <div>
                        <Row type="flex" justify="start">
                            <Col span="24" className="titleHead">
                                Broadcaster Recruit Application From Pixy
                            </Col>
                        </Row>


                        <SearchCondition
                            queryCondition={this.state.queryCondition}
                            changeSelectLanguage={this.changeSelectLanguage.bind(this)}
                            changeSelectStatus={this.changeSelectStatus.bind(this)}
                            changeSelectGender={this.changeSelectGender.bind(this)}
                            onChangeDatePicker={this.onChangeDatePicker.bind(this)}
                            queryTableContent={this.queryTableContent.bind(this)}
                            onChangeSearchInput={this.onChangeSearchInput.bind(this)}
                            onChangeSearchTextField={this.onChangeSearchTextField.bind(this)}
                        ></SearchCondition>

                        <Row  type="flex" justify="start">
                            {this.renderSummary.bind(this)()}
                        </Row>
                        <div style={{ height: 20 }}></div>


                        <Row className="r3" type="flex" justify="start">
                            <Col span="24" className="tableWrapper">
                                <Table columns={columns} dataSource={tableRows} pagination={pagination}
                                       locale={i18n.tableLocale}></Table>
                            </Col>
                        </Row>
                    </div>
                </Spin>
            </div>
        );
    }


}
