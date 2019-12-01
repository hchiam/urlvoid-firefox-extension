let hosts = [];

function onError(error) {
  console.log(error);
}

document.getElementById('check').addEventListener('click', () => {
  browser.storage.local.get('hosts').then((results) => {
    hosts = results.hosts;
    alert(JSON.stringify(hosts))
    for (const host of hosts) {
      openInNewTab(host)
    }
  }, onError);
});

function openInNewTab(host) {
  const urlToOpen = 'https://www.urlvoid.com/scan/' + host
  var creating = browser.tabs.create({
    url: urlToOpen
  });
}
