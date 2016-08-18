/**
 * Created by zhengyingya on 16/7/4.
 */

/**
 *根据数据返回不同类型echart的option
 */
export default class EchartOption {
    static getLineOption = (title, legendData, xAxisData, seriesData) => {
        if (legendData.length != seriesData.length) {
            return {}
        }

        return ({
            title: {
                text: title,
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: legendData,
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxisData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: seriesData.map( (data, index) => (
            {
                name: legendData[index],
                type: 'line',
                data: data,

            }
            ))
        })
    }

    static getLineWithTimelineOption = (title, legendData = null, seriesData) => {
        var series = [];
        for (let k in seriesData) {
            var nameData = seriesData[k].map( (data, index) => (
                data.name
            ))
            series.push({
                legend: {
                    data: nameData
                },
                series : [
                    {
                        name: '',
                        center: ['50%', '45%'],
                        radius: '50%',
                        type: 'pie',
                        data: seriesData[k]
                    }
                ]
            })
        }
        return {
            baseOption: {
                timeline : {
                    show : legendData == null || legendData.length <= 1 ? false : true,
                    data : legendData,
                },
                title : {
                    text: title,
                    subtext: '',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{c}"
                },
                toolbox: {
                    show : true,
                    feature : {
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
            },
            options: series
        }
    }
    /**
     *  带时间轴的饼图
     */
    static getPieWithTimelineOption = (title, legendData = null, seriesData) => {
        var series = [];
        for (let k in seriesData) {
            var nameData = seriesData[k].map( (data, index) => (
                data.name
            ))
            series.push({
                legend: {
                    data: nameData
                },
                series : [
                    {
                        name: '',
                        center: ['50%', '45%'],
                        radius: '50%',
                        type: 'pie',
                        data: seriesData[k]
                    }
                ]
            })
        }
        return {
            baseOption: {
                timeline : {
                    show : legendData == null || legendData.length <= 1 ? false : true,
                    data : legendData,
                    label: {
                        formatter : function(s) {
                            const date = new Date(s)
                            const month = date.getMonth()<9?'0'+(date.getMonth()+1):(date.getMonth()+1);
                            const day = date.getDate()<10?'0'+date.getDate():date.getDate();
                            return month+'-'+day;
                        }
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{c}"
                    },
                    currentIndex: series.length-1,
                    symbolSize: 10,
                    checkpointStyle: {
                        symbolSize: 10,
                        color: '#d87a80',
                        borderColor: '#d87a80'
                    },
                    left: '5%',
                    right: '5%',
                },
                title : {
                    text: title,
                    subtext: '',
                    x:'center'
                },
                toolbox: {
                    show : true,
                    feature : {
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)"
                },
                calculable : true,
            },
            options: series
        }
    }
}

