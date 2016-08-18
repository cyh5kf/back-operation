import React from 'react';
import { Row, Col, Input, Button, Dropdown, Menu, Icon, Select, Modal } from 'antd';
import classNames from 'classnames';
import ViewRow from './ViewRow'
import EditRow from './EditRow'
import NewRow from './NewRow'
import './index.less';
import {AjaxUtil} from '../../../views/auth';
const Option = Select.Option;

export default class View extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEdit: false,
            newRow: [],
            tableData: [],
        };
    }

    errorModal (text) {
        Modal.error({
            title: 'Error',
            content: text,
            okText:'OK'
        });
    }

    /**
     *  ajax 获取所有数据
     */
    ajaxQueryCashChargeProduct () {
        AjaxUtil.queryCashChargeProduct(this.handleAjaxQueryCashChargeProduct.bind(this), this.props.challenge);
    }
    /**
     *  ajax 修改数据
     */
    ajaxPublishCashChargeProduct (data) {
        AjaxUtil.publishCashChargeProduct(this.handleAjaxPublishCashChargeProduct.bind(this), data);
    }

    handleAjaxQueryCashChargeProduct (data) {
        console.log('-----', data)
        this.setState({
            tableData: data,
        })
    }

    handleAjaxPublishCashChargeProduct (data) {
        console.log('-----', data)
        this.setState({
            tableData: data,
        })
    }


    componentWillMount () {
        this.ajaxQueryCashChargeProduct();
    }

    handleEdit (e) {
        this.setState ({
            isEdit: true
        });
    }

    handlePublish (e) {
        for (let i=0, len=this.state.newRow.length; i<len; i++) {
            let data = this.state.newRow[i];
            if (data.diamonds_amount == '' || data.price == '') {
                this.errorModal('Input can not be empty');
                return
            }
            this.state.newRow[i].product_id = 'tv.pixy.live.diamond' + data.diamonds_amount + data.channel;
        }

        var data = this.state.tableData.concat(this.state.newRow);
        console.log(data)
        this.ajaxPublishCashChargeProduct(data);
        this.setState ({
            isEdit: false,
            newRow: [],
        });
    }

    handleCancel (e) {
        this.ajaxQueryCashChargeProduct();
        this.setState ({
            isEdit: false,
            newRow: [],
        });
    }

    handleAddItem (e) {
        var newRow = {}
        for (let k in this.state.tableData[0]) {
            newRow[k] = this.state.tableData[0][k];
        }
        newRow.diamonds_amount = '';
        newRow.price = '';
        newRow.tag = 0;
        newRow.product_id = '';
        this.setState({
            newRow: this.state.newRow.concat([newRow])
        });
    }

    /**
     *  editRow 组件的回调
     */
    editRowCheckboxChange (rowIndex, value) {
        this.state.tableData[rowIndex].tag = value;
    }

    editRowInputChange (rowIndex, value) {
        this.state.tableData[rowIndex].donate_diamonds_amount = value;
    }

    editRowDeleteBtn (rowIndex) {
        //this.state.updateTableData.splice(rowIndex, 1);
        //console.log('========---', rowIndex, this.state.tableData)
        this.state.tableData.splice(rowIndex, 1);
        console.log('========', rowIndex, this.state.tableData)
        this.setState({
            tableData: this.state.tableData
        })
    }

    /**
     *  newRow 组件的回调
     */
    newRowCheckboxChange (rowIndex, value) {
        this.state.newRow[rowIndex].tag = value;
    }

    newRowDiamondInputChange (rowIndex, value) {
        this.state.newRow[rowIndex].diamonds_amount = value;
    }

    newRowdonateInputChange (rowIndex, value) {
        this.state.newRow[rowIndex].donate_diamonds_amount = value;
    }

    newRowPriceInputChange (rowIndex, value) {
        this.state.newRow[rowIndex].price = value;
    }

    newRowDeleteBtn (rowIndex) {
        this.state.newRow.splice(rowIndex, 1);
        console.log(this.state.newRow)
        this.setState({
            newRow: this.state.newRow
        })
    }

    render () {
        if (this.state.isEdit) {

            var rowContent = this.state.tableData.map( (data, index) => {
                if (index <= 4) {
                    return (
                        <Row key={index} type="flex" justify="start">
                            <EditRow rowIndex={index} data={data}
                                     checkboxChange={this.editRowCheckboxChange.bind(this)}
                                     inputChange={this.editRowInputChange.bind(this)}>
                            </EditRow>
                        </Row>
                    )
                }
                else {
                    return (
                        <Row key={index} type="flex" justify="start">
                            <EditRow rowIndex={index} data={data}
                                     checkboxChange={this.editRowCheckboxChange.bind(this)}
                                     inputChange={this.editRowInputChange.bind(this)}>
                            </EditRow>
                            <Col className="f-vcenter" style={{fontSize: 18, marginLeft: 20}}>
                                <a onClick={this.editRowDeleteBtn.bind(this, index)}>
                                    Delete
                                </a>
                            </Col>

                        </Row>
                    )
                }

            });

            var newRowContent = this.state.newRow.map( (data, index) => {
                return (
                    <Row key={index} className="mb30" type="flex" justify="start">
                        <NewRow rowIndex={index}
                                checkboxChange={this.newRowCheckboxChange.bind(this)}
                                diamondInputChange={this.newRowDiamondInputChange.bind(this)}
                                donateInputChange={this.newRowdonateInputChange.bind(this)}
                                priceInputChange={this.newRowPriceInputChange.bind(this)}
                                deleteBtn={this.newRowDeleteBtn.bind(this)}>
                        </NewRow>
                    </Row>
                )
            });
            var userLevelContent = [
                <span key="1">User level below</span>,
                <Input key="2"style={{width: 30}}></Input>,
                <span key="3">can't live in peak hours.</span>
            ];
            var addButton = [
                <Col key="1">
                    <a onClick={this.handleAddItem.bind(this)}>
                        <Icon type="plus-circle-o" className="plusIcon" />
                        <span className="ml10">Add New</span>
                    </a>
                </Col>
            ];
            var editButton = [
                <Button key="1" type="primary" onClick={this.handlePublish.bind(this)}>Publish</Button>,
                <Button key="2" type="primary" onClick={this.handleCancel.bind(this)} style={{marginLeft: 50}}>Cancel</Button>
            ];
        }

        else {
            var rowContent = this.state.tableData.map( (data, index) => (
                <Row key={index} type="flex" justify="start">
                    <ViewRow data={data}></ViewRow>
                </Row>
            ));

            var newRowContent = null;
            var userLevelContent = [
                <span key="1">User level below 5 can't live in peak hours.</span>
            ];
            var addButton = null;
            var editButton = [
                <Button key="1" type="primary" onClick={this.handleEdit.bind(this)}>Edit</Button>
            ];
        }

        return(
            <div className="m-purchase-diamonds">
                {rowContent}
                {newRowContent}
                <Row className="abtn u-addbtn f-hcenter" type="flex" justify="start">
                    {addButton}
                </Row>
                <Row className="ebtn" type="flex" justify="start">
                    {editButton}
                </Row>
            </div>
        )
    }
}