let windowWidth = document.documentElement["clientWidth"];

window.onresize = function() {
    location.reload();
}

queue()
    .defer(d3.csv, "gendergap.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    let chartWidth = 300;

    if (windowWidth < 768) {
        chartWidth = windowWidth;
    }
    else {
        chartWidth = windowWidth / 5;
    }


    let countryDim = ndx.dimension(dc.pluck("country"));

    let femalePayGap = countryDim.group().reduceSum(dc.pluck("pay_gap"));

    let genderPayGap = dc.barChart("#femalePayGap");

    genderPayGap
        .width(chartWidth)
        .height(150)
        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
        .dimension(countryDim)
        .group(femalePayGap)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("country")
        .elasticY(true)
        .yAxis().ticks(4)

    dc.renderAll();
}
