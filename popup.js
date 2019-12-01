let hosts = [];

function onError(error) {
  console.log(error);
}

document.getElementById('check').addEventListener('click', () => {
  browser.storage.local.get('hosts').then((results) => {
    hosts = results.hosts;
    alert(JSON.stringify(hosts))
    for (const host of hosts) {
      alert(host)
      openInNewTab(host)
    }
  }, onError);
});

function openInNewTab(host) {
  const urlToOpen = 'https://www.urlvoid.com/scan/' + host
  alert('Trying to open tab to: ' + urlToOpen);
  // const win = window.open(urlToOpen, '_blank');
  // win.focus();
  browser.browserAction.onClicked.addListener(function() {
    var creating = browser.tabs.create({
      url: urlToOpen
    });
    creating.then(onCreated, onError);
  });
}

function onCreated() {
  alert('done')
}