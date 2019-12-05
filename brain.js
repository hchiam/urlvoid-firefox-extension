clearStorage();
getHosts();

function getHosts() {
  const hosts = new Set();
  const tabHost = String(window.location).split('/')[2];
  hosts.add(tabHost);
  if (tabHost.startsWith('www')) {
    hosts.add(tabHost.replace(/^www\./g, ''));
  }
  const children = document.head.children;
  for (let i in children) {
    const src = children[i].attributes['src'];
    const host = (src && src.value) ? src.value.split('/')[2] : '';
    const hostMinusWWW = (host.startsWith('www.')) ? host.replace(/^www\./g, '') : '';
    if (host !== '' && host.includes('.') && !hosts.has(host)) {
      hosts.add(host);
      if (hostMinusWWW !== '') hosts.add(hostMinusWWW);
      // console.log(hosts);
      addToStorage('hosts', Array.from(hosts));
    }
  }
  // addToStorage('hosts', hosts);
}

function onError(error) {
  console.log(error);
}

function addToStorage(key, data) {
  browser.storage.local.set({ [key] :  data }).then(() => {
    // console.log('addToStorage', key, data);
  }, onError);
}

function clearStorage() {
  browser.storage.local.clear();
}
