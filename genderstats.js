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



    let countryDimEducation = ndx.dimension(dc.pluck("country"));

    let femaleTertiary = countryDimEducation.group().reduceSum(dc.pluck("tertiary_f"));


    let maleTertiary = countryDimEducation.group().reduceSum(dc.pluck("tertiary_m"));

    let educationChart = dc.compositeChart("#educationByGenderRank");

    educationChart
        .width(500)
        .height(200)
        .margins({ top: 10, right: 20, bottom: 50, left: 20 })
        .dimension(countryDimEducation)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .group(femaleTertiary)
        .yAxisLabel("% with Tertiary Level Education")
        .legend(dc.legend().x(40).y(40).itemHeight(13).gap(5))
        .compose([
            dc.barChart(educationChart)
            .colors("green")
            .group(femaleTertiary, "tertiary_f"),
            dc.barChart(educationChart)
            .colors("red")
            .group(maleTertiary, "tertiary_m")
        ])
        .render()
        .yAxis().ticks(4);

    let countryDimManagement = ndx.dimension(dc.pluck("country"));

    let femaleCEOs = countryDimManagement.group().reduceSum(dc.pluck("ceo_f"));


    let maleCEOs = countryDimManagement.group().reduceSum(dc.pluck("ceo_m"));

    let managementChart = dc.compositeChart("#educationByGenderRank");

    managementChart
        .width(500)
        .height(200)
        .margins({ top: 10, right: 20, bottom: 50, left: 20 })
        .dimension(countryDimManagement)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .group(femaleCEOs)
        .yAxisLabel("% of CEOs")
        .legend(dc.legend().x(40).y(40).itemHeight(13).gap(5))
        .compose([
            dc.barChart(managementChart)
            .colors("pink")
            .group(femaleCEOs, "ceo_f"),
            dc.barChart(managementChart)
            .colors("blue")
            .group(maleCEOs, "ceo_m")
        ])
        .render()
        .yAxis().ticks(4);
        

    dc.renderAll();
}
