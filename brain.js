clearStorage();

const children = document.head.children;
const hosts = [];
for (let i in children) {
  const src = children[i].attributes['src'];
  const host = (src && src.value) ? src.value.split('/')[2] : undefined;
  if (host !== undefined) {
    console.log(host);
    hosts.push(host);
    addToStorage('hosts', hosts);
  }
}

// addToStorage('hosts', hosts);

function onError(error) {
  console.log(error);
}

function addToStorage(key, data) {
  browser.storage.local.set({ [key] :  data }).then(() => {
    console.log('addToStorage', key, data);
  }, onError);
}

function clearStorage() {
  browser.storage.local.clear();
}
