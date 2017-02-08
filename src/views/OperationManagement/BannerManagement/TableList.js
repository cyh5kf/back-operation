import React from 'react'
import classNames from 'classnames';
import {Table, Pagination, Switch} from 'antd';


export default class TableList extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
           
        };
    }

    onEditItem(row){
        this.props.parent.onEditItem(row);
    }

    onDeleteItem(row){
        this.props.parent.onDeleteItem(row);
    }

    onSwitchButtonChange(row){
        this.props.parent.onSwitchButtonChange(row);
    }

    getTableColumns() {
        var that = this;
        return [
            {
                title: 'Order',
                dataIndex: 'order_no',
                width: 60,
            },{
                title: 'Status',
                dataIndex: 'is_active',
                width: 150,
                render: function (text, row, index) {
                    var is_active = (row['is_active'] === 1);
                    return (
                        <div>
                            <Switch checked={is_active} checkedChildren="On" unCheckedChildren="Off"
                                    onChange={that.onSwitchButtonChange.bind(that,row)}/>
                        </div>);
                }
            },{
                title: 'Title',
                dataIndex: 'title'
            },{
                title: 'Banner',
                dataIndex: 'pic_url',
                render: function (text, row, index) {
                    var url = row['pic_url'];
                    if (!url) {
                        return <div></div>
                    }
                    return (
                        <div>
                            <a target="_blank" href={url}>
                                <img src={url} style={{width:140,height:40}}/>
                            </a>
                        </div>);
                }
            },{
                title: 'Link',
                dataIndex: 'link_url'
            },{
                title: 'Share Text',
                dataIndex: 'share_text_url'
            },{
                title: 'H5 Pic',
                dataIndex: 'deep_pic_url',
                render: function (text, row, index) {
                    var url = row['deep_pic_url'];
                    if (!url) {
                        return <div></div>
                    }
                    return (
                        <div>
                            <a target="_blank" href={url}>
                                <img src={url} style={{width:40,height:60}}/>
                            </a>
                        </div>);
                }
            }, {
                title: 'User ID',
                dataIndex: 'uid'
            },{
                title: 'Page Title',
                dataIndex: 'page_title'
            },{
                title: 'Language',
                dataIndex: 'lang'
            },{
                title: 'Category',
                dataIndex: 'category'
            },{
                title: 'Operation',
                dataIndex: 'id',
                width: 100,
                render: function (text, row, index) {
                    return (
                        <div>
                            <a className="tableOperation" onClick={that.onEditItem.bind(that,row)}>Edit</a>
                            <span> | </span>
                            <a className="tableOperation" onClick={that.onDeleteItem.bind(that,row)}>Delete</a>
                        </div>
                    );
                }
            }
        ];
    }

    render() {

        var that = this;
        var columns = that.getTableColumns() || [];
        var tableRows = that.props.tableRows;
        var pagination = that.props.pagination;
        var tableLocale = that.props.locale;
        return (
            <div>
                <Table columns={columns} dataSource={tableRows} pagination={pagination}
                        locale = {tableLocale}
                        scroll={{ y: 240 }}/>
            </div>
        )
    }
}
