const openVisualiserWindow = (visualiserFile) => {
  window.open(
    visualiserFile,
    "_blank",
    "frame=false,nodeIntegration=yes,contextIsolation=no"
  );
};

const visualiserLink = document.getElementById("letsGetThePartyStarted");
visualiserLink.addEventListener("click", (e) => {
  openVisualiserWindow("letsGetThePartyStarted/letsGetThePartyStarted.html");
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    console.log(`${type}-version`, process.versions[type])
  }
})