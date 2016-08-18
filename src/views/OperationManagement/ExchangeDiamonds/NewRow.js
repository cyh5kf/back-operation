import React from 'react';
import { Row, Col, Input, Button, Checkbox, Menu, Icon, Select} from 'antd';
import classNames from 'classnames';
import './index.less';

export default class NewRow extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    diamondInputChange (e) {
        this.props.diamondInputChange(this.props.rowIndex, parseFloat(e.target.value));
    }

    checkboxChange(e) {
        this.props.checkboxChange(this.props.rowIndex, e.target.checked ? 1 : 0);
    }

    priceInputChange (e) {
        this.props.priceInputChange(this.props.rowIndex, parseFloat(e.target.value));
    }

    deleteBtn (e) {
        this.props.deleteBtn(this.props.rowIndex);
    }

    render () {

        return(
            <div className="m-new-row m-new-row-1">
                <Row className="wrap f-vcenter" type="flex" justify="start">
                    <Col className="u-dia f-vcenter">
                        <i className="u-ic u-ic-diamonds-normal"></i>
                        <Input className="text" onChange={this.diamondInputChange.bind(this)}></Input>
                    </Col>
                    <Col className="f-vcenter">
                        <Checkbox defaultChecked={false} onChange={this.checkboxChange.bind(this)}>Checkbox</Checkbox>
                    </Col>
                    <Col className="hot f-vcenter f-hcenter">
                        HOT
                    </Col>
                    <Col className="u-tbox u-tbox-2 f-vcenter f-hcenter">
                        <Input className="sta-ipt" onChange={this.priceInputChange.bind(this)}></Input>
                        Stars
                    </Col>
                    <Col className="btn">
                        <a onClick={this.deleteBtn.bind(this)}>
                            Delete
                        </a>
                    </Col>
                </Row>
            </div>
        )
    }
}