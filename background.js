
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

var textFile = null;

function makeTextFile(text) {
  var data = new Blob([text], {type: 'text/plain'});

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  return textFile;
}

function onStartedDownload(id) {
  console.log(`Started downloading: ${id}`);
}

function onFailed(error) {
  console.log(`Download failed: ${error}`);
}

function downloadFile() {
    console.log("Preparing file");
    fileUrl = makeTextFile("hello world");

    console.log(fileUrl);

    console.log("Starting download");
    downloading = browser.downloads.download({
        url: fileUrl,
        filename: "blah.txt"
    });

    downloading.then(onStartedDownload, onFailed);
}

function addToCal(tab) {
  console.log("Add to calendar");

  browser.tabs.executeScript({
    code: '(' + function() {
        return getData();
    } + ')();'
  }, function(data) {
    console.log(data[0]);
    downloadFile();



  });
}

browser.pageAction.onClicked.addListener(addToCal);
