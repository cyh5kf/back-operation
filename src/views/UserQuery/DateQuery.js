import React from 'react'
import {Row, Col, Button, DatePicker, Modal} from 'antd'
import './index.less'
import enUS from 'antd/lib/date-picker/locale/en_US';

export default class DateQuery extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            startDate: '',
            endDate: ''
        };
    }

    errorModal (text) {
        Modal.error({
            title: 'Warning',
            content: text,
            okText:'OK'
        });
    }

    /**
     *  获取开始日期
     */
    dateStartChange (value, dateString) {
        //this.state.startDate = dateString;
        const Y = value.getFullYear() + '-';
        const M = (value.getMonth() + 1 < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1) + '-';
        const d = (value.getDate() - 1 < 10 ? '0' + (value.getDate() - 1) : value.getDate() - 1);
        this.state.startDate = Y + M + d;
    }
    /**
     *  获取结束日期
     */
    dateEndChange (value) {
        const Y = value.getFullYear() + '-';
        const M = (value.getMonth() + 1 < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1) + '-';
        const d = (value.getDate() - 1 < 10 ? '0' + (value.getDate() - 1) : value.getDate() - 1);
        this.state.endDate = Y + M + d;
    }

    /**
     *  对选择的日期进行判断,不允许日期为空或开始日期大于结束日期
     */
    checkDate () {
        if (this.state.startDate == '') {
            this.errorModal('Please choose the start date');
            return false
        }
        else if (this.state.endDate == '') {
            this.errorModal('Please choose the end date');
            return false
        }
        else if (this.state.startDate > this.state.endDate) {
            this.errorModal('The start date must be less than the end date');
            return false
        }
        return true
    }
    /**
     *  搜索回调
     */
    searchBtnClick () {
        if (!this.checkDate()) {
            return
        }
        this.props.handleSearch(this.state.startDate, this.state.endDate);
    }

    render () {
        return (
            <Row className="m-date-query" type="flex" justify="start">
                <Col className="dp1">
                    <DatePicker locale={{ ...enUS}} onChange={this.dateStartChange.bind(this)} placeholder="Start Date"></DatePicker>
                </Col>
                <span className="text f-vcenter">To</span>
                <Col className="dp2">
                    <DatePicker locale={{ ...enUS}} onChange={this.dateEndChange.bind(this)} placeholder="End Date"></DatePicker>
                </Col>
                <Col className="btn">
                    <Button onClick={this.searchBtnClick.bind(this)}>Search</Button>
                </Col>
            </Row>
        )
    }
}
