const statistics = {
    func: {
        //statistics()
        statistics: function () {
            $.get("/statistics").done(function (data) {
                var data = JSON.parse(data)
                let updatedTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
                let chart = `<p>更新时间:`+updatedTime+`</p><canvas id="myChart" width="400" height="130"></canvas>`
                $('#container').html(chart)
                const ctx = document.getElementById('myChart');
                const myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['文档', '图像', '音频', '视频'],
                        datasets: [{
                            label: '# 资源类别统计',
                            data: [data[0].count, data[1].count, data[2].count, data[3].count],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                console.log(data)
            })
        }
    }
}