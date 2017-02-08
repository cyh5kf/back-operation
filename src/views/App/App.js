import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Affix,Row,Col,Modal,Button} from 'antd';

import NavPath from '../NavPath/NavPath'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'

import 'antd/style/index.less'
import './index.less'
import $ from "jquery"
import {AjaxUtil} from '../../views/auth'
import Session from '../../views/Session'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            hideStatus: false 
        }
    }

    static propTypes = {
        user: PropTypes.object,
        children: PropTypes.node.isRequired,
    };

    static contextTypes = {
        history: PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
    }

    error(e) {
        var self = this;
        Modal.error({
            title: '注意',
            content: 'Page login information has expired, please re login',
            okText: 'OK',
            onOk() {
                self.context.router.replace('/login');
                Session.setLogined(false);
            },
        });
    }

    componentWillMount() {

    }

    componentDidMount() {
        var cbsuccess = function (cont, txtStatus, xhr) {
            if (xhr.status === 200) {

            }

        }
        var cberror = function () {
            this.error();
        }
        //AjaxUtil.checkToken(cbsuccess.bind(this), cberror.bind(this));
    }

    openHide_click() {
        var hideStatus = this.state.hideStatus;
        if (hideStatus) {
            this.setState({hideStatus: false});
        } else {
            this.setState({hideStatus: true});
        }
    }

    render() {
        var hideStatus = this.state.hideStatus;
        var class_name = hideStatus?"ant-layout-siderbar sider-bar-hiddle":"ant-layout-siderbar sider-bar-open";
        var btn_arrow = hideStatus?"btn_openHide arrow-rt":"btn_openHide arrow-lt";
        var btn_conten_arrow = hideStatus?"btn_content content-rt":"btn_content content-lt";
        return (
            <div className="ant-layout-aside">
                <Header />
                <div className="ant-layout-body">
                    <Sidebar sidebarMenu={this.props.route.sidebarMenu} class_name={class_name}></Sidebar>
                    <div className="ant-layout-main">
                        <div className="ant-layout-content">
                            {this.props.children}
                        </div>
                        <div className={btn_conten_arrow} onClick={this.openHide_click.bind(this)} >
                            <div className={btn_arrow}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default App;