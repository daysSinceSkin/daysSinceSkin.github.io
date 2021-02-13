let dataArr = []
let imgArr = []


for (let c in champion) {
  champion[c].amountSkins = champion[c].length-1

  // Sort is not working when a champion has an "N/A" release date, so we need to take care of these edges cases first!
  if (champion[c].some(skin => skin.date == "N/A")) {
    champion[c].lastDate = moment().add(1, 'months')
    champion[c].daysSinceLast = 0 // TODO: Just setting 0 for testing 
  } else {
    // sort skins by release date
    champion[c] = champion[c].sort((b,a) => new moment(a.date, "DD-MMM-YYYY") - new moment(b.date, "DD-MMM-YYYY"))
    champion[c].lastDate = champion[c][0].date
    // really dirty hack to set the "now" date to always be midnight. otherwise the difference behaves weird.
    champion[c].daysSinceLast = moment(moment().format("DD-MMM-YYYY"), "DD-MMM-YYYY").diff(moment(champion[c][0].date, "DD-MMM-YYYY"), 'days')
    // champion[c].relativeTime = moment(champion[c][0].date, "DD-MMM-YYYY").fromNow()
  }

  let res = { 
      "name": c, 
      data: [
          [champion[c].daysSinceLast, champion[c].amountSkins]
      ]
   }
   dataArr.push(res)
   imgArr.push('img/championIcon/'+c+'.png')
}

// ---------------------- Chart Config -----------------------\\ 
var options = {
  series: dataArr,
  chart: {
    height: 500,
    type: 'scatter',
    animations: {
      enabled: false,
    },
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    }
  },
  xaxis: {
    tickAmount: 24,
    min: 0,
    max: 1200
  },
  yaxis: {
    tickAmount: 7
  },
  markers: {
    size: 20
  },
  fill: {
    type: 'image',
    opacity: 1,
    image: {
      src: imgArr,
      width: 40,
      height: 40
    }
  },
  tooltip: {
      x: {
          formatter: (a) => "Last skin: "+ a + " days ago"
      },
      y: {
          formatter: (a) => a + " skins"
      }
  },
  legend: {
      show: false,
    labels: {
      useSeriesColors: false
    },
    markers: {
      customHTML: [
        function () {
          return ''
        }, function () {
          return ''
        }
      ]
    }
  }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

    