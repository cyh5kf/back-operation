import React from 'react'
import {Table, Row, Col, Button, Icon, message, Modal} from 'antd'
import {AjaxUtil,CheckToken} from '../../auth'
import ViewMoreButton from './ViewMoreButton'
import './index.less'
const confirm = Modal.confirm;

export default class RecommendList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            
        }
    }

    viewMoreClick() {
        this.props.viewMoreClick();
    }

    handleDeleteItem(record) {
        this.props.deleteItem(record);
    }

    handleEditItem(record) {
        this.props.editItem(record);
    }


    render () {
        const queryRecommendColumns = [{
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
            title: 'Order',
            dataIndex: 'order',
            key: 'order'
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
            title: 'Language',
            dataIndex: 'language',
            key: 'language'
        },  {
            title: 'Diamonds',
            dataIndex: 'diamond_amount',
            key: 'diamond_amount'
        },  {
            title: 'Stars',
            dataIndex: 'star_amount',
            key: 'star_amount'
        },  {
            title: 'Followers',
            dataIndex: 'follower_count',
            key: 'follower_count'
        },  {
            title: 'Following',
            dataIndex: 'following_count',
            key: 'following_count'
        },  {
            title: 'Earnings',
            dataIndex: 'earnings',
            key: 'earnings'
        },  {
            title: 'Level',
            dataIndex: 'level',
            key: 'level'
        },  {
            title: 'Operation',
            dataIndex: 'uid',
            key: 'delete',
            render: (text, record, index) => {
                return (
                    <span>
                        <a href="javascript:;" onClick={this.handleEditItem.bind(this,record)}>Edit</a>
                        <span className="ant-divider"></span>
                        <a href="javascript:;" onClick={this.handleDeleteItem.bind(this,record)}>Delete</a>
                    </span>
                )
            }
        }];

        const queryRecommendData = this.props.queryRecommendData;

        var viewMoreVisible = this.props.viewMoreVisible;
        if(viewMoreVisible) {
            var ViewMore = <ViewMoreButton viewMoreClick={this.viewMoreClick.bind(this)} updateState={this.props.childUpdateState}></ViewMoreButton>
        }

        return (
            <div className="query-signed-user">
                <Row className="queryRecommend_list" type="flex" justify="start">
                    <Col span="24">
                        <Table columns={queryRecommendColumns} dataSource={queryRecommendData} size="middle" className="tableStyle" pagination={false} />
                    </Col>
                </Row>
                {ViewMore}
            </div>
        )
    }
}
