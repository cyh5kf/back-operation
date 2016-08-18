import React from 'react'
import classNames from 'classnames';
import { Row, Col, Icon, Table, Pagination, Modal, message,Input,Button,Spin,Form,Radio,Select,Upload,Switch,InputNumber} from 'antd';


export default React.createClass({
    getInitialState() {
        return {
        };
    },

    render() {
        return (
            <div>
                <Row type="flex" justify="start">
                    <Col span="24" className="titleHead">
                        {this.props.title || this.props.children}
                    </Col>
                </Row>
                <div style={{ height: 20 }}></div>
            </div>
        );
    }
});
