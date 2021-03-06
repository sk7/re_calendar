
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


var textFile = null;

function downloadIcsFile(text, filename) {
    console.log("Preparing ics file");

    var data = new Blob([text], {type: 'text/calendar'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    file_url = window.URL.createObjectURL(data);

    console.log("Opening ics file");

    // Open the file in a new tab and close the tab immediately.
    browser.tabs.create({
      url:file_url
    })
    .then(tab => {
      browser.tabs.remove(tab.id);
    });
}

function addToCal(tab) {
  console.log("Page action clicked");

  browser.tabs.executeScript({
    code: 'getData()'
  }, function(result) {
    data = result[0];

    // linebreaks need to be as literal '\n' in the file.
    //ics.js doesn't handle this
    var description = data.description.replace(new RegExp("\n", 'g'), "\\n");

    //Always add URL to the beginning of description
    description = tab.url + "\\n\\n" + description;

    // 'start' and 'end' have a 'Z' at the end, indicating that the datetime is UTC,
    // but it should be local time, so just remove the Z.
    // see https://www.kanzaki.com/docs/ical/dateTime.html
    // ics.js doesn't support VTIMEZONE yet
    var start = data.start;
    var end = data.end;
    if (start.slice(-1) == 'Z') start = start.slice(0, -1);
    if (end.slice(-1) == 'Z') end = end.slice(0, -1);

    // the UID in the ICS file is necessary to differntiate between different
    // events. we can set the "uidDomain" in the constructor.
    // to get a uid, we combine the start date with a santized title
    var uiddomain = data.start.substr(0,10) + "-" + data.title.replace(/[^A-Za-z]/g, "").toLowerCase();

    var cal = ics(uiddomain);
    cal.addEvent(data.title, description, data.location, start, end);
    icsData = cal.build()
    downloadIcsFile(icsData, "event.ics")
  });
}

browser.pageAction.onClicked.addListener(addToCal);
