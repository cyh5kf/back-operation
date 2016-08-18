import React from 'react';
import { Row, Col, Input, Button, Dropdown, Menu, Icon, Select} from 'antd';
import classNames from 'classnames';
import './index.less';
const Option = Select.Option;

export default class PeakHours extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEdit: false
        };
    }

    handleEdit (e) {
        this.setState ({
            isEdit: true
        })
    }

    handlePublish (e) {
        this.setState ({
            isEdit: false
        })
    }

    handleCancel (e) {
        this.setState ({
            isEdit: false
        })
    }

    handleMenuClick(e) {
        console.log('click', e);
    }

    render () {
        if (this.state.isEdit) {
            var timeNum = [];
            for (var i=0; i<24; i++) {
                timeNum.push(i);
            }
            var options = timeNum.map(function (num) {
                return (<Option key={num.toString()} value={num.toString()}>{num}</Option>)
            });
            var peakHoursContent = [
                <Select key="1" defaultValue="1" style={{width: 50}}>
                    {options}
                </Select>,
                <span key="2">:00 ~</span>,
                <Select key="3" defaultValue="1" style={{width: 50}}>
                    {options}
                </Select>,
                <span key="4">:00</span>
            ];
            var userLevelContent = [
                <span key="1">User level below</span>,
                <Input key="2" style={{width: 30}}></Input>,
                <span key="3">can't live in peak hours.</span>
            ];
            var editButton = [
                <Button key="1" type="primary" onClick={this.handlePublish.bind(this)}>Publish</Button>,
                <Button key="2" type="primary" onClick={this.handleCancel.bind(this)} style={{marginLeft: 50}}>Cancel</Button>
            ];
        }

        else {
            var peakHoursContent = [
                <span key="1">18:00 ~ 6:00</span>
            ];
            var userLevelContent = [
                <span key="1">User level below 5 can't live in peak hours.</span>
            ];
            var editButton = [
                <Button key="1" type="primary" onClick={this.handleEdit.bind(this)}>Edit</Button>
            ];
        }

        return(
            <div className="m-peak-hours">
                <Row className="row1" type="flex" justify="start">
                    <Col span="6">
                        <span>Peak Hours:</span>
                    </Col>
                    <Col className="f-vcenter" span="18">
                        {peakHoursContent}
                    </Col>
                </Row>
                <Row className="row2" type="flex" justify="start">
                    <Col span="24">
                        {userLevelContent}
                    </Col>
                </Row>
                <Row type="flex" justify="start">
                    {editButton}
                </Row>
            </div>
        )
    }
}