import React, { PropTypes } from 'react'
import { Form, Input, Button, Row, Col, notification, Checkbox, Modal, Spin} from 'antd'
import {Link} from 'react-router'
import $ from "jquery"

const createForm = Form.create;
const FormItem = Form.Item;

import './index.less'
import Session from '../Session'
import {AjaxUtil} from '../../views/auth'
import CommonUtils from '../../utils/CommonUtils';

function noop() {
    return false;
}

let Login = React.createClass({
    getInitialState: function () {
        return {logining: null,  loading: false };
    },
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    error(text) {
        let self = this;
        Modal.error({
            title: 'Login failed',
            content: text,
            okText:'OK',
        });
    },

    handleSubmit(e, transition) {
        let self = this;
        this.setState({loading: true});
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                this.setState({loading: false});
            } else {
                var cbsuccess = function (cont, txtStatus, xhr) {
                    if (xhr.status != 200) {
                        var text = cont.message;
                        console.log("登录失败");
                        self.error(text);
                    } else {
                        console.log("登录成功", cont);
                        var route_path = cont.route_path;
                        Session.setLogined(true);
                        Session.setUser(cont.email);
                        this.props.route.handleLogin(route_path);
                    }
                    this.setState({loading: false});
                }
                AjaxUtil.login(cbsuccess.bind(this),values.name,values.passwd);

            }
        });
    },

    handleInputKeyPress (e) {
        //监听enter键
        if (e.keyCode == '13') {
            this.handleSubmit();
        }
    },

    userExists(rule, value, callback) {
        if (!value) {
            callback();
        } else {
            setTimeout(() => {
                if (value === 'JasonWood') {
                    callback([new Error('Sorry, the user name is occupied.。')]);
                } else {
                    callback();
                }
            }, 800);
        }
    },


    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const nameProps = getFieldProps('name', {
            rules: [
                {required: true, whitespace: true, message: 'Please fill in the Email'},
                // {validator: this.userExists},
            ],
        });
        const passwdProps = getFieldProps('passwd', {
            rules: [
                {required: true, whitespace: true, message: 'Please fill in the password'}
            ],
        });

        return (
            <Row className="login-row" type="flex" justify="space-around">
                <Col className="login-col">
                    <Spin spining={this.state.loading}>
                        <Form form={this.props.form} horizontal>
                            <div className="loginTitle">Sign in</div>
                            <div className="login-form">
                                <FormItem
                                    label='Email：'
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 14 }}
                                    help={isFieldValidating('name') ? 'Check in...' : (getFieldError('name') || []).join(', ')}
                                    
                                >
                                    <Input  {...nameProps} onKeyDown={this.handleInputKeyPress}/>
                                </FormItem>
                                <FormItem
                                    label='Password：'
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 14 }}
                                >
                                    <Input type='password' {...passwdProps} autoComplete="off"
                                           onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} onKeyDown={this.handleInputKeyPress}/>
                                </FormItem>

                                <Row>
                                    <Col span='14' offset='6'>
                                        <Button className="submitBtn" size="large" type='primary'
                                                onClick={this.handleSubmit}>Sign in</Button>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </Spin>
                </Col>
            </Row>
        );
    },
});

Login = createForm()(Login);

export default Login;