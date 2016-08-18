/**
 * Created by zhengyingya on 16/7/25.
 */

import React from 'react';
//import EChart from 'rc-echarts';
import EChart from '../../components/Common/Echart';
import Theme from './EChartTheme';
import { Row, Col, Icon, Table, Select, DatePicker } from 'antd';
import './index.less';
import { Panel, PanelTool } from '../../components/Common/Panel';
import { PureTab, TabTool } from '../../components/Common/PureTab';
import TagSelect from '../../components/Common/TagSelect';
import { AjaxUtil } from '../auth';
import { dateFormat } from '../../utils/CommonUtils';
import EchartOption from '../../utils/echartOption';
import enUS from 'antd/lib/date-picker/locale/en_US';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

export default class FunctionDataChart extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            titleType: 'Event Code',            //panel显示的文字
            indicatorName: 'eventClickUserCountPerDay',                  //ajax请求的一维key
            totalType: ['page'],              //ajax请求的二维key,对应tab中的各项菜单
            tabText: [],                        //tab各菜单显示的文字
            currentReqType: '',                 //当前请求的二维key,用于获取到数据后更新对应的echart option
            panelStartDate: '',
            legendData: [],
            xAxisData: [],
            clickCountSeriesData: [],
            clickUserCountSeriesData: [],

            titleTypeOption: {},                //panel图表的option
            selEvent: '',                       //country select当前选中值
            selEventOptions: [],
        };
    }

    /**
     * 用户行为事件点击数请求
     */
    ajaxGetWithOneDimClickCount (data) {
        AjaxUtil.getDataWithOneDim(this.handleAjaxGetWithOneDimClickCount.bind(this), data);
    }
    /**
     * 用户行为事件点击用户数
     */
    ajaxGetWithOneDimClickUserCount (data) {
        AjaxUtil.getDataWithOneDim(this.handleAjaxGetWithOneDimClickUserCount.bind(this), data);
    }
    /**
     * 用户行为事件点击数请求回调
     */
    handleAjaxGetWithOneDimClickCount (data) {
        const [series, events] = this.dataAnalyse(data);

        this.setState({
            selEvent: events[0],
            selEventOptions: events,
            legendData: ['Clicks', 'Users'],
            xAxisData: data.legendData,
            clickCountSeriesData: series,
        })

        const ajaxData = {
            fromDateStr: this.state.panelStartDate,
            toDateStr: this.state.panelEndDate,
            type: this.state.totalType[0]
        };
        this.ajaxGetWithOneDimClickUserCount(Object.assign({}, ajaxData, {indicatorName: 'eventClickUserCountPerDay'}));
    }
    /**
     * 用户行为事件点击用户数请求回调
     */
    handleAjaxGetWithOneDimClickUserCount (data) {
        const [series, events] = this.dataAnalyse(data);

        const value = [this.state.clickCountSeriesData[events[0]], series[events[0]]];

        const LineOption = EchartOption.getLineOption('', ['Clicks', 'Users'], data.legendData, value);
        this.setState({
            clickUserCountSeriesData: series,
            titleTypeOption: LineOption,
        });
    }
    /**
     * 对服务端返回的绘图数据解析
     */
    dataAnalyse (data) {
        var keyDict = {};                   //存储结果数据中的所有key,并把数据初始化为0,如注册类型则遍历后的结果为{'email':'0', 'facebook':'0', 'twitter':'0', 'instagram':'0'}
        for (let k in data.timeLineData) {
            let oneData = data.timeLineData[k];
            for (let i=0, len=oneData.length; i<len; i++) {
                let data = oneData[i];
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

        let events = [];
        for (let k in keyDict) {
            events.push(k);
        }
        return [d, events]
    }

    componentWillMount () {
        var nowDate = new Date();
        const endDate = dateFormat(new Date(nowDate.valueOf() - 3600 * 24 * 1 * 1000), 'yyyy-MM-dd');       //获取当前的日期,并格式化
        var startDate = dateFormat(new Date(nowDate.valueOf() - 3600 * 24 * 15 * 1000), 'yyyy-MM-dd');      //计算开始日期,按往前15天计算
        this.state.panelStartDate = startDate;                                                              //分别设置开始日期和结束日期
        this.state.panelEndDate = endDate;

        const data = {
            fromDateStr: startDate,
            toDateStr: endDate,
            type: this.state.totalType[0]
        };
        this.ajaxGetWithOneDimClickCount(Object.assign({}, data, {indicatorName: 'eventClickCountPerDay'}));
        //this.ajaxGetWithOneDimClickUserCount(Object.assign({}, data, {indicatorName: 'eventClickUserCountPerDay'}));
    }
    /**
     * 对lineoption一些配置参数做调整
     */
    changeLineOption (lineOption, totalRegister) {
        lineOption.tooltip = {
            trigger: 'axis',
            formatter: function (params) {
                let str = '';
                for (let i in params) {
                    str += `${params[i].seriesName}: ${params[i].value} (${(((params[i].value)/totalRegister)*100).toFixed(2)}%)<br>`;
                }
                return `Total register: ${totalRegister} <br>` + str
            }
        }
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
            indicatorName: 'eventClickCountPerDay',
            fromDateStr: startDate,
            toDateStr: endDate,
            type: this.state.totalType[0]
        };
        this.ajaxGetWithOneDimClickCount(data);
        this.setState({
            titleTypeOption: {}
        });
    }
    /**
     * select选择变化回调函数
     */
    onSelect (value, option) {

        const series = [this.state.clickCountSeriesData[value], this.state.clickUserCountSeriesData[value]];               //获取对应选中国家的留存数据
        var lineOption = EchartOption.getLineOption('', this.state.legendData, this.state.xAxisData, series);

        this.setState({
            selEvent: value,
            titleTypeOption: lineOption
        })
    }

    render () {

        const optionsContent = this.state.selEventOptions.map( (data, index) => {
            return (
                <Option key={index} value={data}>{data}</Option>
            )
        });

        return (
            <div>
                <Panel title={this.state.titleType}>
                    <TagSelect
                        tag="Event Code"
                        value={this.state.selEvent}
                        options={optionsContent}
                        onSelect={this.onSelect.bind(this)}
                        showSearch={true}
                        style={{selectWidth: '200px'}}></TagSelect>
                    <div style={{display:"flex"}}>
                        <EChart options={this.state.titleTypeOption} theme={Theme} style={{flex: 1}}></EChart>
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
            </div>
        )
    }
}
