import React from 'react';
import { Row, Col, Icon, Table, Input, Button, Checkbox} from 'antd';
import './index.less';
const InputGroup = Input.Group;

export default class operationManagement extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            publishModalVisibal: false,
            value: '',
            focus: false
        };
    }

    render () {

        return(
            <div className="m-withdrawal-application">
                <Row className="t-info" type="flex" justify="start">
                    <Col span="6">
                        <Row type="flex" justify="start">
                            <span className="text1">Unhandled:</span>
                            <span className="text2">15</span>
                        </Row>
                    </Col>
                    <Col span="18">
                        <Row type="flex" justify="start">
                            <span className="text1">Total amount unhandled:</span>
                            <span className="text2">$1037.35</span>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}