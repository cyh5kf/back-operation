import React from 'react';
import { Row, Col, Icon, Table, Input, Button, Checkbox,DatePicker,Switch,Modal,Pagination,Select,message} from 'antd';
import enUS from 'antd/lib/date-picker/locale/en_US';
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
import ApplicationInfo from './ApplicationInfo'
import {AjaxUtil} from '../auth'
import {i18n} from '../../utils/i18n'
import './index.less';
const InputGroup = Input.Group;

export default class withdrawalApplication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unhandledAppCount: 0,//这个字段是计算出来的.
            handledAppCount: 0,
            totalAppCount: 0,
            totalAmount: 0,
            successPaidAmount: 0,
            withdrawalItemList: [],

            /**
             * 查询条件
             */
            queryCondition: {
                searchTimeFrom: "",
                searchTimeTo: "",
                pageNumber: 1,
                pageSize: 20,
                onlyUnhandled: true
            }
        };

    }

    /**
     * 第一次查询数据
     */
    componentWillMount() {
        this.queryWithdrawalApplicationList();
    }


    /**
     * 查询列表数据
     */
    queryWithdrawalApplicationList() {
        var that = this;
        AjaxUtil.queryWithdrawalApplicationList(that.state.queryCondition, function (d) {
            d = d || {totalAppCount: 0, handledAppCount: 0};
            d.unhandledAppCount = d.totalAppCount - d.handledAppCount;
            that.setState(d);
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


    /**
     * 时间选择发生变换
     * @param timeRange
     */
    onChangeDatePicker(timeRange) {
        var startDate = timeRange[0];
        var endDate = timeRange[1];
        this.setQueryCondition({
            searchTimeFrom: startDate,
            searchTimeTo: endDate
        });
    }


    /**
     * 点击右上角的查找按钮
     */
    onClickSearch() {
        this.queryWithdrawalApplicationList();
    }


    /**
     * 点击同意或者拒绝按钮
     * @param operationType
     * @param record
     * @param onSuccess
     */
    doRecordOperation(operationType, record, onSuccess) {

        var auditWithdrawApplyMo = {
            audit: 0,//0:申请拒绝，1:申请通过
            order_id: parseInt(record.recordId, 10), //提现记录id
            operate_id: 0,//操作客服id
            fail_reason: ''//拒绝的原因
        };

        operationType = ((operationType || "") + "").toLowerCase();
        if ('reject' === operationType) {
            auditWithdrawApplyMo['audit'] = 0;
            AjaxUtil.rejectWithdrawalApplication(auditWithdrawApplyMo, onSuccess);
        } else if ('approve' === operationType) {
            auditWithdrawApplyMo['audit'] = 1;
            AjaxUtil.approveWithdrawalApplication(auditWithdrawApplyMo, onSuccess);
        }
    }


    /**
     * 同意或拒绝一个申请
     * @param operationType
     * @param record
     */
    onClickRecordOperation(operationType, record) {
        var that = this;

        confirm({
            title: "Warning",
            content: 'Are you sure to ' + operationType + ' the application ?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                that.doRecordOperation(operationType, record, function () {
                    message.success('Operation succeeded');
                    that.queryWithdrawalApplicationList();
                });
            },
            onCancel() {
            }
        });

    }


    /**
     * 切换是否只显示未处理的按钮
     * @param checked
     */
    onChangeSwitchButton(checked) {
        this.setQueryCondition({onlyUnhandled: checked});
        this.queryWithdrawalApplicationList();
    }


    /**
     * 表格行展开
     */
    expandedRowRender(record) {
        var that = this;
        return (
            <div>
                <ApplicationInfo record={record}
                                 onClickRecordOperation={that.onClickRecordOperation.bind(that)}></ApplicationInfo>
            </div>
        );
    }


    /**
     * 表格列的定义
     */
    getTableColumns() {
        var that = this;
        return [
            {title: 'Date', dataIndex: 'applyTime', key: 'applyTime'},
            {title: 'PIXY ID', dataIndex: 'pixyId', key: 'pixyId'},
            {
                title: 'Withdrawal Amount',
                dataIndex: 'withdrawalAmount',
                key: "withdrawalAmount",
                render: function (text, record, index) {
                    var withdrawalAmount = record["withdrawalAmount"] || 0;
                    return <span>$ {withdrawalAmount}</span>
                }
            },
            {
                title: 'Status',
                dataIndex: 'handleStatus',
                key: 'handleStatus',
                render: function (text, record, index) {
                    //-1:已取消,0:待审核,1:审核成功,2:审核失败,3:已到账,4:提现失败'
                    var status = record.handleStatus;
                    if(status===-1){
                        return (<div className="Canceled" title="Canceled" >Canceled</div>);
                    }
                    if(status===0){
                        return (<div className="Unhandled" title="Unhandled">Unhandled</div>);
                    }
                    if(status===1){
                        return (<div className="Paid"      title="approved" >Paid</div>);
                    }
                    if(status===2){
                        return (<div className="Rejected"  title="rejected" >Rejected</div>);
                    }
                    if(status===3){
                        return (<div className="Paid"  title="paid successfully" >Paid</div>);
                    }
                    if(status===4){
                        return (<div className="Paid"  title="paid failed" >Paid</div>);
                    }
                    return (<div></div>);
                }
            }
        ];
    }


    /**
     * 获取分页的定义
     */
    getPagination() {
        var that = this;
        var state = that.state;

        var queryCondition = state.queryCondition;
        var totalApplicationCount = (queryCondition.onlyUnhandled ? state.unhandledAppCount : state.totalAppCount) || 0;

        return {
            total: totalApplicationCount,
            showSizeChanger: true,
            pageSize: queryCondition.pageSize,
            onShowSizeChange(current, pageSize) {
                that.setQueryCondition({
                    pageNumber: current,
                    pageSize: pageSize
                });
                that.queryWithdrawalApplicationList();
            },
            onChange(current) {
                that.setQueryCondition({
                    pageNumber: current
                });
                that.queryWithdrawalApplicationList();
            }
        };
    }

    render() {

        var that = this;
        var state = that.state;
        var columns = that.getTableColumns() || [];
        state.withdrawalItemList.forEach(function (record, i) {
            record.key = ("key_" + record.recordId + "_" + i) || ("key_" + i);
        });

        var pagination = this.getPagination();

        return (
            <div className="m-withdrawal-application">
                <Row type="flex" justify="start">
                    <Col span="24">
                        <div className="SearchBox1">
                            <span className="text">Only Show Unhandled:</span>
                            <Switch checked={state.queryCondition.onlyUnhandled}
                                    checkedChildren="Yes" unCheckedChildren="No"
                                    onChange={this.onChangeSwitchButton.bind(this)}/>
                        </div>
                        <div className="SearchBox2">
                            <RangePicker locale={{...enUS}} format="yyyy-MM-dd"
                                         style={{ width: 184 }}
                                         startPlaceholder='start date'
                                         endPlaceholder='end date'
                                         onChange={this.onChangeDatePicker.bind(this)}/>
                            <Button className="SearchButton" onClick={this.onClickSearch.bind(this)}>Search</Button>
                        </div>
                    </Col>
                </Row>
                <Row className="t-info" type="flex" justify="start">
                    <Col span="4">
                        <Row type="flex" justify="start">
                            <span className="text1">Unhandled/Total: &nbsp;</span>
                            <span className="text2">
                                {state.unhandledAppCount || 0}
                                <span> / </span>
                                {state.totalAppCount || 0}
                            </span>
                        </Row>
                    </Col>
                    <Col span="4">
                        <Row type="flex" justify="start">
                            <span className="text1">Total Amount: &nbsp;</span>
                            <span className="text2">  $ {state.totalAmount || 0}</span>
                        </Row>
                    </Col>
                    <Col span="4">
                        <Row type="flex" justify="start">
                            <span className="text1">Successfully Paid: &nbsp;</span>
                            <span className="text2">$ {state.successPaidAmount || 0}</span>
                        </Row>
                    </Col>
                </Row>
                <Row type="flex" justify="start">
                    <Col span="24">
                        <Table columns={columns}
                               locale = {i18n.tableLocale}
                               expandedRowRender={this.expandedRowRender.bind(this)}
                               dataSource={state.withdrawalItemList}
                               className="table"
                               pagination={pagination}
                        />
                    </Col>
                </Row>

            </div>
        )
    }
}