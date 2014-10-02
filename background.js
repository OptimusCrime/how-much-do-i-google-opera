//
// Variables
//

var data = {};

//
// TODO
//


chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
        chrome.tabs.create( { "url": "http://dev.opera.com" } );
    });
});

//
// Everything starts here
//

function init() {
    chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
        handle_request(details.url);
    });
    
    chrome.webNavigation.onReferenceFragmentUpdated.addListener(function (details) {
        handle_request(details.url);
    });
    
    var local_data = localStorage.data;
    console.log(local_data);
    if (local_data !== undefined) {
        data = JSON.parse(local_data);
    }
}

//
// Tries to find the url fragments & / ? / # from the url
//

function get_fragments(url, sep) {
    var fragments;
    var inner_fragments = [];
    if (url.indexOf(sep) !== -1) {
        fragments = url.split(sep);
        if (fragments[1].indexOf('&') !== -1) {
            inner_fragments = fragments[1].split('&');
        }
        else {
            inner_fragments = [fragments[1]];
        }
    }
    
    return inner_fragments;
}

//
// Tries to locate the q= in the stack of fragments
//

function analyze_fragments(arr) {
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, 2) == 'q=') {
                return arr[i].substr(2);
            }
        }
    }
    
    // Nothing was found
    return null;
}

//
// Handles an incoming request
//

function handle_request(url) {
    // Some variables
    var search_query = null;
    var inner_fragments;
    
    // Tries to get fragments from the hash
    inner_fragments = get_fragments(url, '#');
    
    // Analyze the fragments
    search_query = analyze_fragments(inner_fragments);
    
    // Check if anything was returned
    if (search_query === null) {
        // Nothing was returned, check if we have any fragments in get
        inner_fragments = get_fragments(url, '?');
    }
    
    // Analyze the fragments one more time
    search_query = analyze_fragments(inner_fragments);
    
    // Check if anything was returned (again)
    if (search_query !== null) {
        // We have a search query!
        add_to_data(search_query);
    }
}

//
// Populates data, to make sure we dont fuck anything up
//

function populate_data(year, month, day) {
    // Add year if none
    if (data['y' + year] === undefined) {
        data['y' + year] = {};
    }
    
    // Add month if none
    if (data['y' + year]['m' + month] === undefined) {
        data['y' + year]['m' + month] = {};
    }
    
    // Add date if none
    if (data['y' + year]['m' + month]['d' + day] === undefined) {
        data['y' + year]['m' + month]['d' + day] = [];
    }
}

//
// Adds a search to the data
//

function add_to_data(q) {
    // Get current date
    var d = new Date();
    
    // Get year, month, day
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    
    // Populate data
    populate_data(year, month, day);
    
    // Check if already in the stack and more recent that one hour
    var day_arr = data['y' + year]['m' + month]['d' + day];
    if (day_arr.length > 0) {
        for (var i = 0; i < day_arr.length; i++) {
            if (day_arr[i].query == q) {
                if (day_arr[i].time > (new Date().getTime() - (60*60*1000))) {
                    // Already in stack and newer thatn one hour, abooort
                    return;
                }
            }
        }
    }
    
    // Add to data
    data['y' + year]['m' + month]['d' + day].push({query: q, time: new Date().getTime()});
    
    // Debug
    console.log(data);
    
    // Save
    localStorage.data = JSON.stringify(data);
}

//
// Run everything!
//

init();