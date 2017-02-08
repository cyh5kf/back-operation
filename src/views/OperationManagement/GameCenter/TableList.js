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
                title: 'Order',
                dataIndex: 'weight',
                key: 'weight',
                width: 50
            },{
                title: 'title',
                dataIndex: 'app_title',
                key: 'app_title',
                width: 50
            },{
                title: 'Status',
                dataIndex: 'is_active',
                key: 'is_active',
                width: 100,
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
                key: 'country_code',
                width: 50
            },{
                title: 'Language',
                dataIndex: 'lang',
                key: 'lang',
                width: 50
            },{
                title: 'icon',
                dataIndex: 'app_logo_url',
                key: 'app_logo_url',
                width: 50,
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
                title: 'abstract',
                dataIndex: 'app_abstract',
                key: 'app_abstract',
                width: 100
            },{
                title: 'ios url',
                dataIndex: 'app_ios_url',
                key: 'app_ios_url',
                width: 100
            },{
                title: 'ios open',
                dataIndex: 'app_ios_open',
                key: 'app_ios_open',
                width: 100
            },{
                title: 'android url',
                dataIndex: 'app_android_url',
                key: 'app_android_url',
                width: 100
            },{
                title: 'android open',
                dataIndex: 'app_android_open',
                key: 'app_android_open',
                width: 100
            },{
                title: 'Player count',
                dataIndex: 'player_count',
                key: 'player_count',
                width: 100
            },{
                title: 'Game Type',
                dataIndex: 'operation_type',
                key: 'operation_type',
                width: 50
            }, {
                title: 'Joint Pic',
                dataIndex: 'cover_urls',
                key: 'cover_urls',
                width: 50,
                render: (text, row, index) => {
                    if (text){
                        let imgList = [];
                        for (let key in text) {
                            imgList.push(<img className="jointPic" key={key} src={text[key]} alt=""/>);
                        }
                        return(<span>{imgList}</span>);
                    }else {
                        return <span></span>
                    }
                }
            }, {
                title: 'Operation',
                key: 'Operation',
                width: 100,
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
                        locale = {tableLocale}/>
            </div>
        )
    }
}
