clearStorage();

function getHosts() {
  const hosts = new Set(); // use Set to keep unique values
  getHostFromCurrentTab(hosts)
  const children = document.head.children;
  addSrcAndHrefToHosts(children, hosts);
  const scripts = document.scripts;
  addSrcAndHrefToHosts(scripts, hosts);
  addToStorage('hosts', Array.from(hosts));
  // console.log(hosts);
}

function getHostFromCurrentTab(hosts) {
  const tabHost = String(window.location);
  addHostToHosts(tabHost, hosts);
}

function addSrcAndHrefToHosts(elements, hosts) {
  for (let i in elements) {
    const src = elements[i].src;
    addHostToHosts(src, hosts);
    const href = elements[i].href;
    addHostToHosts(href, hosts);
  }
}

function addHostToHosts(host, hosts) {
  const noHost = (!host || host == undefined);
  if (noHost) return;

  // keep part between "//" and 1st "/", and remove the final "/":
  host = host.split('/')[2].replace(/\/$/,'');

  const invalidHost = !host || !host.includes('.');
  const repeatHost = hosts.has(host);
  if (invalidHost || repeatHost) return;
  hosts.add(host);

  const hostMinusWWW = (host.startsWith('www.')) ? host.replace(/^www\./g, '') : '';
  if (hostMinusWWW !== '') {
    hosts.add(hostMinusWWW);
  }

  const hostPartDotPart = host.match(/\.([^.]+\..+)$/);
  if (hostPartDotPart !== null) {
    hosts.add(hostPartDotPart[1]);
  }
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
  // (let popup.js open tabs to the hosts)
}); // browser.runtime.onMessage.addListener does not accept onError parameter
