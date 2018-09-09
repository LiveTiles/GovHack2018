chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'www.realestate.com.au' },
            }),
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'www.domain.com.au' },
            }),
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'www.allhomes.com.au' }
            })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});