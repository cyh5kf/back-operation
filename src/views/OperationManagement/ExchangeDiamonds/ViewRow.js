import React from 'react';
import { Row, Col, Input, Button, Icon, Checkbox} from 'antd';
import classNames from 'classnames';
import './index.less';

export default class ViewRow extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    checkboxChange (e) {
        this.props.checkboxChange(this.props.rowIndex, e.target.checked ? 1 : 0);
    }

    render () {
        const data = this.props.data;

        var checkBox = null;
        if (this.props.isEdit) {
            checkBox = [
              <Checkbox defaultChecked={data.tag==0?false:true} onChange={this.checkboxChange.bind(this)}></Checkbox>
            ];
        }

        var hotContent = <Col style={{width: 60, marginRight: 30, marginLeft: 10}}></Col>;
        if (this.props.isEdit || data.tag == 1) {
            hotContent = <Col className="hot f-vcenter f-hcenter">HOT</Col>;
        }

        return(
            <div className="m-view-row m-view-row-1">
                <Row className="wrap f-vcenter" type="flex" justify="start">
                    <Col className="u-dia icn f-vcenter">
                        <i className="u-ic u-ic-diamonds-normal"></i>
                        <span className="text">{data.diamond_amount}</span>
                    </Col>
                    <Col>
                        {checkBox}
                    </Col>
                    {hotContent}
                    <Col className="u-tbox u-tbox-1 f-vcenter f-hcenter">
                        {data.price + ' Stars'}
                    </Col>
                </Row>
            </div>
        )
    }
}