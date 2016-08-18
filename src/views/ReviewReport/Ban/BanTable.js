import React from 'react'
import {Table, Row, Col, Button, Icon, message, Modal, Pagination} from 'antd'
import {AjaxUtil,CheckToken} from '../../auth'
import './index.less'
const confirm = Modal.confirm;

export default class BanTable extends React.Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }


    render () {
        const queryBanColumns = [{
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text, record, index) => {
                return (
                    <div>
                        <img className="small-avatar" src={record.avatar} />
                    </div>
                )
            }
        },  {
            title: 'PIXY ID',
            dataIndex: 'uid',
            key: 'uid'
        },  {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },  {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (text, record, index) => {
                var gender = '';
                if(record.gender == 1) {
                    gender = 'female';
                } else if(record.gender == 2) {
                    gender = 'male';
                } else if(record.gender == 3) {
                    gender = 'Unspecified';
                } else if(record.gender == 0) {
                    gender = 'Not set';
                }
                return (
                    <span>{gender}</span>
                )
            }
        },  {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },  {
            title: 'Level',
            dataIndex: 'level',
            key: 'level'
        },  {
            title: 'Language',
            dataIndex: 'language',
            key: 'language'
        },  {
            title: 'Signed',
            dataIndex: 'signed',
            key: 'signed'
        },  {
            title: 'Cert',
            dataIndex: 'cert',
            key: 'cert'
        },  {
            title: 'Ban_level',
            dataIndex: 'ban_level',
            key: 'ban_level',
            render: (text, record, index) => {
                var ban_level = '';
                if(record.ban_level == 255) {
                    ban_level = 'Permanent ban';
                } 
                return (
                    <span>{ban_level}</span>
                )
            }
        }];

        const queryBanData = this.props.queryBanData;
        const pagination = this.props.pagination;

        return (
            <div className="query-signed-user">
                <Row className="queryBan_list" type="flex" justify="start">
                    <Col span="24">
                        <Table columns={queryBanColumns} dataSource={queryBanData} size="middle" className="tableStyle" pagination={pagination} />
                    </Col>
                </Row>
            </div>
        )
    }
}
