import React from 'react'
import classNames from 'classnames';
import { Row, Col, Icon, Table, Pagination, Modal, message,Input,Button,Spin,Form,Radio,Select,Upload,Switch,InputNumber} from 'antd';
import {i18n} from '../../../utils/i18n'
import {AjaxUtil} from '../../auth';
import './index.less';
import TableList from './TableList';
import HomeAdDialog from './HomeAdDialog';
import SearchInput from '../../../components/Common/SearchInput';

/**
 * Banner 管理功能
 */
export default class HomeAd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableRows: [],
            tableTotalCount: 0,
            loading: false,
            editDialogVisible: false,
            editDialog: {},
            editPreviewImage1: "",
            editPreviewImageVisible1: false,
            editPreviewImage2: "",
            editPreviewImageVisible2: false,
            isAddDialog: '',

            queryCondition: {
                pageSize: 20,
                pageNumber: 1,
                status: ''
            }
        };
    }

    /**
     * 初始化编辑对话框的数据
     */
    initEditDialog() {

        var editDialog = this.state.editDialog || {};
        var pic_url = editDialog.pic_url;
        var app_logo_url = editDialog.app_logo_url;
        var type = editDialog.type;
        editDialog.lang = editDialog.lang;
        this.setState({
            editPreviewImage1: pic_url,
            editPreviewImageVisible1: (!!pic_url),
            bannerUploading1:null,
            bannerUploading2:null,
            editPreviewImage2: app_logo_url,
            editPreviewImageVisible2: (!!app_logo_url),
            editDialogRadioValue: type
        });
    }

    /**
     * 点击表格中的Switch按钮
     * @param row
     * @param checked
     */
    onSwitchButtonChange(row) {
        var that = this;
        var tips = '';
        var checked = row.is_active;
        if(!checked){
            tips='Are you sure you want to send this banner to all user ?';
        }else {
            tips='Are you sure you want to remove this online banner?';
        }

        Modal.confirm({
            title: 'Warning',
            content: tips,
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                row.is_active = checked ? 0 : 1;
                that.setState({loading: true});
                AjaxUtil.updateSomaHomeAd(row, function () {
                    that.setState({loading: false});
                });
            },
            onCancel() {}
        });

    }


    /**
     * 第一次查询数据
     */
    componentWillMount() {
        this.queryTableContent();
    }

    /**
     * 点击表格后面的删除按钮
     * @param row
     */
    onDeleteItem(row) {
        var that = this;
        Modal.confirm({
            title: 'Warning',
            content: 'Are you sure you want  to delete this banner and all its related information?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                //delete the item
                that.setState({loading: true});
                AjaxUtil.deleteSomaHomeAd(row.ad_id, function () {
                    message.success('delete successfully');
                    //re query
                    that.queryTableContent();
                });
            },
            onCancel() {
            }
        });
    }

    /**
     * 点击表格后面的编辑按钮
     * @param row
     */
    onEditItem(row) {
        this.state.editDialog = row;
        this.initEditDialog();
        this.setState({editDialogVisible: true, isAddDialog: false});
    }

    /**
     * 点击表格后面的copy按钮
     * @param row
     */
    onCopyItem(row) {
        this.state.editDialog = row;
        this.initEditDialog();
        this.setState({editDialogVisible: true, isAddDialog: true});
    }

    /**
     * 查询表格中的数据
     */
    queryTableContent() {
        var that = this;
        that.setState({loading: true});
        AjaxUtil.querySomaHomeAdList(this.state.queryCondition, function (data) {
            var rows = data.rows || [];
            rows.forEach(function (row, i) {
                row.key = row.ad_id || ("key_" + i);
            });
            that.setState({tableRows: rows, tableTotalCount: data.totalCount, loading: false});
        }, function () {
            that.setState({loading: false});
        });
    }

    /**
     * 设置查询条件
     * @param condition
     */
    setQueryCondition(condition) {
        var queryCondition = this.state.queryCondition;
        queryCondition = Object.assign({}, queryCondition, condition);
        this.state.queryCondition = queryCondition;
        this.setState({
            queryCondition: queryCondition
        });
    }

    /**
     * 状态筛选
     * @param condition
     */
    changeSelectFilter(attr, e){
        if(attr === "status") {
            this.setQueryCondition({
                pageNumber:1,
                status: e,
                countrycode: '',
                lang: ''
            });
            this.refs.SearchInput.clearValue();
        } else if(attr === "country") {
            this.setQueryCondition({
                pageNumber:1,
                countrycode: e,
                status: '',
                lang: ''
            });
        } else if(attr === "lang") {
            this.setQueryCondition({
                pageNumber:1,
                lang: e,
                countrycode: '',
                status: ''
            });
            this.refs.SearchInput.clearValue();
        } else if (attr === "emptyfilter") {
            this.setQueryCondition({
                pageNumber:1,
                pageSize:20,
                lang: '',
                countrycode: '',
                status: ''
            });
            this.refs.SearchInput.clearValue();
        }
        
        this.queryTableContent();
    }

    /**
     * 点击添加banner按钮
     */
    onClickAddBanner() {
        this.state.editDialog = {type: 1};
        this.initEditDialog();
        this.setState({editDialogVisible: true, isAddDialog: true});
    }


    validateEditDialog(editDialog) {
        if(!editDialog.ad_name || editDialog.ad_name.trim().length===0){
            message.error("Ad name cannot empty !");
            return false;
        }

        if (!editDialog.country_code && editDialog.country_code !== 0) {
            message.error("Country code cannot empty !");
            return false;
        }

        if (!editDialog.expire && editDialog.expire !== 0) {
            message.error("Expire time cannot empty !");
            return false;
        }

        if (!editDialog.lang && editDialog.lang !== 0) {
            message.error("Language cannot empty !");
            return false;
        }

        if (!editDialog.pic_url || editDialog.pic_url.trim().length === 0) {
            message.error("Picture cannot empty !");
            return false;
        }

        if(editDialog.type===0){
            if(!editDialog.ios_page_link_url && !editDialog.android_page_link_url){
                message.error("ios page link and android page link fill in at least one!");
                return false;
            }
        } else {
            if(!editDialog.app_ios_url && !editDialog.app_android_url) {
                message.error("ios url and android url fill in at least one!");
                return false;
            }
        }

        return true;
    }


    /**
     * 编辑按钮的确定
     */
    onEditOK(editDialog) {
        var that = this;
        var isOK = that.validateEditDialog(editDialog);

        if (isOK) {

            var ios_page_link_url = editDialog.ios_page_link_url;
            if(!ios_page_link_url){
                editDialog.ios_page_link_url = "";
            }

            var android_page_link_url = editDialog.android_page_link_url;
            if(!android_page_link_url){
                editDialog.android_page_link_url = "";
            }

            var app_logo_url = editDialog.app_logo_url;
            if(!app_logo_url){
                editDialog.app_logo_url = "";
            }

            var app_title = editDialog.app_title;
            if(!app_title){
                editDialog.app_title = "";
            }

            var app_ios_url = editDialog.app_ios_url;
            if(!app_ios_url){
                editDialog.app_ios_url = "";
            }

            var app_android_url = editDialog.app_android_url;
            if(!app_android_url){
                editDialog.app_android_url = "";
            }

            var is_active = editDialog.is_active;
            if(!is_active){
                editDialog.is_active = "";
            }

            var expire = editDialog.expire;
            if(!expire){
                editDialog.expire = "";
            }

            var isp = editDialog.isp;
            if(!isp){
                editDialog.isp = "";
            }

            that.setState({editDialogVisible: false, loading: true});
            let isAddDialog = this.state.isAddDialog;
            if(isAddDialog) {
                editDialog.ad_id = "";
                editDialog.is_active = 0;
                AjaxUtil.addSomaHomeAd(editDialog, function () {
                    message.success('add successfully');
                    that.queryTableContent();
                });
            } else {
                AjaxUtil.updateSomaHomeAd(editDialog, function () {
                    message.success('saved successfully');
                    that.queryTableContent();
                });
            }
            
        }
    }

    /**
     * 编辑按钮的取消
     */
    onEditCancel() {
        this.setState({editDialogVisible: false});
    }

    render() {

        var that = this;
        var tableRows = this.state.tableRows || [];
        var pagination = {
            total: that.state.tableTotalCount || 0,
            showSizeChanger: true,
            pageSize: that.state.queryCondition.pageSize,
            onShowSizeChange(current, pageSize) {
                that.setQueryCondition({
                    pageNumber:current,
                    pageSize:pageSize
                });
                that.queryTableContent();
            },
            onChange(current) {
                that.setQueryCondition({
                    pageNumber:current
                });
                that.queryTableContent();
            }
        };

        return (
            <div>
                <Spin spining={this.state.loading} tip="loading...">
                    <div>
                        <Row type="flex" justify="start">
                            <Col span="24" className="titleHead">
                                SOMA Home Advertisement
                            </Col>
                        </Row>
                        <div style={{ height: 20 }}></div>
                        <Row type="flex" justify="start">
                            <Col span="20">
                                <Row className="search" type="flex" justify="start">
                                    <Col span="7">
                                        Search by status:&nbsp;&nbsp;&nbsp;
                                            <Select style={{ width: 120 }} value={that.state.queryCondition.status}
                                                    onChange={this.changeSelectFilter.bind(this,"status")}>
                                                <Option value="">ALL</Option>
                                                <Option value="0">OFF</Option>
                                                <Option value="1">ON</Option>
                                            </Select>
                                    </Col>
                                    <Col span="6">
                                        <SearchInput ref="SearchInput" placeholder="Search by country code" onSearch={this.changeSelectFilter.bind(this,"country")} style={{ width: 200 }} />
                                    </Col>
                                    <Col span="8">
                                        Search by language:&nbsp;&nbsp;&nbsp;
                                            <Select style={{ width: 120 }} value={that.state.queryCondition.lang}
                                                    onChange={this.changeSelectFilter.bind(this,"lang")}>
                                                <Option value="en">en</Option>
                                                <Option value="ar">ar</Option>
                                                <Option value="es">es</Option>
                                            </Select>
                                    </Col>
                                    <Col span="3">
                                        <Button type="primary" onClick={this.changeSelectFilter.bind(this,"emptyfilter")}>Empty filter</Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span="4">
                                <div className="bannerAddBtn">
                                    <Button type="ghost" onClick={this.onClickAddBanner.bind(this)}>+ Add
                                        HomeAd</Button>
                                </div>
                            </Col>
                        </Row>
                        <div style={{ height: 20 }}></div>
                        <TableList tableRows={tableRows} pagination={pagination}
                               locale = {i18n.tableLocale}  parent={this}
                               scroll={{ y: 240 }} ></TableList>
                    </div>
                </Spin>

                <div>
                    <HomeAdDialog parent={this}
                                  isAddDialog={this.state.isAddDialog}
                                  editDialog={this.state.editDialog} 
                                  editPreviewImageVisible1={this.state.editPreviewImageVisible1} 
                                  editPreviewImageVisible2={this.state.editPreviewImageVisible2} 
                                  editDialogRadioValue={this.state.editDialogRadioValue}
                                  editPreviewImage1={this.state.editPreviewImage1}
                                  editPreviewImage2={this.state.editPreviewImage2}
                                  bannerUploading1={this.state.bannerUploading1}
                                  bannerUploading2={this.state.bannerUploading2}
                                  editDialogVisible={this.state.editDialogVisible}
                    ></HomeAdDialog>
                </div>
            </div>
        )
    }
}
