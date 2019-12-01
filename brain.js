clearStorage();

const children = document.head.children;
const hosts = [];
for (let i in children) {
  const src = children[i].attributes['src'];
  const host = (src && src.value) ? src.value.split('/')[2] : '';
  const hostMinusWWW = (host.startsWith('www.')) ? host.replace(/^www\./g, '') : '';
  if (host !== '') {
    hosts.push(host);
    if (hostMinusWWW !== '') hosts.push(hostMinusWWW);
    // console.log(hosts);
    addToStorage('hosts', hosts);
  }
}

// addToStorage('hosts', hosts);

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
