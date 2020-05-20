let ul = document.getElementById("list")
const champTemplate = a => `<img class='champIcon lazy' src="img/lazy.jpg" data-src='img/champion/${a}_0.jpg'/> <br>
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
  // sort skins by release date
  champion[c] = champion[c].sort((b,a) => new moment(a.date, "DD-MMM-YYYY") - new moment(b.date, "DD-MMM-YYYY"))

  // calculate time since last skins
  if (champion[c][0].date == "N/A") {
    champion[c].lastDate = moment().add(1, 'months')
    champion[c].daysSinceLast = "Coming soon"
  } else {
    champion[c].lastDate = champion[c][0].date
    champion[c].daysSinceLast = moment(champion[c][0].date, "DD-MMM-YYYY").fromNow()
  }

  // append inital to DOM
  createNodes(c)
}
lazyWrapper()

function createNodes(c) {
    let content = document.createElement("div")
    content.classList.add("champ");
    content.innerHTML = champTemplate(c)
    ul.appendChild(content)
}

function select(selectedValue) {
  if (selectedValue == "most") sortFunc = (b,a) => champion[a].amountSkins - champion[b].amountSkins
  if (selectedValue == "least") sortFunc = (a,b) => champion[a].amountSkins - champion[b].amountSkins
  if (selectedValue == "newest") sortFunc = (b,a) => new moment(champion[a].lastDate, "DD-MMM-YYYY") - new moment(champion[b].lastDate, "DD-MMM-YYYY")
  if (selectedValue == "oldest") sortFunc = (a,b) => new moment(champion[a].lastDate, "DD-MMM-YYYY") - new moment(champion[b].lastDate, "DD-MMM-YYYY")
  if (selectedValue == "za") sortFunc = (a,b) => a - b
  if (selectedValue == "az") sortFunc = (a,b) => a + b

  keySorted = Object.keys(champion).sort(sortFunc)
  ul.innerHTML = '';
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
