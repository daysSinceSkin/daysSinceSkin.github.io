let ul = document.getElementById("list")
const champTemplate = a => `<img class='champIcon lazy' src="img/lazy.jpg" data-src='img/champion/${a}_0.jpg' alt="${a} Champion from league of legends"/> <br>
                            <span class="text textbg date"> ${champion[a].daysSinceLast} </span> <br/>
                            <span class="amount">${champion[a].amountSkins} <span class="skintext">total skins</span></span>
                            <ul class="text latestSkinInfo">
                              <li class="headline"> Latest Skin: </li>
                              <li> ${champion[a][0].name} </li>
                              <li class="skinReleaseDate"> ${champion[a][0].date} </li>
                            </ul>
                            </span>`

for (let c in champion) {
  champion[c].amountSkins = champion[c].length-1


  champion[c].champReleaseDate = champion[c].filter(a => a.name.includes("Original"))[0].date
  console.log(champion[c].champReleaseDate)

  // Sort is not working when a champion has an "N/A" release date, so we need to take care of these edges cases first!
  if (champion[c].some(skin => skin.date == "N/A")) {
    // find N/A skin and move it to be the first element
    let idx = champion[c].findIndex(skin => skin.date == "N/A")
    let NASkin = champion[c][idx]
    champion[c].splice(idx, 1)
    champion[c].unshift(NASkin)

    champion[c].lastDate = moment().add(1, 'months')
    champion[c].daysSinceLast = "Coming soon"
  } else {
    // sort skins by release date
    champion[c] = champion[c].sort((b,a) => new moment(a.date, "DD-MMM-YYYY") - new moment(b.date, "DD-MMM-YYYY"))

    champion[c].lastDate = champion[c][0].date
    // really dirty hack to set the "now" date to always be midnight. otherwise the difference behaves weird.
    let daysDiff = moment(moment().format("DD-MMM-YYYY"), "DD-MMM-YYYY").diff(moment(champion[c][0].date, "DD-MMM-YYYY"), 'days')
    champion[c].daysSinceLast = formatDaysText(daysDiff)
    // champion[c].relativeTime = moment(champion[c][0].date, "DD-MMM-YYYY").fromNow()
  }
  
  // append inital to DOM
  createNodes(c)
}
lazyWrapper()

// ---- functions ----  \\

function calculateChampReleaseDate(champ) {

}

function formatDaysText (days) {
  if (days == -1 ) {
    return "Tomorrow"
  } else if  ( days == 0 ) {
    return "Today"
  } else if ( days == 1 ) {
    return "Yesterday"
  } else if ( days <= -2 ) {
    return "In " + days*-1  + " days"
  } else {
    return days + " days ago"
  }
  return "Error"
}

function createNodes(c) {
    let content = document.createElement("div")
    content.classList.add("champ");
    content.innerHTML = champTemplate(c)
    ul.appendChild(content)
}

function select(selectedValue) {
  let fmt = "DD-MMM-YYYY"
  if (selectedValue == "most") sortFunc = (b,a) => champion[a].amountSkins - champion[b].amountSkins
  if (selectedValue == "least") sortFunc = (a,b) => champion[a].amountSkins - champion[b].amountSkins
  if (selectedValue == "newest") sortFunc = (b,a) => new moment(champion[a].lastDate, fmt) - new moment(champion[b].lastDate, fmt)
  if (selectedValue == "oldest") sortFunc = (a,b) => new moment(champion[a].lastDate, fmt) - new moment(champion[b].lastDate, fmt)
  // if (selectedValue == "za") sortFunc = (a,b) => a - b
  // sort function for za is broken in chrome / edge, but works in firefox...
  // that's why i use the same sort func for both az and za, but reverse the array if za is selected
  if (selectedValue == "za") sortFunc = (a,b) => a + b
  if (selectedValue == "az") sortFunc = (a,b) => a + b
  if (selectedValue == "champReleaseAsc") sortFunc = (a,b) => new moment(champion[a].champReleaseDate, fmt) - new moment(champion[b].champReleaseDate, fmt)
  if (selectedValue == "champReleaseDesc") sortFunc = (b,a) => new moment(champion[a].champReleaseDate, fmt) - new moment(champion[b].champReleaseDate, fmt)

  keySorted = Object.keys(champion).sort(sortFunc)
  ul.innerHTML = '';

  if (selectedValue == "za") {
    keySorted = keySorted.reverse()
  }

  for (let key of keySorted) {
    createNodes(key)
  }
  lazyWrapper()
}

/* --- LazyLoad ---
  lazyWrapper() invokes lazyload because a "DOMContentLoaded" EventListener
  would not work when new elements are inserted after inital load
*/
function lazyWrapper() {
  var lazyloadImages;

  if ("IntersectionObserver" in window) {
    lazyloadImages = document.querySelectorAll(".lazy");
    var imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var image = entry.target;
          image.src = image.dataset.src;
          image.classList.remove("lazy");
          imageObserver.unobserve(image);
        }
      });
    });

    lazyloadImages.forEach(function(image) {
      imageObserver.observe(image);
    });
  } else {
    var lazyloadThrottleTimeout;
    lazyloadImages = document.querySelectorAll(".lazy");

    function lazyload () {
      if(lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
      }

      lazyloadThrottleTimeout = setTimeout(function() {
        var scrollTop = window.pageYOffset;
        lazyloadImages.forEach(function(img) {
            if(img.offsetTop < (window.innerHeight + scrollTop)) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
            }
        });
        if(lazyloadImages.length == 0) {
          document.removeEventListener("scroll", lazyload);
          window.removeEventListener("resize", lazyload);
          window.removeEventListener("orientationChange", lazyload);
        }
      }, 20);
    }

    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
  }
}