let hosts = [];

function onError(error) {
  console.log(error);
}

function suggestManualForFirst() {
  alert("Automatically opening new tabs might be blocked.\n\nTry copying the current page's URL and running a scan here: https://www.urlvoid.com");
}

document.getElementById('check').addEventListener('click', () => {
  const yes = confirm('Do you want to continue?\n\n 1) Page will refresh,\n 2) will wait 3 seconds, and then\n 3) will open several pages.');
  if (!yes) return;
  waitingStyle();
  browser.tabs.reload().then(() => {
    setTimeout(() => {
      browser.storage.local.get('hosts').then((results) => {
        hosts = results.hosts;
        // alert(JSON.stringify(hosts))
        if (hosts === undefined) {
          suggestManualForFirst();
        } else {
          for (const host of hosts) {
            openInNewTab(host)
          }
        }
        window.close();
      }, onError);
    }, 3000);
  }, onError);
});

function openInNewTab(host) {
  const urlToOpen = 'https://www.urlvoid.com/scan/' + host
  browser.tabs.create({
    url: urlToOpen
  });
}

function waitingStyle() {
  document.getElementById('check').style.display = 'none';
  document.getElementById('message').style.display = 'block';
  document.getElementById('message').textContent = 'Please wait...';
}
