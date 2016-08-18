import React from 'react'
import {Table, Row, Col, Button, Icon, Checkbox} from 'antd'
import './index.less'

export default class BasicInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onChange(e) {
        console.log(`checked = ${e.target.checked}`);
    }

    render () {
        return (
            <div className="screen-shot">
                <Row type="flex" justify="start">
                    <Col span="24" className="titleHead">
                        ScreenShots
                    </Col>
                </Row>
                <Row className="content1" type="flex" justify="start">
                    <Col>
                        <img className="pic"></img>
                        <div className="item">
                            <Checkbox defaultChecked={false} onChange={this.onChange}>
                            </Checkbox>
                            <span>Select as Proof</span>
                        </div>
                    </Col>
                    <Col>
                        <img className="pic"></img>
                        <div className="item">
                            <Checkbox defaultChecked={false} onChange={this.onChange}>
                            </Checkbox>
                            <span>Select as Proof</span>
                        </div>
                    </Col>
                    <Col>
                        <img className="pic"></img>
                        <div className="item">
                            <Checkbox defaultChecked={false} onChange={this.onChange}>
                            </Checkbox>
                            <span>Select as Proof</span>
                        </div>
                    </Col>
                    <Col>
                        <img className="pic"></img>
                        <div className="item">
                            <Checkbox defaultChecked={false} onChange={this.onChange}>
                            </Checkbox>
                            <span>Select as Proof</span>
                        </div>
                    </Col>
                </Row>
                <Row className="content2" type="flex" justify="start">
                    <Col span="24">
                        Remind: you can only select 2 pictures at most as proof
                    </Col>
                </Row>
            </div>
        )
    }


}