import React from 'react'
import {Table, Row, Col, Button} from 'antd'
import {AjaxUtil} from '../auth';
import './index.less'
import DateQuery from './DateQuery'
import ViewMoreButton from './ViewMoreButton'

export default class StarsReceivedRecords extends React.Component {
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
        //    key: '1',
        //        date: '2016-05-23 09:45',
        //    giftReceived: 'ydsf',
        //    starsReceived: '232',
        //    receivedFrom: 'aaa',
        //}, {
        //    key: '2',
        //        date: '2016-05-23 09:45',
        //        giftReceived: 'ydsf',
        //        starsReceived: '232',
        //        receivedFrom: 'aaa',
        //}
        }
    }

    initTable () {
        this.state.pageNumber = 1;
        this.state.pageSize = 10;
        this.state.startDate = '';
        this.state.endDate = '';
        this.state.tableData = [];
    }

    ajaxQueryUserGiftReceived (data) {
        AjaxUtil.queryUserGiftreceived(this.handleQueryUserGiftReceivedSuccess.bind(this), this.handleQueryUserGiftReceivedError.bind(this), data);
    }

    handleQueryUserGiftReceivedSuccess (data) {
        console.log('handleQueryUserRechargeSuccess', data)
        var tableData = this.state.tableData;
        for (let i=0, len=data.length; i<len; i++) {
            tableData.push({
                key: (this.state.pageNumber-1)*10 + i,
                date: data[i].date,
                giftReceived: data[i].gift_name,
                starsReceived: data[i].star,
                receivedFrom: data[i].uid,
            })
        }
        this.setState({
            tableData: tableData,
            childUpdateState: false
        })
    }

    handleQueryUserGiftReceivedError () {
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
        this.ajaxQueryUserGiftReceived(data);
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
        this.ajaxQueryUserGiftReceived(data);
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
            this.ajaxQueryUserGiftReceived(data);
        }

        const columns = [{
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },  {
            title: 'Gift Received',
            dataIndex: 'giftReceived',
            key: 'giftReceived'
        },  {
            title: 'Stars Received',
            dataIndex: 'starsReceived',
            key: 'starsReceived'
        },  {
            title: 'Received from',
            dataIndex: 'receivedFrom',
            key: 'receivedFrom'
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
