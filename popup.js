function onError(error) {
  console.log(error);
}

document.getElementById('check').addEventListener('click', () => {
  const yes = confirm('Need to refresh this page.\n\nDo you want to continue?');
  if (!yes) return;
  waitingStyle();
  // send message only after reload
  browser.tabs.reload().then(() => {
    // for popup.js to send data to brain.js, message tabs instead of using browser.storage.local.set:
    browser.tabs.query({
      currentWindow: true,
      active: true
    }).then(sendMessageToTabs).catch(onError);
  }, onError);
});

function waitingStyle() {
  document.getElementById('check').style.display = 'none';
  document.getElementById('message').style.display = 'block';
  document.getElementById('message').textContent = 'Just a sec...';
}

function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    // instead of using browser.storage.local.set:
    browser.tabs.sendMessage(
      tab.id,
      {
        openNewTabs: true
      }
    ).catch(onError);
  }
  window.close();
}
