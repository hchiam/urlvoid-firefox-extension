chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const tab = tabs[0];
  const url = new URL(tab.url);
  const domain = url.hostname.replace(/^www\./, ""); // example: wikipedia.org
  const checkDomainButton = document.getElementById("check-1");
  checkDomainButton.textContent = "Check just " + domain;
  checkDomainButton.addEventListener("click", () => {
    openInNewTab(domain);
    window.close();
  });
});

document.getElementById("check").addEventListener("click", () => {
  const yes = confirm("Need to refresh this page.\n\nDo you want to continue?");
  if (!yes) return;
  waitingStyle();
  // send message only after reload
  chrome.tabs.executeScript({ code: "window.location.reload();" }, () => {
    // for popup.js to send data to brain.js, message tabs instead of using browser.storage.local.set:
    chrome.tabs.query(
      {
        currentWindow: true,
        active: true,
      },
      (tabs) => {
        sendMessageToTabs(tabs);
      }
    );
  });
});

document.getElementById(
  "version-number"
).firstChild.nodeValue = chrome.runtime.getManifest().version;

function waitingStyle() {
  document.getElementById("check").style.display = "none";
  document.getElementById("message").style.display = "block";
  document.getElementById("message").textContent = "Just a sec...";
}

function sendMessageToTabs(tabs) {
  // instead of using chrome.storage.local.set:
  chrome.tabs.sendMessage(
    tabs[0].id,
    {
      openNewTabs: true,
    },
    () => {
      // (by now, brain.js has collected all the hosts)
      openHostsInTabs(); // could be in callback?
    }
  );
}

function openHostsInTabs() {
  chrome.storage.local.get(["hosts"], (results) => {
    const hosts = results.hosts;
    if (hosts === undefined) {
      suggestManualForFirst();
    } else {
      for (const host of hosts) {
        openInNewTab(host);
      }
    }
    window.close();
  });
}

function suggestManualForFirst() {
  alert(
    "Something went wrong.\n\nTry copying the current page's URL and running a scan here: https://www.urlvoid.com"
  );
  openInNewTab();
}

function openInNewTab(host) {
  const urlToOpen = "https://www.urlvoid.com/scan/" + (host ? host : "");
  chrome.tabs.create({
    url: urlToOpen,
  });
}
