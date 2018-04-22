
/*
Returns true only if this page is supported for events
*/
function isSupportedPage(url) {
  return url.indexOf('https://18.re-publica.com/') == 0
}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
  if (isSupportedPage(tab.url)) {
    // browser.pageAction.setIcon({tabId: tab.id, path: "icons/ic_alarm_add_black.svg"});
    browser.pageAction.show(tab.id);
  }
}

/*
When first loaded, initialize the page action for all tabs.
*/
var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
  for (let tab of tabs) {
    initializePageAction(tab);
  }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});



// function makeTextFile(text) {
//   var data = new Blob([text], {type: 'text/x-vCalendar'});

//   // If we are replacing a previously generated file we need to
//   // manually revoke the object URL to avoid memory leaks.
//   if (textFile !== null) {
//     window.URL.revokeObjectURL(textFile);
//   }

//   textFile = window.URL.createObjectURL(data);

//   return textFile;
// }

function onStartedDownload(id) {
  console.log(`Started downloading: ${id}`);
}

function onFailed(error) {
  console.log(`Download failed: ${error}`);
}

var textFile = null;

function downloadIcsFile(text, filename) {
    console.log("Preparing file");

    var data = new Blob([text], {type: 'text/x-vCalendar'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    file_url = window.URL.createObjectURL(data);

    console.log("Starting download");
    downloading = browser.downloads.download({
        url: file_url,
        filename: filename
    });

    downloading.then(onStartedDownload, onFailed);
}

function addToCal(tab) {
  console.log("Add to calendar");

  browser.tabs.executeScript({
    code: '(' + function() {
        return getData();
    } + ')();'
  }, function(result) {
    data = result[0];
    console.log(data);

    var cal = ics();
    cal.addEvent(data.title, "", data.room, data.start, data.end);
    icsData = cal.build()
    downloadIcsFile(icsData, "event.ics")

  });
}

browser.pageAction.onClicked.addListener(addToCal);
