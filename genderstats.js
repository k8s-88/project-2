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



    // -----------------------------------------------------------------------


    // --------------------EQUALITY INDEX AS PIE CHART------------------------


    // let countryDimEqualityIndex = ndx.dimension(dc.pluck("country"));

    // let indexScore = countryDimEqualityIndex.group();

    // let equalityIndex = dc.pieChart("#indexScore");

    // equalityIndex
    //     .width(chartWidth)
    //     .radius(chartWidth / 2)
    //     .group(indexScore)
    //     .dimension(countryDimEqualityIndex)



    // --------------------EQUALITY INDEX AS BAR CHART------------------------

    let countryDimEqualityIndex = ndx.dimension(dc.pluck("country"));

    let indexScore = countryDimEqualityIndex.group().reduceSum(dc.pluck("equality_index"));

    let equalityIndex = dc.barChart("#indexScore");

    equalityIndex
        .width(chartWidth)
        .height(150)
        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
        .dimension(countryDimEqualityIndex)
        .group(indexScore)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("country")
        .elasticY(true)
        .yAxis().ticks(5)

    // ---------------GENDER PAY GAP------------------------

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






    // ----------------------EDUCATION------------------------------


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
            .colors("pink")
            .group(femaleTertiary, "tertiary_f"),
            dc.barChart(educationChart)
            .colors("blue")
            .group(maleTertiary, "tertiary_m")
        ])
        .render()
        .yAxis().ticks(4);





    // --------------------MANAGEMENT---------------------------------


    let countryDimManagement = ndx.dimension(dc.pluck("country"));

    let femaleCEOs = countryDimManagement.group().reduceSum(dc.pluck("ceo_f"));

    let maleCEOs = countryDimManagement.group().reduceSum(dc.pluck("ceo_m"));

    let managementChart = dc.compositeChart("#managementByGenderRank");

    managementChart
        .width(500)
        .height(200)
        .margins({ top: 10, right: 20, bottom: 50, left: 20 })
        .dimension(countryDimManagement)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .group(maleCEOs)
        .yAxisLabel("% of CEOs")
        .legend(dc.legend().x(40).y(40).itemHeight(13).gap(5))
        .compose([
            dc.barChart(managementChart)
            .colors("blue")
            .group(maleCEOs, "ceo_m"),
            dc.barChart(managementChart)
            .colors("pink")
            .group(femaleCEOs, "ceo_f")
        ])
        .render()
        .yAxis().ticks(4);



    // -----------------------QUESTIONS------------------------------------




    let countryDimAgreement = ndx.dimension(dc.pluck("country"));

    let maleAgree = countryDimAgreement.group().reduceSum(dc.pluck("q1_agree"));

    let maleDisagree = countryDimAgreement.group().reduceSum(dc.pluck("q1_disagree"));

    let question1Chart = dc.compositeChart("#question1Rank");

    question1Chart
        .width(500)
        .height(200)
        .margins({ top: 10, right: 20, bottom: 50, left: 20 })
        .dimension(countryDimAgreement)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .group(maleAgree)
        .yAxisLabel("Responses as a %")
        .legend(dc.legend().x(40).y(40).itemHeight(13).gap(5))
        .compose([
            dc.barChart(question1Chart)
            .colors("green")
            .group(maleAgree, "q1_agree"),
            dc.barChart(question1Chart)
            .colors("red")
            .group(maleDisagree, "q1_disagree")
        ])
        .render()
        .yAxis().ticks(4);



 // ------------------------------QUESTIONS PAGE---------------------------------


    var countryNames = ndx.dimension(function(d) {
        return d["country"];
    });
    var numCountryNames = countryNames.group();

    selectField = dc.selectMenu('#country-select')
        .dimension(countryNames)
        .group(numCountryNames);




    // -----------------------------------------------------------------------




    dc.renderAll();
}
