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

d.$("#check").addEventListener("click", async () => {
  getHosts((hosts) => {
    if (!hosts) {
      suggestManualForFirst();
    } else {
      showCheckboxes(hosts);
    }
  });
});

d.$("#version-number").firstChild.nodeValue =
  chrome.runtime.getManifest().version;

function getHosts(callback) {
  chrome.storage.local.get(["hosts"], (results) => {
    const hosts = results.hosts;
    callback(hosts);
  });
}

function suggestManualForFirst() {
  alert(
    "Something went wrong.\n\nTry copying the current page's URL and running a scan here: https://www.urlvoid.com"
  );
  openInNewTab();
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
    <h2>Choose which ones to check:</h2>
    ${options.join("")}
    <button id="check-selected-hosts" disabled>Check these ^</button>`;
  d.$("#check").setAttribute("disabled", true);
  d.$$("#checkbox-container input").forEach((input) =>
    input.addEventListener("change", enableCheckSelectedHostsButton)
  );
  d.$("#check-selected-hosts").addEventListener("click", () => {
    checkSelectedHosts();
    window.close();
  });
}

function enableCheckSelectedHostsButton() {
  const checkedCount = d.$$("#checkbox-container input:checked").length;
  if (checkedCount === 0) {
    d.$("#check-selected-hosts").setAttribute("disabled", true);
    d.$("#check-selected-hosts").classList.remove("changing-colour");
  } else {
    d.$("#check-selected-hosts").removeAttribute("disabled");
    d.$("#check-selected-hosts").classList.add("changing-colour");
  }
  d.$("#check-selected-hosts").innerText =
    checkedCount === 1 ? "Check this (1) ^" : `Check these (${checkedCount}) ^`;
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

async function customConfirm(message) {
  const container = d.$("#custom-confirm");
  const messageElement = container.querySelector(".message");
  const cancelButton = container.querySelector(".cancel");
  const okButton = container.querySelector(".confirm");
  showCustomConfirm();
  messageElement.innerText = message;
  let awaitingUserAction = true;
  let userResponse = false;
  function callback(ok) {
    awaitingUserAction = false;
    userResponse = ok;
  }
  cancelButton.addEventListener("click", () => {
    hideCustomConfirm();
    callback(false);
  });
  okButton.addEventListener("click", () => {
    hideCustomConfirm();
    callback(true);
  });

  while (awaitingUserAction) await delay(300);

  return userResponse;
}

function showCustomConfirm() {
  const container = d.$("#custom-confirm");
  container.style.height = "100%";
  container.style.padding = "1rem";
}

function hideCustomConfirm() {
  const container = d.$("#custom-confirm");
  container.style.height = 0;
  container.style.padding = 0;
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
