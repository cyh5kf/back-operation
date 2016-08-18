import React from 'react'
import {Table, Row, Col, Button, DatePicker, Icon} from 'antd'
import enUS from 'antd/lib/date-picker/locale/en_US'
import DateQuery from './DateQuery'
import {AjaxUtil} from '../auth'
import ViewMoreButton from './ViewMoreButton'
import './index.less'

export default class RechargeRecords extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            childUpdateState: false,
            updateState: '',
            userPixyId: '',
            rechargeTableData: [],
            //    [{
            //    key: '1',
            //    date: '2016-05-23 09:45',
            //    device: 'iPhone 5',
            //    deviceId: '1E2D3F7N',
            //    purchaseType: '$0.99 for 99',
            //    diamondsBeforePurchase: '30',
            //    diamondsAfterPurchase: '30',
            //    payment: 'Visa',
            //    paymentId: 'a7@xyz.com',
            //    paymentCards: '*****2342',
            //    purchaseStatus: 'Failed',
            //    remark: 'No enough balance'
            //}]
            startDate: '',
            endDate: '',
            pageNumber: 1,
            pageSize: 10
        }
    }

    initTable () {
        this.state.pageNumber = 1;
        this.state.pageSize = 10;
        this.state.startDate = '';
        this.state.endDate = '';
        this.state.rechargeTableData = [];
    }

    ajaxQueryUserRecharge (data) {
        AjaxUtil.queryUserRecharge(this.handleQueryUserRechargeSuccess.bind(this), this.handleQueryUserRechargeError.bind(this), data);
    }

    handleQueryUserRechargeSuccess (data) {
        var rechargeTableData = this.state.rechargeTableData;
        for (let i=0, len=data.length; i<len; i++) {
            rechargeTableData.push({
                key: (this.state.pageNumber-1)*10 + i,
                date: data[i].date,
                device: data[i].device,
                deviceId: data[i].device_id,
                purchaseType: data[i].purchase_type,
                diamondsBeforePurchase: data[i].diamond_before,
                diamondsAfterPurchase: data[i].diamond_after,
                payment: data[i].payment,
                paymentId: '',
                paymentCards: '',
                purchaseStatus: data[i].status == 0 ? 'Success' : 'Failed',
                remark: ''
            })
        }
        this.setState({
            rechargeTableData: rechargeTableData,
            childUpdateState: false
        })
    }

    handleQueryUserRechargeError () {
        this.setState({
            childUpdateState: false
        })
    }

    componentWillMount () {

    }

    //shouldComponentUpdate () {
    //    this.state.pageNumber = 1;
    //    this.state.pageSize = 10;
    //    this.state.startDate = '';
    //    this.state.endDate = '';
    //    var data = {
    //        "pageNumber": this.state.pageNumber,
    //        "pageSize": this.state.pageSize,
    //        "searchText": ''+this.props.userPixyId,
    //        "searchTimeFrom": "",
    //        "searchTimeTo": ""
    //    };
    //    this.ajaxQueryUserRecharge(data);
    //}

    handleDateQuery (startDate, endDate) {
        this.initTable();
        this.state.startDate = startDate;
        this.state.endDate = endDate;
        var data = {
            "pageNumber": this.state.pageNumber,
            "pageSize": this.state.pageSize,
            "searchText": ''+this.props.userPixyId,
            "searchTimeFrom": startDate,
            "searchTimeTo": endDate
        };
        this.ajaxQueryUserRecharge(data);
    }

    viewMoreClick () {
        this.state.pageNumber ++;
        var data = {
            "pageNumber": this.state.pageNumber,
            "pageSize": this.state.pageSize,
            "searchText": ''+this.props.userPixyId,
            "searchTimeFrom": this.state.startDate,
            "searchTimeTo": this.state.endDate
        };
        this.ajaxQueryUserRecharge(data);
        this.setState({
            childUpdateState: true
        })
    }

    render () {

        if (this.props.updateState !== this.state.updateState) {
            this.state.updateState = this.props.updateState;
            this.initTable();
            var data = {
                "pageNumber": this.state.pageNumber,
                "pageSize": this.state.pageSize,
                "searchText": ''+this.props.userPixyId,
                "searchTimeFrom": "",
                "searchTimeTo": ""
            };
            this.ajaxQueryUserRecharge(data);
        }
        const rechargeColumns = [{
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '90',
        },  {
            title: 'Device',
            dataIndex: 'device',
            key: 'device',
            width: '75',
        },  {
            title: 'Device ID',
            dataIndex: 'deviceId',
            key: 'deviceId'
        },  {
            title: 'Purchase Type',
            dataIndex: 'purchaseType',
            key: 'purchaseType',
            width: '120',
            render: (text, record, index) => {
                var purchaseType = record.purchaseType;
                if (purchaseType == null)
                    purchaseType = '';
                var s = purchaseType.split(',');
                purchaseType = '';
                if (s.length == 2) {
                    purchaseType = '$' + s[1] + ' for ' + s[0];
                }
                return (
                    <div key="1">
                        <span>{purchaseType}</span>
                        <i className="u-ic u-ic-diamonds-small"></i>
                    </div>
                )
            }
        },  {
            title: 'Diamonds before Purchase',
            dataIndex: 'diamondsBeforePurchase',
            key: 'diamondsBeforePurchase'
        },  {
            title: 'Diamonds after Purchase',
            dataIndex: 'diamondsAfterPurchase',
            key: 'diamondsAfterPurchase'
        },  {
            title: 'Payment',
            dataIndex: 'payment',
            key: 'payment'
        },  {
            title: 'Payment ID',
            dataIndex: 'paymentId',
            key: 'paymentId'
        },  {
            title: 'Payment Cards',
            dataIndex: 'paymentCards',
            key: 'paymentCards'
        },  {
            title: 'Purchase Status',
            dataIndex: 'purchaseStatus',
            key: 'purchaseStatus'
        },  {
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark'
        }];

        const rechargeData = this.state.rechargeTableData;

        return (
            <div className="recharge-records">
                <div className="recharge-table">
                    <DateQuery handleSearch={this.handleDateQuery.bind(this)}></DateQuery>
                    <Row className="info" type="flex" justify="start">
                        <Col span="24">
                            <Table columns={rechargeColumns} dataSource={rechargeData} size="middle" className="tableStyle" pagination={false} />
                        </Col>
                    </Row>
                    <ViewMoreButton viewMoreClick={this.viewMoreClick.bind(this)} updateState={this.state.childUpdateState}></ViewMoreButton>
                </div>
            </div>
        )
    }
}
