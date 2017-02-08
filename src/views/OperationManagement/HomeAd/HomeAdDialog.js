import React from 'react';
import { Row, Col, Icon, Modal, message,Input,Button, Form, Radio, Select, Upload, InputNumber} from 'antd';
import CommonUtils from '../../../utils/CommonUtils';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

export default class HomeAdDialog extends React.Component {
     constructor(props) {
        super(props);
        this.state= {
            isAddDialog:this.props.isAddDialog,
            editDialog:this.props.editDialog,
            editPreviewImageVisible1:this.props.editPreviewImageVisible1,
            editPreviewImageVisible2:this.props.editPreviewImageVisible2,
            editDialogRadioValue:this.props.editDialogRadioValue,
            editPreviewImage1:this.props.editPreviewImage1,
            editPreviewImage2:this.props.editPreviewImage2,
            bannerUploading1:this.props.bannerUploading1,
            bannerUploading2:this.props.bannerUploading2,
            editDialogVisible:this.props.editDialogVisible
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isAddDialog:nextProps.isAddDialog,
            editDialog:Object.assign({},nextProps.editDialog),
            editPreviewImageVisible1:nextProps.editPreviewImageVisible1,
            editPreviewImageVisible2:nextProps.editPreviewImageVisible2,
            editDialogRadioValue:nextProps.editDialogRadioValue,
            editPreviewImage1:nextProps.editPreviewImage1,
            editPreviewImage2:nextProps.editPreviewImage2,
            bannerUploading1:nextProps.bannerUploading1,
            bannerUploading2:nextProps.bannerUploading2,
            editDialogVisible:nextProps.editDialogVisible
        });
    }

    /**
     * 编辑对话框的输入按钮
     * @param a
     * @param b
     * @param c
     */
    editDialogInputChange(attr,e) {
        if (attr ==='lang'){
            this.state.editDialog[attr] = e;
        } else if (attr ==='country_code'){
            this.state.editDialog[attr] = e;
        } else if (attr ==='expire'){
            this.state.editDialog[attr] = e;
        }else {
            this.state.editDialog[attr] = e.target.value;
        }
        this.setState({});
    }

    onEditOK() {
        let isAddDialog = this.state.isAddDialog;
        if(isAddDialog) { //如果是添加弹窗，则将过期时间选项默认设置为60分钟
            this.state.editDialog.expire = 60;
            this.setState({});
        }
        let editDialog = this.state.editDialog;
        this.props.parent.onEditOK(editDialog);
    }

    onEditCancel() {
        this.props.parent.onEditCancel();
    }

    /**
     * 编辑对话框单选按钮Change
     */
    editDialogRadioChange(attr,e) {
        this.state.editDialog.type = e.target.value;
        this.setState({
            editDialogRadioValue: e.target.value
        });
    }

        /**
     * 编辑对话框的上传组件
     * @param attr
     * @param url
     */
    editDialogUploadChange(attr, url) {
        this.state.editDialog[attr] = url;
        this.setState({});
    }

        /*
    *上传组件修改后事件
    *
    */
    uploadOnChange1(event) {
        var that = this;
        that.setState({bannerUploading1:(<div>uploading...</div>)});
        var status = CommonUtils.getObjectValue(event, "file.status");
        if (status === 'done') {
            var thumbUrl = CommonUtils.getObjectValue(event, "file.response.data.thumb_url");
            var url = CommonUtils.getObjectValue(event, "file.response.data.url");
            that.editDialogUploadChange("pic_url", url);
            that.setState({bannerUploading1:null});
            that.setState({
                editPreviewImage1: url,
                editPreviewImageVisible1: true
            });
        }
    }

    uploadOnChange2(event) {
        var that = this;
        that.setState({bannerUploading2:(<div>uploading...</div>)});
        var status = CommonUtils.getObjectValue(event, "file.status")
        if (status === 'done') {
            var thumbUrl = CommonUtils.getObjectValue(event, "file.response.data.thumb_url");
            var url = CommonUtils.getObjectValue(event, "file.response.data.url");
            that.editDialogUploadChange("app_logo_url", url);
            that.setState({bannerUploading2:null});
            that.setState({
                editPreviewImage2: url,
                editPreviewImageVisible2: true
            });
        }
    }

    render() {

        var that = this;

        var editDialog = that.state.editDialog || {};
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14}
        };

        var imagesTypeList = ['image/jpeg', "image/png", "image/gif"];
        var uploadProps1 = {
            showUploadList: false,
            action: '/upload/file5/upload/official.json?type=image',
            beforeUpload(file) {
                var fileType = file.type;
                const isImg = (imagesTypeList.indexOf(fileType) >= 0);
                if (!isImg) {
                    message.error('只能上传 JPG,PNG 文件哦！');
                }
                return isImg;
            },
            onChange: function (event, b, c, d) {
                that.uploadOnChange1(event);
            }
        };

        var uploadProps2 = {
            showUploadList: false,
            action: '/upload/file5/upload/official.json?type=image',
            beforeUpload(file) {
                var fileType = file.type;
                const isImg = (imagesTypeList.indexOf(fileType) >= 0);
                if (!isImg) {
                    message.error('只能上传 JPG,PNG 文件哦！');
                }
                return isImg;
            },
            onChange: function (event, b, c, d) {
                that.uploadOnChange2(event);
            }
        };

        var bannerImgStyle1 = {
            display: this.state.editPreviewImageVisible1 ? "block" : "none",
            width: 160,
            height: 100
        };

        var bannerImgStyle2 = {
            display: this.state.editPreviewImageVisible2 ? "block" : "none",
            width: 80,
            height: 80
        };


        var radioContent = null;
        var isAddDialog = this.state.isAddDialog;
        if (this.state.editDialogRadioValue === 1) {
            radioContent = (
                <div>
                    <div className="bannerUpload0">
                        <div className="bannerUpload1">
                            <span>icon</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Upload {...uploadProps2}>
                                <Button type="ghost">
                                    <Icon type="upload"/> Upload
                                </Button>
                            </Upload>
                        </div>
                        <div className="bannerUpload2">
                            <img src={this.state.editPreviewImage2} style={bannerImgStyle2}/>
                        </div>
                        {this.state.bannerUploading2}
                        <div className="clearfix"></div>
                    </div>
                    <div style={{height:20}}></div>
                    <div style={{width:300}}>
                        <InputGroup size="large" required>
                            <Col span="6">
                                <span className="marginRight" style={{display:'inline-block'}}>title</span>
                            </Col>
                            <Col span="18">
                                <Input className="" value={editDialog.app_title}
                                       onChange={this.editDialogInputChange.bind(this,"app_title")}/>
                            </Col>
                        </InputGroup>
                    </div>
                    <div style={{height:20}}></div>
                    <div style={{width:300}}>
                        <InputGroup size="large" required>
                            <Col span="6">
                                <span style={{display:'inline-block'}}>ios link</span>
                            </Col>
                            <Col span="18">
                                <Input className="" value={editDialog.app_ios_url}
                                       onChange={this.editDialogInputChange.bind(this,"app_ios_url")}/>
                                <span>ios url and android url fill in at least one!</span>
                            </Col>
                        </InputGroup>
                    </div>
                    <div style={{height:20}}></div>
                    <div style={{width:300}}>
                        <InputGroup size="large" required>
                            <Col span="6">
                                <span style={{display:'inline-block'}}>android link</span>
                            </Col>
                            <Col span="18">
                                <Input className="" value={editDialog.app_android_url}
                                       onChange={this.editDialogInputChange.bind(this,"app_android_url")}/>
                                <span>ios url and android url fill in at least one!</span>
                            </Col>
                        </InputGroup>
                    </div>
                </div>
            );
        } else {
            radioContent = (
                <div>
                    <div style={{width:300}}>
                        <InputGroup size="large">
                            <Col span="9">
                                <span style={{display:'inline-block'}}>ios page link</span>
                            </Col>
                            <Col span="15">
                                <Input className="" value={editDialog.ios_page_link_url}
                                    onChange={this.editDialogInputChange.bind(this,"ios_page_link_url")}/>
                                <span>ios page link and android page link fill in at least one!</span>
                            </Col>
                        </InputGroup>
                    </div>
                    <div style={{height:20}}></div>
                    <div style={{width:300}}>
                        <InputGroup size="large">
                            <Col span="9">
                                <span style={{display:'inline-block'}}>android page link</span>
                            </Col>
                            <Col span="15">
                                <Input className="" value={editDialog.android_page_link_url}
                                    onChange={this.editDialogInputChange.bind(this,"android_page_link_url")}/>
                                <span>ios page link and android page link fill in at least one!</span>
                            </Col>
                        </InputGroup>
                    </div>
                </div>
            );
        }


        return (
            <div>
                <Modal title={isAddDialog?"Add HomeAd":"Edit HomeAd"} visible={this.state.editDialogVisible}
                       width={700}
                       onOk={this.onEditOK.bind(this)}
                       onCancel={this.onEditCancel.bind(this)}
                       okText='OK' cancelText='Cancel'>
                    <Form horizontal onSubmit={this.onEditOK.bind(this)}>
                        <FormItem required  {...formItemLayout} label="Ad name :&nbsp;">
                            <Input type="text" value={editDialog.ad_name}
                                   onChange={this.editDialogInputChange.bind(this,"ad_name")}/>
                        </FormItem>
                        <FormItem required {...formItemLayout} label="Country code :&nbsp;">
                            <InputNumber value={editDialog.country_code}
                                         onChange={this.editDialogInputChange.bind(this,"country_code")}/>
                        </FormItem>
                        <FormItem required {...formItemLayout} label="Expire time :&nbsp;">
                            <InputNumber value={isAddDialog? 60: editDialog.expire}
                                 min={0}
                                 onChange={this.editDialogInputChange.bind(this,"expire")}/>Min
                        </FormItem>
                        <FormItem required {...formItemLayout} label="Language :&nbsp;">
                            <Select style={{ width: 120 }} value={editDialog.lang} onChange={this.editDialogInputChange.bind(this,"lang")}>
                                <Option value="en">en</Option>
                                <Option value="ar">ar</Option>
                                <Option value="es">es</Option>
                            </Select>
                        </FormItem>
                        <FormItem required {...formItemLayout} label="Picture :&nbsp;">
                            <div className="bannerUpload0">
                                <div className="bannerUpload1">
                                    <Upload {...uploadProps1}>
                                        <Button type="ghost">
                                            <Icon type="upload"/> Upload
                                        </Button>
                                    </Upload>
                                </div>
                                <div className="bannerUpload2">
                                    <img src={this.state.editPreviewImage1} style={bannerImgStyle1}/>
                                </div>
                                {this.state.bannerUploading1}
                                <div className="clearfix"></div>
                            </div>
                        </FormItem>
                        <FormItem {...formItemLayout} label="Jump Option :&nbsp;">
                            <RadioGroup onChange={this.editDialogRadioChange.bind(this,'type')}
                                        value={this.state.editDialogRadioValue}>
                                <Radio key="1" value={1}>App</Radio>
                                <Radio key="0" value={0}>Link</Radio>
                            </RadioGroup>
                            {radioContent}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    
    }

}

HomeAdDialog = Form.create()(HomeAdDialog);