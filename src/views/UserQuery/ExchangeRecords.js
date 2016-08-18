import React from 'react'
import {Table, Row, Col, Button} from 'antd'
import {AjaxUtil} from '../auth';
import DateQuery from './DateQuery'
import './index.less'
import ViewMoreButton from './ViewMoreButton'

export default class ExchargeRecords extends React.Component {
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
        }
    }

    datePickerChange () {

    }

    initTable () {
        this.state.pageNumber = 1;
        this.state.pageSize = 10;
        this.state.startDate = '';
        this.state.endDate = '';
        this.state.tableData = [];
    }

    ajaxQueryUserExchange (data) {
        AjaxUtil.queryUserExchange(this.handleQueryUserExchangeSuccess.bind(this), this.handleQueryUserExchangeError.bind(this), data);
    }

    handleQueryUserExchangeSuccess (data) {
        var tableData = this.state.tableData;
        for (let i=0, len=data.length; i<len; i++) {
            tableData.push({
                key: (this.state.pageNumber-1)*10 + i,
                date: data[i].date,
                device: data[i].device,
                deviceId: data[i].device_id,
                exchangeType: data[i].exchange_type,
                starsBeforeExchange: data[i].stars_before,
                diamondsBeforeExchange: data[i].diamonds_before,
                starsafterExchange: data[i].stars_after,
                diamondsAfterExchange: data[i].diamonds_after,
                exchangeStatus: data[i].status == 0 ? 'Success' : 'Failed',
                remark: ''
            })
        }
        this.setState({
            tableData: tableData,
            childUpdateState: false
        })
    }

    handleQueryUserExchangeError () {
        this.setState({
            childUpdateState: false
        })
    }

    componentWillMount () {
        //var data = {
        //    "pageNumber": 1,
        //    "pageSize": 10,
        //    "searchText": ''+this.props.userPixyId,
        //    "searchTimeFrom": "",
        //    "searchTimeTo": ""
        //};
        //this.ajaxQueryUserExchange(data);
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
        this.ajaxQueryUserExchange(data);
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
        this.ajaxQueryUserExchange(data);
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
            this.ajaxQueryUserExchange(data);
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
            title: 'Exchange Type',
            dataIndex: 'exchangeType',
            key: 'exchangeType',
            render: (text, record, index) => {
                var exchangeType = record.exchangeType;
                if (exchangeType == null)
                    exchangeType = '';
                var s = exchangeType.split(',');
                exchangeType = '';
                if (s.length == 2) {
                    exchangeType = '$' + s[0] + 'for' + s[1];
                }
                return (
                    <div key="1">
                        <span>{exchangeType}</span>
                        <i className="u-ic u-ic-diamonds-small"></i>
                    </div>
                )
            }
        },  {
            title: 'Stars before Exchange',
            dataIndex: 'starsBeforeExchange',
            key: 'starsBeforeExchange'
        },  {
            title: 'Diamonds before Exchange',
            dataIndex: 'diamondsBeforeExchange',
            key: 'diamondsBeforeExchange'
        },  {
            title: 'Stars after Exchange',
            dataIndex: 'starsafterExchange',
            key: 'starsafterExchange'
        },  {
            title: 'Diamonds after Exchange',
            dataIndex: 'diamondsAfterExchange',
            key: 'diamondsAfterExchange'
        }, {
            title: 'Exchange Status',
            dataIndex: 'exchangeStatus',
            key: 'exchangeStatus'
        },  {
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark'
        }];

        const tableData = this.state.tableData;

        return (
            <div className="exchange-records">
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
