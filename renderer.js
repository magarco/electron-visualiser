const { playSong } = require("./lib/audio");

const openVisualiserWindow = (visualiserFile) => {
  window.open(
    visualiserFile,
    "_blank",
    "frame=true,nodeIntegration=yes,contextIsolation=no"
  );
};

const visualiserLink = document.getElementById("letsGetThePartyStarted");
visualiserLink.addEventListener("click", (e) => {
  openVisualiserWindow("letsGetThePartyStarted/letsGetThePartyStarted.html");
});

const playButton = document.getElementById("#play");
playButton.addEventListener("click", () => {
  playSong("file_example_MP3_1MG.mp3");
});
