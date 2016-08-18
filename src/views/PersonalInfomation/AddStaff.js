import React from 'react'
import { Modal, Button, Form, Select, Input, Row, Col, message } from 'antd';
import './index.less'
import {AjaxUtil} from '../../views/auth'
import Session from '../../views/Session'

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

function noop() {
    return false;
}

export class AddStaff extends React.Component {
    constructor(props) {
        super(props);
        //this.state = {newpasswd: "", passwd:"", verifypasswd:""};
    }

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    setStaffVisible() {
        this.props.cancleStaffDialog();
    }

    error(text) {
        let self = this;
        Modal.error({
            title: 'warning',
            content: text,
            okText:'OK'
        });
    }

    tokenError(e) {
        var self = this;
        Modal.error({
            title: 'warning',
            content: 'Page login information has expired, please re login',
            okText: 'OK',
            onOk() {
                self.context.router.replace('/login');
                Session.setLogined(false);
            }
        });
    }

    success () {
        message.success('success add staff!');
    }

    handleSubmit(e) {
        let self = this;

        this.props.form.validateFields((errors, values) => {
            var rolename = values.select;
            if(rolename == "Customer Service") {
               rolename = 'customerService';
            } else if(rolename == "Review Report") {
               rolename = 'reviewReport';
            } else if(rolename == "Withdrawal") {
               rolename = 'withdrawal';
            } else if(rolename == "Service Clerk") {
               rolename = 'serviceClerk';
            } else if(rolename == "System Operator") {
               rolename = 'systemOperator';
            } else if(rolename == "Live Interaction") {
               rolename = 'liveInteraction';
            } else if(rolename == "Statistics") {
               rolename = 'statistics';
            }
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            } else {
                var cbsuccess = function (data, txtStatus, xhr) {
                    if (xhr.status === 200) {
                        console.log("添加用户成功", data);
                        this.props.handleAddTableData(data)
                        self.success();
                    } else if(xhr.status === 403){
                        self.error('用户所属角色权限不够，无法执行该方法');
                    } else {
                        self.error("Add user failed");
                        console.log("添加用户失败", data);
                    }
                }
                var cberror = function () {
                    self.tokenError();
                }

                if (this.props.staffDialogMode == 'ADD') {
                    AjaxUtil.register(cbsuccess.bind(this),cberror.bind(this),values.name,values.passwd,rolename);
                }
                else if (this.props.staffDialogMode == 'EDIT') {
                    AjaxUtil.modifystaff(cbsuccess.bind(this),cberror.bind(this),values.name,values.passwd,rolename);
                }
                this.props.cancleStaffDialog();

            }

        });
    }

    handleInputKeyPress (e) {
        //监听enter键
        if (e.keyCode == '13') {
            this.handleSubmit();
        }
    }


    render () {
        var addstaffVisible = this.props.addstaffVisible;
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        /**
         *  添加新用户信息时的表单属性
         */
        if (this.props.staffDialogMode == 'ADD') {
            var nameProps = getFieldProps('name', {
                rules: [
                    {required: true, message: 'Please fill in the name'},
                    // {validator: this.userExists}
                ],
            });
            var selectProps = getFieldProps('select', {
                rules: [
                    {required: true, whitespace: true, message: 'Please select permissions'}
                ],
                initialValue: 'Customer Service'
            });
            var passwdProps = getFieldProps('passwd', {
                rules: [
                    {required: true, whitespace: true, message: 'Please fill in the password'},
                    {min: 6, message: 'Password at least 6 bit'}
                ]
            });
        }
        /**
         *  编辑用户信息时的表单属性
         */
        else {
            const selectDict = {'customerService': 'Customer Service','reviewReport': 'Review Report', 'withdrawal': 'Withdrawal', 'serviceClerk': 'Service Clerk', 'systemOperator': 'System Operator','liveInteraction': 'Live Interaction'};
            var name = this.props.userData.name;
            var rolename = this.props.userData.rolename;
            var password = this.props.userData.password
            var nameProps = getFieldProps('name', {
                rules: [
                    {required: true, message: 'Please fill in the name'},
                    // {validator: this.userExists}
                ],
                initialValue: name,
            });
            nameProps.disabled = true;

            var selectProps = getFieldProps('select', {
                rules: [
                    {required: true, whitespace: true, message: 'Please select permissions'}
                ],
                initialValue: selectDict[rolename]
            });
            var passwdProps = getFieldProps('passwd', {
                rules: [
                    {required: true, whitespace: true, message: 'Please fill in the password'},
                    {min: 6, message: 'Password at least 6 bit'}
                ],
                initialValue: password
            });
        }


        return (
            <div>
                <Modal
                    title="Add Staff"
                    wrapClassName="vertical-center-modal"
                    visible={addstaffVisible}
                    onOk={this.handleSubmit.bind(this)}
                    onCancel={this.setStaffVisible.bind(this)}
                    okText="Save"
                    cancelText="Cancel">
                    <Row className="" type="flex" justify="space-around" align="middle">
                        <Col span="24" offset="2">
                            <Form form={this.props.form} horizontal>
                                <FormItem
                                    label='Email：'
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 14 }}>
                                    <Input autoComplete="off" {...nameProps} onKeyDown={this.handleInputKeyPress.bind(this)} />
                                </FormItem>
                                <FormItem
                                    label='Password：'
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 14 }}>
                                    <Input type='password' {...passwdProps} autoComplete="off"
                                           onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} onKeyDown={this.handleInputKeyPress.bind(this)} />
                                </FormItem>
                                <FormItem
                                    label="Role："
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 14 }}
                                    required>
                                    <Select
                                        {...selectProps}>
                                        <Option value="Customer Service">Customer Service</Option>
                                        <Option value="Review Report">Review Report</Option>
                                        <Option value="Withdrawal">Withdrawal</Option>
                                        <Option value="Service Clerk">Service Clerk</Option>
                                        <Option value="System Operator">System Operator</Option>
                                        <Option value="Live Interaction">Live Interaction</Option>
                                        <Option value="Statistics">Statistics</Option>
                                    </Select>
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}

AddStaff = createForm()(AddStaff);
