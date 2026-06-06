function dashboard(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "dashboard";
    var chart_dashboard = null;
    var dateAry = null;
    var pr = null;
    var chartHash = new Object();
    var eventHandler = new Object();
    var getView;
    var cookie;
    var util;
    var LS;
    var dash_type = "";

    const xAxis = {
        type: "category",
        data: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
            22, 23, 24, 25, 26, 27, 28,
        ],
        axisLine: {
            lineStyle: {
                color: "#cecece",
                type: "solid",
                width: 2,
            },
        },
        axisTick: {
            show: false,
        },
        axisLabel: {
            textStyle: {
                color: "rgba(0, 0, 0, 0.64)",
            },
            fontSize: 11,
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: "#e0e0e0",
                width: 1,
                type: "dashed",
            },
        },
    };

    // Y-AXIS values
    const yAxis = {
        type: "value",
        axisLine: {
            lineStyle: {
                color: "#868a99",
                type: "solid",
                width: 1,
            },
        },
        axisTick: {
            show: false,
        },
        axisLabel: {
            color: "rgba(0, 0, 0, 0.64)",
            formatter: function (value, index) {
                if (value > 999999 || value < -999999) {
                    return " " + value / 1000000 + "M";
                }
                if (value > 999 || value < -999) {
                    return " " + value / 1000 + "K";
                }
                return value;
            },
            fontSize: 11,
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: "#e0e0e0",
                width: 1,
                type: "dashed",
            },
        },
    };

    _self.init=function(){
        _self.initChartData();
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        getView = parentClass.getThis("getView");
        cookie = parentClass.getThis("cookie");
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.initChartData=function(){


        chartHash["possess"] = function (labelAry, dataAry, dateAry){
            return {
                tooltip: {
                    trigger: "axis",
                    triggerOn: "mousemove|click",
                    formatter: function (params) {
                        let rez = "";
                        if (params[0].value!=""){
                            const firstSpan = () =>
                                `<div style="color: rgba(0, 0, 0, 0.56); line-height: 16px; margin-bottom: 4px;">${LS.get("dash_D")} ${params[0].dataIndex + 1} ${LS.get("dash_Ds")}</div>`;

                            const secondSpan = () =>
                                `<b style="font-size: 18px; line-height: 20px; color: rgba(0, 0, 0, .8); display:block">${dateAry[params[0].dataIndex]}</b>`;

                            const thirdSpan = () =>
                                `<div style="color: rgba(0, 0, 0, 0.56); margin-top: 16px; line-height: 16px; margin-bottom: 4px;">${params[0].seriesName}</div>`;

                            const fourthSpan = () =>
                                `<b style="font-size: 18px; line-height: 20px; color: rgba(0, 0, 0, .8); display:block">${params[0].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>`;

                            rez = `<div style="color: #000;  padding: 6px; border-radius: 5px;">
                                        ${firstSpan()}
                                        ${secondSpan()}
                                        ${thirdSpan()}
                                        ${fourthSpan()}
                                    </div>`;
                        }
                        return rez;
                    },
                    axisPointer:{
                        lineStyle:{
                            color:"#5A5D5F",
                            width:1,
                            type : "solid"
                        },
                    },
                },
                legend: {
                    show: false,
                },
                grid: {
                    left: "0",
                    right: "8px",
                    bottom: "0",
                    top: "8px",
                    containLabel: true,
                },
                xAxis: {
                    ...xAxis,
                    boundaryGap: false,
                    data: labelAry
                },
                yAxis: yAxis,
                series: [
                    {
                        name: _self.getTypeTitle('PR'),
                        type: "line",
                        smooth: true,
                        symbol: "circle",
                        symbolSize: 10,
                        lineStyle: {
                            color: "#00A1DB",
                            width: 2,
                        },
                        itemStyle: {
                            normal: {
                                color: "#00A1DB",
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "#fff"
                            },
                            emphasis: {
                                color: "#00A1DB",
                                borderWidth: 3,
                                borderStyle: "solid",
                                borderColor: "#00A1DB"
                            }
                        },
                        stateAnimation: {
                            duration: 1000,
                            easing: "cubicOut",
                        },
                        animation: "auto",
                        animationDuration: 2000,
                        animationDelay: 600,
                        data: dataAry,
                    },
                ],
            };
        };



        chartHash["members"] = function (labelAry, dataAry, dateAry){
            return {
                tooltip: {
                    trigger: "axis",
                    triggerOn: "mousemove|click",
                    axisPointer: {
                        type: "shadow",
                        shadowStyle: {
                            color: "rgba(0, 0, 0, 0.06)",
                        },
                    },
                    formatter: function (params) {
                        let rez = "";
                        if (params[0].value != "") {
                            const firstSpan = () =>
                                `<div style="color: rgba(0, 0, 0, 0.56); line-height: 16px; margin-bottom: 4px;">${LS.get("dash_D")} ${params[0].dataIndex + 1} ${LS.get("dash_Ds")}</div>`;

                            const secondSpan = () =>
                                `<b style="font-size: 18px; line-height: 20px; color: rgba(0, 0, 0, .8); display:block">${dateAry[params[0].dataIndex]}</b>`;

                            const thirdSpan = () =>
                                `<div style="color: rgba(0, 0, 0, 0.56); margin-top: 16px; line-height: 16px; margin-bottom: 4px;">${params[0].seriesName}</div>`;

                            const fourthSpan = () =>
                                `<b style="font-size: 18px; line-height: 20px; color: rgba(0, 0, 0, .8); display:block">${(params[0].value*1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>`;

                            rez = `<div style="color: #000;  padding: 6px; border-radius: 5px;">
                                        ${firstSpan()}
                                        ${secondSpan()}
                                        ${thirdSpan()}
                                        ${fourthSpan()}
                                    </div>`;
                        }
                        return rez;
                    },
                },
                legend: {
                    show: false,
                },
                grid: {
                    left: "0",
                    right: "1%",
                    bottom: "0",
                    top: "2%",
                    containLabel: true,
                },
                xAxis: {
                    ...xAxis,
                    data: labelAry
                },
                yAxis: yAxis,
                series: [
                    {
                        name: _self.getTypeTitle('MW'),
                        type: "bar",
                        barWidth: "25%",
                        barGap: "0%",
                        itemStyle: {
                            color: "#F3B932",
                        },
                        stateAnimation: {
                            duration: 1000,
                            easing: "cubicOut",
                        },
                        animation: "auto",
                        animationDuration: 1000,
                        animationDelay: 800,
                        data: dataAry,
                    },
                ],
            };
        };


        chartHash["turnover"] = function (labelAry, dataAry, dateAry){
            return {
                tooltip: {
                    trigger: "axis",
                    triggerOn: "mousemove|click",
                    formatter: function (params) {
                        let rez = "";
                        if (params[0].value != "") {
                            const firstSpan = () =>
                                `<div style="color: rgba(0, 0, 0, 0.56); line-height: 16px; margin-bottom: 4px;">${LS.get("dash_D")} ${params[0].dataIndex + 1} ${LS.get("dash_Ds")}</div>`;

                            const secondSpan = () =>
                                `<b style="font-size: 18px; line-height: 20px; color: rgba(0, 0, 0, .8); display:block">${dateAry[params[0].dataIndex]}</b>`;

                            const thirdSpan = () =>
                                `<div style="color: rgba(0, 0, 0, 0.56); margin-top: 16px; line-height: 16px; margin-bottom: 4px;">${params[0].seriesName}</div>`;

                            const fourthSpan = () =>
                                `<b style="font-size: 18px; line-height: 20px; color: rgba(0, 0, 0, .8); display:block">${params[0].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>`;

                            rez = `<div style="color: #000;  padding: 6px; border-radius: 5px;">
                                        ${firstSpan()}
                                        ${secondSpan()}
                                        ${thirdSpan()}
                                        ${fourthSpan()}
                                    </div>`;
                        }
                        return rez;
                    },
                    axisPointer: {
                        lineStyle: {
                            color: "#5A5D5F",
                            width: 1,
                            type: "solid"
                        },
                    },
                },
                legend: {
                    show: false,
                },
                grid: {
                    left: "0",
                    right: "8px",
                    bottom: "0",
                    top: "8px",
                    containLabel: true,
                },
                xAxis: {
                    ...xAxis,
                    boundaryGap: false,
                    data: labelAry
                },
                yAxis: yAxis,
                series: [
                    {
                        name: _self.getTypeTitle('TO'),
                        type: "line",
                        smooth: true,
                        symbol: "circle",
                        symbolSize: 10,
                        lineStyle: {
                            color: "#29C2CC",
                            width: 2,
                        },
                        itemStyle: {
                            normal: {
                                color: "#29C2CC",
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "#fff"
                            },
                            emphasis: {
                                color: "#29C2CC",
                                borderWidth: 3,
                                borderStyle: "solid",
                                borderColor: "#29C2CC"
                            }
                        },
                        stateAnimation: {
                            duration: 1000,
                            easing: "cubicOut",
                        },
                        animation: "auto",
                        animationDuration: 2000,
                        animationDelay: 600,
                        data: dataAry,
                    },
                ],
            };
        };

        chartHash["winloss"] = function (labelAry, dataAry, dateAry){
            return {
                tooltip: {
                    trigger: "axis",
                    triggerOn: "mousemove|click",
                    formatter: function (params) {
                        let rez = "";
                        if (params[0].value != "") {
                            const firstSpan = () =>
                                `<div style="color: rgba(0, 0, 0, 0.56); line-height: 16px; margin-bottom: 4px;">${LS.get("dash_D")} ${params[0].dataIndex + 1} ${LS.get("dash_Ds")}</div>`;

                            const secondSpan = () =>
                                `<b style="font-size: 18px; line-height: 20px; color: rgba(0, 0, 0, .8); display:block">${dateAry[params[0].dataIndex]}</b>`;

                            const thirdSpan = () =>
                                `<div style="color: rgba(0, 0, 0, 0.56); margin-top: 16px; line-height: 16px; margin-bottom: 4px;">${params[0].seriesName}</div>`;

                            const fourthSpan = () =>
                                `<b style="font-size: 18px; line-height: 20px; color: rgba(0, 0, 0, .8); display:block">${params[0].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>`;

                            rez = `<div style="color: #000;  padding: 6px; border-radius: 5px;">
                                        ${firstSpan()}
                                        ${secondSpan()}
                                        ${thirdSpan()}
                                        ${fourthSpan()}
                                    </div>`;
                        }
                        return rez;
                    },
                    axisPointer: {
                        lineStyle: {
                            color: "#5A5D5F",
                            width: 1,
                            type: "solid"
                        },
                    },
                },
                legend: {
                    show: false,
                },
                grid: {
                    left: "0",
                    right: "8px",
                    bottom: "0",
                    top: "8px",
                    containLabel: true,
                },
                xAxis: {
                    ...xAxis,
                    boundaryGap: false,
                    data: labelAry
                },
                yAxis: yAxis,
                series: [
                    {
                        name: _self.getTypeTitle('WL'),
                        type: "line",
                        smooth: true,
                        symbol: "circle",
                        symbolSize: 10,
                        lineStyle: {
                            color: "#FF4E65",
                            width: 2,
                        },
                        itemStyle: {
                            normal: {
                                color: "#FF4E65",
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "#fff"
                            },
                            emphasis: {
                                color: "#FF4E65",
                                borderWidth: 3,
                                borderStyle: "solid",
                                borderColor: "#FF4E65"
                            }
                        },
                        stateAnimation: {
                            duration: 1000,
                            easing: "cubicOut",
                        },
                        animation: "auto",
                        animationDuration: 2000,
                        animationDelay: 600,
                        data: dataAry,
                    },
                ],
            };
        };

    }

    _self.destroy=function(){
        if (chart_dashboard != null) echarts.dispose(chart_dashboard);
    }

    _self.show=function(type, mc, labelAry, dataAry, _dateAry, orgDate,click_flag){
        dateAry = _dateAry;
        dash_type = type;
        var lineChartData = chartHash[type](labelAry, dataAry, _dateAry);
        try{
            chart_dashboard = echarts.init(mc);
        }catch(e){
            chart_dashboard = null ;
        }
        if (chart_dashboard != null) _self.updatechart_dashboard(chart_dashboard, lineChartData, orgDate, click_flag);
    }

    _self.updatechart_dashboard = function (chart_dashboard, lineChartData, orgDate, click_flag) {
        chart_dashboard.setOption(lineChartData);
        if (click_flag){
            chart_dashboard.getZr().on('click', function (params) {
                if (getView().viewportwidth < 1024) return;
                // 取得座標
                const pointInPixel = [params.offsetX, params.offsetY]
                var pointInGrid = chart_dashboard.convertFromPixel({ seriesIndex: 0 }, pointInPixel)

                // x軸 索引
                var xIndex = pointInGrid[0]
                // 取得圖表的 option
                var op = chart_dashboard.getOption();
                // 取得被點的值
                var xData = op.series[0].data[xIndex];
                if (xData != "") {
                    var d = orgDate[xIndex] || "";
                    parentClass.dispatchEvent("choseDateEvent", { "date": d });
                }
            });
        }
        chart_dashboard.getZr().on('mousemove', function (params) {
            var pointInPixel = [params.offsetX, params.offsetY]
            if (chart_dashboard.containPixel('grid', pointInPixel)) {
                var pointInGrid = chart_dashboard.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
                // x軸 索引
                var xIndex = pointInGrid[0]
                // 取得圖表的 option
                var op = chart_dashboard.getOption();
                // 取得被點的值
                var xData = op.series[0].data[xIndex];
                if (xData != "") {
                    chart_dashboard.getZr().setCursorStyle('pointer');
                }
            }
        });
        chart_dashboard.getZr().on('mouseout', function (params) {
            var pointInPixel = [params.offsetX, params.offsetY]
            if (!chart_dashboard.containPixel('grid', pointInPixel)) {
                chart_dashboard.getZr().setCursorStyle('default');
            }
        });
    }

    _self.getTypeTitle=function(_type){
        var hash = new Object();
        hash["PR"] = LS.get("dash_PR");
        hash["MW"] = LS.get("dash_MW");
        hash["TO"] = LS.get("dash_TO");
        hash["WL"] = LS.get("dash_WL");
        return hash[_type]? hash[_type] : "";
    }
}