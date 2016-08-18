import React from 'react'
import {Table, Row, Col, Button} from 'antd'
import {AjaxUtil} from '../auth';
import './index.less'
import DateQuery from './DateQuery'
import ViewMoreButton from './ViewMoreButton'

export default class DiamondsGiftedRecords extends React.Component {
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

    initTable () {
        this.state.pageNumber = 1;
        this.state.pageSize = 10;
        this.state.startDate = '';
        this.state.endDate = '';
        this.state.tableData = [];
    }

    ajaxQueryUserGiftsend (data) {
        AjaxUtil.queryUserGiftsend(this.handleQueryUserGiftsendSuccess.bind(this), this.handleQueryUserGiftsendError.bind(this), data);
    }

    handleQueryUserGiftsendSuccess (data) {
        var tableData = this.state.tableData;
        for (let i=0, len=data.length; i<len; i++) {
            tableData.push({
                key: (this.state.pageNumber-1)*10 + i,
                date: data[i].date,
                giftSent: data[i].gift_name,
                diamondsSpent: data[i].diamond,
                sentTo: data[i].uid,
            })
        }
        this.setState({
            tableData: tableData,
            childUpdateState: false
        })
    }

    handleQueryUserGiftsendError () {
        this.setState({
            childUpdateState: false
        })
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
        this.ajaxQueryUserGiftsend(data);
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
        this.ajaxQueryUserGiftsend(data);
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
            this.ajaxQueryUserGiftsend(data);
        }

        const columns = [{
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },  {
            title: 'Gift Sent',
            dataIndex: 'giftSent',
            key: 'giftSent'
        },  {
            title: 'Diamonds Spent',
            dataIndex: 'diamondsSpent',
            key: 'diamondsSpent'
        },  {
            title: 'Sent to',
            dataIndex: 'sentTo',
            key: 'sentTo'
        }];

        const tableData = this.state.tableData;

        return (
            <div className="exchange-records">
                <DateQuery handleSearch={this.handleDateQuery.bind(this)}></DateQuery>
                <Row className="info" type="flex" justify="start">
                    <Col span="24">
                        <Table columns={columns} dataSource={tableData} size="middle" className="tableStyle" pagination={false} />
                    </Col>
                </Row>
                <ViewMoreButton viewMoreClick={this.viewMoreClick.bind(this)} updateState={this.state.childUpdateState}></ViewMoreButton>
            </div>
        )
    }
}
