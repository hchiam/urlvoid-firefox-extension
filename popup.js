function onError(error) {
  console.log(error);
}

function suggestManualForFirst() {
  alert("Something went wrong.\n\nTry copying the current page's URL and running a scan here: https://www.urlvoid.com");
  openInNewTab();
}

document.getElementById('check').addEventListener('click', () => {
  const yes = confirm('Need to refresh this page.\n\nDo you want to continue?');
  if (!yes) return;
  waitingStyle();
  browser.tabs.reload().then(() => {
    setTimeout(() => {
      browser.storage.local.get('hosts').then((results) => {
        const hosts = results.hosts;
        // alert(JSON.stringify(results));
        if (hosts === undefined) {
          suggestManualForFirst();
        } else {
          for (const host of hosts) {
            openInNewTab(host)
          }
        }
        window.close();
      }, onError);
    }, 1000);
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
  document.getElementById('message').textContent = 'Just a sec...';
}
