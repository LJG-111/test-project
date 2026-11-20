 const setOptions = {
    pie_huan: (param) => {
        return {
            tooltip: {
                show: false,
            },
            //自定义中心文字
            graphic: {
                type: "text",
                left: "40%",
                top: "center",
                style: {
                    text: "占比",
                    textAlign: "center",
                    fill: "#ffffff",
                    fontSize: $fun.setRem(18),
                }
            },

            color: ['#2FFBFF', '#FFED1A', '#3D9EF4', '#FFB2E6'],
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['45%', '65%'],//环形的大小
                    center: ['45%', '50%'],//环形的位置
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            formatter: '{d}%'
                        }
                    },
                    hoverAnimation: false,
                    labelLine: {
                        normal: {
                            show: true,//不要延伸线 改为false
                            length: $fun.setRem(3),//设置延长线的长度
                            length2: $fun.setRem(3),//设置第二段延长线的长度
                        }
                    },
                    data: param
                }
            ]
        }
    }
} 

export default setOptions;