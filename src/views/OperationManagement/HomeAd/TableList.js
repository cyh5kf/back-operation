import React from 'react'
import classNames from 'classnames';
import {Table, Pagination, Switch} from 'antd';


export default class TableList extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
           
        };
    }

    onCopyItem(row){
        this.props.parent.onCopyItem(row);
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
                title: 'Ad name',
                dataIndex: 'ad_name',
                key: 'ad_name'
            },{
                title: 'Status',
                dataIndex: 'is_active',
                key: 'is_active',
                render: function (text, row, index) {
                    var is_active = (row['is_active'] === 1);
                    return (
                        <div>
                            <Switch checked={is_active} checkedChildren="On" unCheckedChildren="Off"
                                    onChange={that.onSwitchButtonChange.bind(that,row)}/>
                        </div>);
                }
            },{
                title: 'Country',
                dataIndex: 'country_code',
                key: 'country_code'
            },{
                title: 'Language',
                dataIndex: 'lang',
                key: 'lang'
            },{
                title: 'Picture',
                dataIndex: 'pic_url',
                key: 'pic_url',
                render: function (text, row, index) {
                    var url = row['pic_url'];
                    if (!url) {
                        return <div></div>
                    }
                    return (
                        <div>
                            <a target="_blank" href={url}>
                                <img src={url} style={{width:60,height:60}}/>
                            </a>
                        </div>);
                }
            }, {
                title: 'Ios Page Link',
                dataIndex: 'ios_page_link_url',
                key: 'ios_page_link_url'
            },{
                title: 'Android Page Link',
                dataIndex: 'android_page_link_url',
                key: 'android_page_link_url'
            },{
                title: 'App icon',
                dataIndex: 'app_logo_url',
                key: 'app_logo_url',
                render: function (text, row, index) {
                    var url = row['app_logo_url'];
                    if (!url) {
                        return <div></div>
                    }
                    return (
                        <div>
                            <a target="_blank" href={url}>
                                <img src={url} style={{width:60,height:60}}/>
                            </a>
                        </div>);
                }
            },{
                title: 'App title',
                dataIndex: 'app_title',
                key: 'app_title'
            },{
                title: 'App ios url',
                dataIndex: 'app_ios_url',
                key: 'app_ios_url'
            },{
                title: 'App android url',
                dataIndex: 'app_android_url',
                key: 'app_android_url'
            },{
                title: 'expire time(Min)',
                dataIndex: 'expire',
                key: 'expire'
            },{
                title: 'Operation',
                key: 'Operation',
                render: function (text, row, index) {
                    return (
                        <div>
                            <div>
                                <a className="tableOperation" onClick={that.onCopyItem.bind(that,row)}>Copy</a>
                            </div>
                            <span> —— </span>
                            <div>
                                <a className="tableOperation" onClick={that.onEditItem.bind(that,row)}>Edit</a>
                            </div>
                            <span> —— </span>
                            <div>
                                <a className="tableOperation" onClick={that.onDeleteItem.bind(that,row)}>Delete</a>
                            </div>
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
            <div className="scrollStyle">
                <Table columns={columns} dataSource={tableRows} pagination={pagination}
                        locale = {tableLocale}
                        scroll={{ y: 240 }}/>
            </div>
        )
    }
}
