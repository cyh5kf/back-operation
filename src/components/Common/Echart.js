/**
 * Created by zhengyingya on 16/7/7.
 */

import React from 'react';
import classNames from 'classnames';
import echarts from 'echarts';
import './common.less';

export default class EChart extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        this.drawChart();
    }

    componentDidUpdate (prevProps) {
        if (JSON.stringify(prevProps.options) !== JSON.stringify(this.props.options)) {
            this.drawChart();
        }
    }

    componentWillUnmount () {
        this.chart.dispose();
    }

    isEmptyObject (o) {
        for (let k in o) {
            return false
        }
        return true
    }

    drawChart () {
        const options = this.props.options;
        const theme = this.props.theme;
        const node = this.refs.chart;
        this.chart = echarts.init(node, theme);
        if (this.isEmptyObject(options)) {
            this.chart.showLoading('', {
                text: 'Loading',
                color: '#2db7f5',
                textColor: '#2db7f5',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0
            });
        }
        else {
            this.chart.setOption(options);
        }
    }

    render () {
        var _style = this.props.style || {height: 400};
        _style.height = _style.height || 400;

        return (
            <div ref="chart" style={_style}>

            </div>
        )
    }
}

