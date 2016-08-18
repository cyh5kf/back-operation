/**
 * Created by zhengyingya on 16/7/5.
 */

import React from 'react';
//import EChart from 'rc-echarts';
import EChart from '../../components/Common/Echart';
import Theme from './EChartTheme';
import { Row, Col, Icon, Table, Input, Button, Checkbox, Tabs, DatePicker } from 'antd';
import './index.less';
import { Panel, PanelTool } from '../../components/Common/Panel';
import { PureTab, TabTool } from '../../components/Common/PureTab';
import { AjaxUtil } from '../auth';
import { dateFormat } from '../../utils/CommonUtils';
import EchartOption from '../../utils/echartOption';
const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;
import enUS from 'antd/lib/date-picker/locale/en_US';

export default class BasicChart extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            titleType: props.titleType,         //panel显示的文字
            indicatorName: props.indicatorName, //ajax请求的一维key
            indicatorNameOneDim: props.indicatorNameOneDim,
            totalType: props.tabMenu,           //ajax请求的二维key,对应tab中的各项菜单
            tabText: props.tabText,             //tab各菜单显示的文字
            currentReqType: '',                 //当前请求的二维key,用于获取到数据后更新对应的echart option
            panelStartDate: '',
            panelEndDate: '',
            tabStartDate: '',
            tabEndDate: '',
            titleTypeOption: {},                //panel图表的option
        };
        props.tabMenu.map( (data, index) => {   //初始化tab各项的option
            this.state[data+'Pie'] = {};
        this.state[data+'Line'] = {};
    })
    }
    /**
     * 一维数据请求
     */
    ajaxGetDataWithoutDim (data) {
        AjaxUtil.getDataWithoutDim(this.handleAjaxGetDataWithoutDim.bind(this), data);
    }
    /**
     * 二维数据请求
     */
    ajaxGetWithOneDim (data) {
        AjaxUtil.getDataWithOneDim(this.handleAjaxGetWithOneDim.bind(this), data);
    }
    /**
     * 一维数据请求回调
     */
    handleAjaxGetDataWithoutDim (data) {
        var legendData = [this.state.titleType];
        if (this.state.indicatorName == 'channelViewDurationPerDay' || this.state.indicatorName == 'channelLiveDurationPerDay') {
            data.seriesData = data.seriesData.map( (data, index) => {
                return (data / (1000 * 60 * 60)).toFixed(2)
            })
        }
        var lineOption = EchartOption.getLineOption('', legendData, data.xAxisData, [data.seriesData]);
        this.setState({
            titleTypeOption: lineOption
        })
    }
    /**
     * 二维数据请求回调
     */
    handleAjaxGetWithOneDim (data) {
        var keyDict = {};                   //存储结果数据中的所有key,并把数据初始化为0,如注册类型则遍历后的结果为{'email':'0', 'facebook':'0', 'twitter':'0', 'instagram':'0'}
        for (let k in data.timeLineData) {
            let oneData = data.timeLineData[k];
            for (let i=0, len=oneData.length; i<len; i++) {
                let data = oneData[i];
                //对于注册类型的替换处理,1表示email,2表示facebook,...
                if (this.state.currentReqType == 'register_type'){
                    data.name = data.name == '1' ? 'email' : (data.name == '2' ? 'facebook' : (data.name == '3' ? 'twitter' : (data.name == '4'?'instagram': 'other') ) );
                }
                else if (this.state.currentReqType == 'gender'){
                    data.name = data.name == '0' ? 'not set' : (data.name == '1' ? 'female' : (data.name == '2' ? 'male' : 'secret' ) );
                }
                else if (this.state.currentReqType == 'dev_type'){
                    const type = {'0': 'iOS', '1': 'Android', 'IPHONE': 'iOS', 'ANDROID': 'Android'}
                    data.name = type[data.name];
                }
                else if (this.state.currentReqType == 'type' && this.state.indicatorName == 'giftCount'){
                    const type = {'0': 'gift', '1': 'danmaku'}
                    data.name = type[data.name];
                }
                else if (this.state.currentReqType == 'type' && this.state.indicatorName == 'sendMessageCountPerDay'){
                    const type = {'1': 'text', '2': 'like', '3': 'danmaku', '4': 'gift'}
                    data.name = type[data.name];
                }
                keyDict[data.name] = '0';
            }
        }

        var d = {}
        //遍历timeLineData,取出各日期对应的数据,由于后台返回的数据中,如果某项数据没有,则不会出现,如
        //{'2016-07-01':[{'name':'0', 'value': 200}]},需要利用前面的keyDict将未出现项的数据填为'0'用于绘图
        for (let k in data.timeLineData) {
            let oneData = data.timeLineData[k];
            for (let i=0, len=oneData.length; i<len; i++) {
                let data = oneData[i];
                if (this.state.indicatorName == 'channelViewDurationPerDay' || this.state.indicatorName == 'channelLiveDurationPerDay') {
                    data.value =  (data.value / (1000 * 60 * 60)).toFixed(2)
                }
                keyDict[data.name] = data.value;
            }
            for (let k in keyDict) {
                if (d[k] == undefined) {
                    d[k] = [];
                }
                d[k].push(keyDict[k]);
                keyDict[k] = '0';
            }
        }

        var keys = [];
        var values = [];
        for (let k in d) {
            keys.push(k);
            values.push(d[k]);
        }

        const LineOption = EchartOption.getLineOption('', keys, data.legendData, values)
        const PieOption = EchartOption.getPieWithTimelineOption('', data.legendData, data.timeLineData);

        var d = {};
        d[this.state.currentReqType+'Pie'] = PieOption;
        d[this.state.currentReqType+'Line'] = LineOption;
        this.setState(d)

    }

    componentWillMount () {
        var nowDate = new Date();
        const endDate = dateFormat(new Date(nowDate.valueOf() - 3600 * 24 * 1 * 1000), 'yyyy-MM-dd');          //获取当前的日期,并格式化
        var startDate = dateFormat(new Date(nowDate.valueOf() - 3600 * 24 * 15 * 1000), 'yyyy-MM-dd');      //计算开始日期,按往前15天计算
        this.state.panelStartDate = startDate;                      //分别设置开始日期和结束日期
        this.state.tabStartDate = startDate;
        this.state.panelEndDate = endDate;
        this.state.tabEndDate = endDate;

        const data = {
            fromDateStr: startDate,
            toDateStr: endDate,
        };

        this.state.currentReqType = this.state.totalType[0];
        this.ajaxGetDataWithoutDim(Object.assign({}, data, {indicatorName: this.state.indicatorName}));
        this.ajaxGetWithOneDim(Object.assign({}, data, {indicatorName: this.state.indicatorNameOneDim, type: this.state.totalType[0]}));
    }
    /**
     * 标签页切换
     */
    tabChange (index) {
        const type = this.state.totalType[index];
        const data = {
            indicatorName: this.state.indicatorNameOneDim,
            fromDateStr: this.state.tabStartDate,
            toDateStr: this.state.tabEndDate,
            type: type,
        };
        this.ajaxGetWithOneDim(data);
        this.state.currentReqType = type;
    }
    /**
     * panel组件的日期选择
     */
    panelDatePickerChange(value) {
        if (value[0] == null || value[1] == null) {
            return
        }
        const startDate = dateFormat(value[0], 'yyyy-MM-dd');
        const endDate = dateFormat(value[1], 'yyyy-MM-dd');
        this.state.panelStartDate = startDate;
        this.state.panelEndDate = endDate;
        const data = {
            indicatorName: this.state.indicatorName,
            fromDateStr: startDate,
            toDateStr: endDate,
        }
        this.ajaxGetDataWithoutDim(data);
    }
    /**
     * tab组件的日期选择
     */
    tabDatePickerChange(value) {
        if (value[0] == null || value[1] == null) {
            return
        }
        const startDate = dateFormat(value[0], 'yyyy-MM-dd');
        const endDate = dateFormat(value[1], 'yyyy-MM-dd');
        this.state.tabStartDate = startDate;
        this.state.tabEndDate = endDate;
        const data = {
            indicatorName: this.state.indicatorNameOneDim,
            fromDateStr: startDate,
            toDateStr: endDate,
            type: this.state.currentReqType
        }
        this.ajaxGetWithOneDim(data);
    }

    render () {
        var tabContent = this.state.tabText.map( (data, index) => (
            <div tab={data} key={index}>
                <EChart options={this.state[this.state.totalType[index]+'Pie']} theme={Theme} style={{marginBottom: 60}}></EChart>
                <EChart options={this.state[this.state.totalType[index]+'Line']} theme={Theme}></EChart>
            </div>
        ));
        tabContent.push(
            <TabTool key="1">
                <RangePicker
                    locale={{ ...enUS}}
                    style={{ width: 184 }}
                    startPlaceholder={this.state.tabStartDate}
                    endPlaceholder={this.state.tabEndDate}
                    onChange={this.tabDatePickerChange.bind(this)}/>
            </TabTool>
    );

        return (
            <div>
                <Panel title={this.state.titleType}>
                    <div style={{display:"flex"}}>
                        <EChart options={this.state.titleTypeOption} theme={Theme} style={{flex: 1}}></EChart>
                        <Icon className="u-icon-export" type="export"></Icon>
                    </div>
                    <PanelTool>
                        <RangePicker
                            locale={{ ...enUS}}
                            style={{ width: 184 }}
                            startPlaceholder={this.state.panelStartDate}
                            endPlaceholder={this.state.panelEndDate}
                            onChange={this.panelDatePickerChange.bind(this)}/>
                    </PanelTool>
                </Panel>
                <PureTab onChange={this.tabChange.bind(this)}>
                    {tabContent}
                </PureTab>
            </div>
        )
    }
}
