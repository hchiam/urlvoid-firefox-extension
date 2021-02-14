d = document;
d.$ = document.querySelector;
d.$$ = document.querySelectorAll;

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const tab = tabs[0];
  const url = new URL(tab.url);
  const domain = url.hostname.replace(/^www\./, ""); // example: wikipedia.org
  const checkDomainButton = d.$("#check-1");
  if (domain === "") {
    checkDomainButton.remove();
    return;
  }
  checkDomainButton.textContent = "Check just " + domain;
  checkDomainButton.addEventListener("click", () => {
    openInNewTab(domain);
    window.close();
  });
});

d.$("#check").addEventListener("click", () => {
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

d.$(
  "#version-number"
).firstChild.nodeValue = chrome.runtime.getManifest().version;

function waitingStyle() {
  d.$("#check-1").style.display = "none";
  d.$("#check").style.display = "none";
  d.$("#message").style.display = "block";
  d.$("#message").textContent = "Just a sec...";
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
      askBeforeOpeningLotsOfTabs(hosts);
    }
  });
}

function suggestManualForFirst() {
  alert(
    "Something went wrong.\n\nTry copying the current page's URL and running a scan here: https://www.urlvoid.com"
  );
  openInNewTab();
}

function askBeforeOpeningLotsOfTabs(hosts) {
  const lots = 5;
  const haveLots = hosts.length >= lots;

  const haveCheckboxes = d.$$("#checkbox-container input").length > 0;
  let canContinue = true;

  if (haveLots && !haveCheckboxes) {
    canContinue = confirm(
      `Please confirm that you're fine with opening ${hosts.length} tabs to URLVoid. \n\nIf you cancel, you can choose which ones to check.`
    );
  }
  if (canContinue) {
    hideCheckboxes();
    openAllHosts(hosts);
    window.close();
  } else {
    showCheckboxes(hosts);
  }
}

function openAllHosts(hosts) {
  for (const host of hosts) {
    openInNewTab(host);
  }
}

function openInNewTab(host) {
  const urlToOpen = "https://www.urlvoid.com/scan/" + (host ? host : "");
  chrome.tabs.create({
    url: urlToOpen,
  });
}

function hideCheckboxes() {
  d.$("#checkbox-container").innerText = "";
}

function showCheckboxes(hosts) {
  const options = hosts.map(
    (host, i) =>
      `<label for="host_${i}">
        <input type="checkbox" id="host_${i}" class="host" aria-label="${host}" value="${host}" />
        ${host}
      </label>`
  );
  d.$("#checkbox-container").innerHTML = `
    <p>Choose which ones to check:</p>
    ${options.join("")}
    <button id="check-selected-hosts" disabled>Check these ^</button>`;
  d.$$("#checkbox-container input").forEach((input) =>
    input.addEventListener("change", enableCheckSelectedHostsButton)
  );
  d.$("#check-selected-hosts").addEventListener("click", () => {
    checkSelectedHosts();
    window.close();
  });
}

function enableCheckSelectedHostsButton() {
  d.$("#check-selected-hosts").removeAttribute("disabled");
}

function checkSelectedHosts() {
  const hosts = getSelectedHosts();
  openAllHosts(hosts);
}

function getSelectedHosts() {
  const checkedHostElements = d.$$("#checkbox-container .host:checked");
  const values = [];
  checkedHostElements.forEach((c) => values.push(c.value));
  return values;
}
