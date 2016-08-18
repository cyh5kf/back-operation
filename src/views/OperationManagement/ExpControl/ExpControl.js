import React from 'react';
import { Row, Col, Input, Button} from 'antd';
import classNames from 'classnames';
import './index.less';

export default class ExpControl extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEdit: false
        };
    }

    handleEdit (e) {
        this.setState ({
            isEdit: true
        })
    }

    handlePublish (e) {
        this.setState ({
            isEdit: false
        })
    }

    render () {
        var ruleRowCls = classNames('row-cnt');

        if (this.state.isEdit) {
            var iptCls = classNames('w40');

            var rankFactorsContent = [
                <Row className={ruleRowCls} type="flex" justify="start">+<Input className={iptCls} placeholder="3"/></Row>,
                <Row className={ruleRowCls} type="flex" justify="start">+<Input className={iptCls} placeholder="3"/></Row>,
                <Row className={ruleRowCls} type="flex" justify="start">+<Input className={iptCls} placeholder="10"/></Row>,
            ];

            var autoRefreshInterval = [
                <Input className={iptCls}/>,
                <span className="ml10">minutes</span>
            ];

            var editButton = [
                <Button type="primary" onClick={this.handlePublish.bind(this)}>Publish</Button>
            ];
        }

        else {
            var rankFactorsContent = [
                <Row className={ruleRowCls} type="flex" justify="start"><span>+3</span></Row>,
                <Row className={ruleRowCls} type="flex" justify="start"><span>+3</span></Row>,
                <Row className={ruleRowCls} type="flex" justify="start"><span>+10</span></Row>,
            ];

            var autoRefreshInterval = [
                <span className="cred">2</span>,
                <span className="ml10">minutes</span>
            ];

            var editButton = [
                <Button type="primary" onClick={this.handleEdit.bind(this)}>Edit</Button>
            ];
        }

        return(
            <div className="m-exp-control">
                <Row type="flex" justify="start">
                    <Col span="24">
                        <span>EXP Increase Rule:</span>
                    </Col>
                </Row>
                <Row className="cnt" type="flex" justify="start">
                    <Col span="8">
                        <Row className={ruleRowCls} type="flex" justify="start">Watch live broadcast for 1 minute:</Row>
                        <Row className={ruleRowCls} type="flex" justify="start">Live broadcast for 1 minute:</Row>
                        <Row className={ruleRowCls} type="flex" justify="start">Present per diamond:</Row>
                    </Col>
                    <Col span="6">
                        {rankFactorsContent}
                    </Col>
                </Row>
                <Row type="flex" justify="start">
                    {editButton}
                </Row>
            </div>
        )
    }
}