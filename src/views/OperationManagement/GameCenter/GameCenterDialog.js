import React from 'react';
import { Row, Col, Icon, Modal, message,Input,Button, Form, Radio, Select, Upload, InputNumber} from 'antd';
import CommonUtils from '../../../utils/CommonUtils';
const FormItem = Form.Item;

export default class GameCenterDialog extends React.Component {
     constructor(props) {
        super(props);
        this.state= {
            isAddDialog:this.props.isAddDialog,
            editDialog:Object.assign({},this.props.editDialog),
            editPreviewImageVisible2:this.props.editPreviewImageVisible2,
            editPreviewImage2:this.props.editPreviewImage2,
            bannerUploading2:this.props.bannerUploading2,
            uploading:this.props.uploading,
            editDialogVisible:this.props.editDialogVisible
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isAddDialog:nextProps.isAddDialog,
            editDialog:Object.assign({},nextProps.editDialog),
            editPreviewImageVisible2:nextProps.editPreviewImageVisible2,
            editPreviewImage2:nextProps.editPreviewImage2,
            bannerUploading2:nextProps.bannerUploading2,
            uploading:nextProps.uploading,
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
        } else if (attr ==='weight'){
            this.state.editDialog[attr] = e;
        } else if (attr ==='country_code'){
            this.state.editDialog[attr] = e;
        } else if (attr ==='player_count'){
            this.state.editDialog[attr] = e;
        } else if (attr ==='operation_type'){
            this.state.editDialog[attr] = e;
        } else {
            this.state.editDialog[attr] = e.target.value;
        }
        this.setState({});
    }

    onEditOK() {
        let editDialog = this.state.editDialog;
        this.props.parent.onEditOK(editDialog);
    }

    onEditCancel() {
        this.props.parent.onEditCancel();
    }

        /**
     * 编辑对话框的上传组件
     * @param attr
     * @param url
     */
    editDialogUploadChange1(attr, url) {
        this.state.editDialog[attr] = url;
        this.setState({});
    }

    editDialogUploadChange2(attr, url, index) {
        var cover_urls = this.state.editDialog[attr];
        var new_cover_urls = [].concat(cover_urls);
        new_cover_urls[index] = url;
        this.state.editDialog[attr] = new_cover_urls;
        this.setState({});
    }

    uploadOnChange1(event) {
        var that = this;
        that.setState({bannerUploading2:(<div>uploading...</div>)});
        var status = CommonUtils.getObjectValue(event, "file.status")
        if (status === 'done') {
            var thumbUrl = CommonUtils.getObjectValue(event, "file.response.data.thumb_url");
            var url = CommonUtils.getObjectValue(event, "file.response.data.url");
            that.editDialogUploadChange1("app_logo_url", url);
            that.setState({bannerUploading2:null});
            that.setState({
                editPreviewImage2: url,
                editPreviewImageVisible2: true
            });
        }
    }


    uploadOnChange2(event) {
        var that = this;
        that.setState({uploading:(<div>uploading...</div>)});
        var status = CommonUtils.getObjectValue(event, "file.status")
        if (status === 'done') {
            var thumbUrl = CommonUtils.getObjectValue(event, "file.response.data.thumb_url");
            var url = CommonUtils.getObjectValue(event, "file.response.data.url");
            that.editDialogUploadChange2("cover_urls", url, 0);
            that.setState({uploading:null});
        }
    }


    uploadOnChange3(event) {
        var that = this;
        that.setState({uploading:(<div>uploading...</div>)});
        var status = CommonUtils.getObjectValue(event, "file.status")
        if (status === 'done') {
            var thumbUrl = CommonUtils.getObjectValue(event, "file.response.data.thumb_url");
            var url = CommonUtils.getObjectValue(event, "file.response.data.url");
            that.editDialogUploadChange2("cover_urls", url, 1);
            that.setState({uploading:null});
        }
    }


    uploadOnChange4(event) {
        var that = this;
        that.setState({uploading:(<div>uploading...</div>)});
        var status = CommonUtils.getObjectValue(event, "file.status")
        if (status === 'done') {
            var thumbUrl = CommonUtils.getObjectValue(event, "file.response.data.thumb_url");
            var url = CommonUtils.getObjectValue(event, "file.response.data.url");
            that.editDialogUploadChange2("cover_urls", url, 2);
            that.setState({uploading:null});
        }
    }

    renderCoverImg() {
        let that = this;
        let cover_urls = that.state.editDialog.cover_urls || {};
        let imgList = [];
        let JointImgStyle2 = {
            width: 80,
            height: 80
        };
        if(cover_urls) {
            for (let key = 0;key<cover_urls.length;key++) {
                if(cover_urls[key]) {
                    imgList.push(
                        <div className="jointUpload2">
                            <img key={key} src={cover_urls[key]} style={JointImgStyle2} alt=""/>
                        </div>
                    );
                } else {
                    imgList.push(
                        <div className="jointUpload2"></div>
                    );
                }
            }
            return (<div>{imgList}</div>);
        } else {
            return <span></span>
        }
    }

    render() {

        var that = this;

        var editDialog = that.state.editDialog || {};
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 15}
        };
        const formItemLayout1 = {
            labelCol: {span: 7},
            wrapperCol: {span: 16}
        };

        var imagesTypeList = ['image/jpeg', "image/png"];

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

        var uploadProps3 = {
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
                that.uploadOnChange3(event);
            }
        };

        var uploadProps4 = {
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
                that.uploadOnChange4(event);
            }
        };


        var bannerImgStyle1 = {
            display: this.state.editPreviewImageVisible2 ? "block" : "none",
            width: 80,
            height: 80
        };

        var isAddDialog = this.state.isAddDialog;
        var operation_type = this.state.editDialog.operation_type;
        var isShowJointStyle = {
            display: operation_type === "Joint" ? "block" : "none"
        }

        return (
            <div>
                <Modal title={isAddDialog?"Add GameCenter":"Edit GameCenter"} visible={this.state.editDialogVisible}
                       width={700}
                       onOk={this.onEditOK.bind(this)}
                       onCancel={this.onEditCancel.bind(this)}
                       okText='OK' cancelText='Cancel'>
                    <Form horizontal onSubmit={this.onEditOK.bind(this)}>
                        <FormItem required  {...formItemLayout} label="App title :&nbsp;">
                            <Input type="text" value={editDialog.app_title}
                                   onChange={this.editDialogInputChange.bind(this,"app_title")}/>
                        </FormItem>
                        <FormItem required {...formItemLayout} label="Weight :&nbsp;">
                            <InputNumber value={editDialog.weight} min="0" max="100"
                                         onChange={this.editDialogInputChange.bind(this,"weight")}/>
                        </FormItem>
                        <FormItem required {...formItemLayout} label="Country code :&nbsp;">
                            <InputNumber value={editDialog.country_code}
                                         onChange={this.editDialogInputChange.bind(this,"country_code")}/>
                        </FormItem>
                        <FormItem required {...formItemLayout} label="Language :&nbsp;">
                            <Select style={{ width: 120 }} value={editDialog.lang} onChange={this.editDialogInputChange.bind(this,"lang")}>
                                <Option value="en">en</Option>
                                <Option value="ar">ar</Option>
                                <Option value="es">es</Option>
                            </Select>
                        </FormItem>
                        <FormItem required  {...formItemLayout} label="App abstract :&nbsp;">
                            <Input type="text" value={editDialog.app_abstract}
                                   onChange={this.editDialogInputChange.bind(this,"app_abstract")}/>
                        </FormItem>
                        <FormItem required {...formItemLayout} label="App icon: ">
                            <div className="bannerUpload0">
                                <div className="bannerUpload1">
                                    <Upload {...uploadProps1}>
                                        <Button type="ghost">
                                            <Icon type="upload"/> Upload
                                        </Button>
                                    </Upload>
                                </div>
                                <div className="bannerUpload2">
                                    <img src={this.state.editPreviewImage2} style={bannerImgStyle1}/>
                                </div>
                                {this.state.bannerUploading2}
                                <div className="clearfix"></div>
                            </div>
                        </FormItem>
                        <FormItem required {...formItemLayout} label="player count :&nbsp;">
                            <InputNumber value={editDialog.player_count}
                                         onChange={this.editDialogInputChange.bind(this,"player_count")}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="Game Type :&nbsp;">
                            <Select style={{ width: 120 }} value={editDialog.operation_type} onChange={this.editDialogInputChange.bind(this,"operation_type")}>
                                <Option value="">empty</Option>
                                <Option value="CAP">CAP</Option>
                                <Option value="Joint">Joint</Option>
                            </Select>
                        </FormItem>
                        <FormItem {...formItemLayout1} label="Joint pic :&nbsp;" style={isShowJointStyle}>
                            <div className="jointUpload0">
                                <div className="jointUpload1">
                                    <Upload {...uploadProps2}>
                                        <Button type="ghost">
                                            <Icon type="upload"/> Upload
                                        </Button>
                                    </Upload>
                                </div>
                                <div className="jointUpload1">
                                    <Upload {...uploadProps3}>
                                        <Button type="ghost">
                                            <Icon type="upload"/> Upload
                                        </Button>
                                    </Upload>
                                </div>
                                <div className="jointUpload1">
                                    <Upload {...uploadProps4}>
                                        <Button type="ghost">
                                            <Icon type="upload"/> Upload
                                        </Button>
                                    </Upload>
                                </div>
                                {this.state.uploading}
                                {this.renderCoverImg()}
                                <div className="clearfix"></div>
                            </div>
                        </FormItem>
                        <FormItem {...formItemLayout} label="App ios url :&nbsp;" >
                            <Input type="text" value={editDialog.app_ios_url}
                                   onChange={this.editDialogInputChange.bind(this,"app_ios_url")}/>
                            <span>ios url and android url fill in at least one!</span>
                        </FormItem>
                        <FormItem {...formItemLayout} label="ios protocol header :&nbsp;">
                            <Input type="text" value={editDialog.app_ios_open}
                                   onChange={this.editDialogInputChange.bind(this,"app_ios_open")}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="App android url :&nbsp;">
                            <Input type="text" value={editDialog.app_android_url}
                                   onChange={this.editDialogInputChange.bind(this,"app_android_url")}/>
                            <span>ios url and android url fill in at least one!</span>
                        </FormItem>
                        <FormItem {...formItemLayout} label="android package name :&nbsp;">
                            <Input type="text" value={editDialog.app_android_open}
                                   onChange={this.editDialogInputChange.bind(this,"app_android_open")}/>
                        </FormItem>
                        
                    </Form>
                </Modal>
            </div>
        );
    
    }

}

GameCenterDialog = Form.create()(GameCenterDialog);