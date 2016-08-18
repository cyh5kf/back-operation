import React from 'react'
import {Table, Row, Col, Button, Icon, message, Modal, Pagination} from 'antd'
import {AjaxUtil,CheckToken} from '../../auth'
import './index.less'
const confirm = Modal.confirm;

export default class LiveLogTable extends React.Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }


    render () {
        const queryBanColumns = [{
            title: 'Start Time (UTC)',
            dataIndex: 'startTime',
            key: 'startTime'
        },  {
            title: 'End Time (UTC)',
            dataIndex: 'endTime',
            key: 'endTime'
        },  {
            title: 'Time Length',
            dataIndex: 'totalTime',
            key: 'totalTime'
        },{
            title: 'Stars Received',
            dataIndex: 'totalStar',
            key: 'totalStar'
        }];

        const queryLiveLogData = this.props.queryLiveLogData;
        const pagination = this.props.pagination;

        return (
            <div className="query-signed-user">
                <Row className="queryBan_list" type="flex" justify="start">
                    <Col span="24">
                        <Table columns={queryBanColumns} dataSource={queryLiveLogData} size="middle" className="tableStyle" pagination={pagination} />
                    </Col>
                </Row>
            </div>
        )
    }
}
