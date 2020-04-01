clearStorage();

function getHosts() {
  const hosts = new Set();
  const tabHost = String(window.location).split('/')[2];
  hosts.add(tabHost);
  if (tabHost.startsWith('www')) {
    hosts.add(tabHost.replace(/^www\./g, ''));
  }
  const scripts = document.scripts;
  for (let i in scripts) {
    const src = scripts[i].src;
    if (!src) continue;
    const host = src.split('/')[2];
    const hostMinusWWW = (host.startsWith('www.')) ? host.replace(/^www\./g, '') : '';
    if (host && host.includes('.') && !hosts.has(host)) {
      hosts.add(host);
      if (hostMinusWWW !== '') hosts.add(hostMinusWWW);
    }
  }
  addToStorage('hosts', Array.from(hosts));
}

function onError(error) {
  console.log(error);
}

function addToStorage(key, data) {
  browser.storage.local.set({ [key] :  data }).then(() => {
    // console.log('addToStorage', key, data);
  }, onError);
}

function updateStorage(key, data) {
  browser.storage.local.get(key).then((result) => {
    browser.storage.local.remove(key);
    addToStorage(key, data);
    // console.log('updateStorage', key, data);
  }, onError);
}

function clearStorage() {
  browser.storage.local.clear();
}

// to get messages from popup.js, use this instead of browser.storage.local.get:
browser.runtime.onMessage.addListener((results) => {
  const openNewTabs = results.openNewTabs;
  if (openNewTabs !== true) return; // just in case

  getHosts(); // get hosts now since page has already reloaded after message received

  browser.storage.local.get('hosts').then((results) => {
    const hosts = results.hosts;
    if (hosts === undefined) {
      suggestManualForFirst();
    } else {
      for (const host of hosts) {
        openInNewTab(host);
      }
    }
  }, onError);

}); // browser.runtime.onMessage.addListener does not accept onError parameter

function suggestManualForFirst() {
  alert("Something went wrong.\n\nTry copying the current page's URL and running a scan here: https://www.urlvoid.com");
  openInNewTab();
}

function openInNewTab(host) {
  const urlToOpen = 'https://www.urlvoid.com/scan/' + host;
  window.open(urlToOpen, '_blank');
}
