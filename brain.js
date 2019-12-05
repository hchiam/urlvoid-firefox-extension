clearStorage();
getHosts();

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
    console.log('addToStorage', key, data);
  }, onError);
}

function updateStorage(key, data) {
  browser.storage.local.get(key).then((result) => {
    browser.storage.local.remove(key);
    addToStorage(key, data);
    console.log('updateStorage', key, data);
  }, onError);
}

function clearStorage() {
  browser.storage.local.clear();
}
