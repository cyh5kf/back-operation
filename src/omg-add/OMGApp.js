import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Affix,Row,Col,Modal,Button} from 'antd';
import OMGHeader from './OMGHeader';
import OMGSidebar from './OMGSidebar';
import 'antd/style/index.less';
import '../views/App/index.less';
import $ from "jquery";
import {AjaxUtil} from '../views/auth';
import Session from '../views/Session';

export default class OMGApp extends React.Component {
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
                <OMGHeader />
                <div className="ant-layout-body">
                    <OMGSidebar class_name={class_name}></OMGSidebar>
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

