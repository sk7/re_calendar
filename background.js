
/*
Returns true only if this page is supported for events
*/
function isSupportedPage(url) {
  supportedPages = [
    'https://18.re-publica.com/en/session/',
    'https://18.re-publica.com/de/session/'
  ]
  return supportedPages.filter(x => url.indexOf(x) == 0).length > 0
}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
  if (isSupportedPage(tab.url)) {
    browser.pageAction.show(tab.id);
  } else {
    browser.pageAction.hide(tab.id);
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

    // linebreaks need to be as literal '\n' in the file.
    //ics.js doesn't handle this
    var description = data.description.replace(new RegExp("\n", 'g'), "\\n");

    //Always add URL to the beginning of description
    description = tab.url + "\\n\\n" + description;

    // the UID in the ICS file is necessary to differntiate between different
    // events. we can set the "uidDomain" in the constructor.
    // to get a uid, we combine the start date with a santized title
    var uiddomain = data.start.substr(0,10) + "-" + data.title.replace(/[^A-Za-z]/g, "").toLowerCase();
    var cal = ics(uiddomain);
    cal.addEvent(data.title, description, data.location, data.start, data.end);
    icsData = cal.build()
    downloadIcsFile(icsData, "event.ics")
  });
}

browser.pageAction.onClicked.addListener(addToCal);
