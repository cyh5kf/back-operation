import React from 'react'
import {Table, Row, Col, Button} from 'antd'
import {AjaxUtil} from '../auth';
import DateQuery from './DateQuery'
import './index.less'
import ViewMoreButton from './ViewMoreButton'

export default class WithdrawalRecords extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            updateState: '',
            childUpdateState: false,
            tableData:[],
            startDate: '',
            endDate: '',
            pageNumber: 1,
            pageSize: 10
        //{
        //        key: '1',
        //        date: '2016-05-23 09:45',
        //        device: 'iPhone 5',
        //        deviceId: '1E2D3F7N',
        //        purchaseType: '$0.99 for 99',
        //        diamondsBeforePurchase: '30',
        //        diamondsAfterPurchase: '30',
        //        payment: 'Visa',
        //        paymentId: 'a7@xyz.com',
        //        paymentCards: '*****2342',
        //        purchaseStatus: 'Failed',
        //        remark: 'No enough balance'
        //    }, {
        //        key: '2',
        //        date: '2016-05-23 09:45',
        //        device: 'iPhone 5',
        //        deviceId: '1E2D3F7N',
        //        purchaseType: '$0.99 for 99',
        //        diamondsBeforePurchase: '30',
        //        diamondsAfterPurchase: '30',
        //        payment: 'Visa',
        //        paymentId: 'a7@xyz.com',
        //        paymentCards: '*****2342',
        //        purchaseStatus: 'Failed',
        //        remark: 'No enough balance'
        //    }]
        }
    }

    initTable () {
        this.state.pageNumber = 1;
        this.state.pageSize = 10;
        this.state.startDate = '';
        this.state.endDate = '';
        this.state.tableData = [];
    }

    ajaxQueryUserWithdrawal (data) {
        AjaxUtil.queryUserWithdrawal(this.handleQueryUserWithdrawalSuccess.bind(this), this.handleQueryUserWithdrawalError.bind(this), data);
    }

    handleQueryUserWithdrawalSuccess (data) {
        var tableData = this.state.tableData;
        for (let i=0, len=data.length; i<len; i++) {
            tableData.push({
                key: (this.state.pageNumber-1)*10 + i,
                date: data[i].date,
                device: data[i].device,
                deviceId: data[i].device_id,
                starsBeforeWithdrawal: data[i].stars_before,
                earningsBeforeWithdrawal: data[i].earnings_before,
                levelBeforeWithdrawal: data[i].level,
                withdrawalLimit: data[i].limit,
                withdrawalAmount: data[i].amount,
                starsDeduction: data[i].stars_deduction,
                paypalAccount: data[i].paypal_account,

                withdrawalStatus: data[i].status == 0 ? 'Success' : 'Failed',
                remark: '',
                handler: data[i].operator,
                handlerDate: data[i].handler_date,
            })
        }
        this.setState({
            tableData: tableData,
            childUpdateState: false
        })
    }

    handleQueryUserWithdrawalError () {
        this.setState({
            childUpdateState: false
        })
    }

    componentWillMount () {
    }

    handleDateQuery (startDate, endDate) {
        this.initTable();
        this.state.startDate = startDate;
        this.state.endDate = endDate;
        var data = {
            "pageNumber": 1,
            "pageSize": 10,
            "searchText": ''+this.props.userPixyId,
            "searchTimeFrom": startDate,
            "searchTimeTo": endDate
        };
        this.ajaxQueryUserWithdrawal(data);
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
        this.ajaxQueryUserWithdrawal(data);
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
            this.ajaxQueryUserWithdrawal(data);
        }

        const rechargeColumns = [{
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },  {
            title: 'Device',
            dataIndex: 'device',
            key: 'device'
        },  {
            title: 'Device ID',
            dataIndex: 'deviceId',
            key: 'deviceId'
        },  {
            title: 'Stars before Withdrawal',
            dataIndex: 'starsBeforeWithdrawal',
            key: 'starsBeforeWithdrawals'
        },  {
            title: 'Earnings before Withdrawal',
            dataIndex: 'earningsBeforeWithdrawal',
            key: 'earningsBeforeWithdrawal'
        },  {
            title: 'Level before Withdrawal',
            dataIndex: 'levelBeforeWithdrawal',
            key: 'levelBeforeWithdrawal'
        },  {
            title: 'Withdrawal Limit',
            dataIndex: 'withdrawalLimit',
            key: 'withdrawalLimit'
        },  {
            title: 'Withdrawal Amount',
            dataIndex: 'withdrawalAmount',
            key: 'withdrawalAmount'
        },  {
            title: 'Stars Deduction',
            dataIndex: 'starsDeduction',
            key: 'starsDeduction'
        },  {
            title: 'Paypal Account',
            dataIndex: 'paypalAccount',
            key: 'paypalAccount'
        },  {
            title: 'Withdrawal Status',
            dataIndex: 'withdrawalStatus',
            key: 'withdrawalStatus'
        },  {
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark'
        },  {
            title: 'Handler',
            dataIndex: 'handler',
            key: 'handler'
        },  {
            title: 'Handler Date',
            dataIndex: 'handlerDate',
            key: 'handlerDate'
        }];

        const tableData = this.state.tableData;

        return (
            <div className="withdrawal-records">
                <DateQuery handleSearch={this.handleDateQuery.bind(this)}></DateQuery>
                <Row className="info" type="flex" justify="start">
                    <Col span="24">
                        <Table columns={rechargeColumns} dataSource={tableData} size="middle" className="tableStyle" pagination={false} />
                    </Col>
                </Row>
                <ViewMoreButton viewMoreClick={this.viewMoreClick.bind(this)} updateState={this.state.childUpdateState}></ViewMoreButton>
            </div>
        )
    }
}
