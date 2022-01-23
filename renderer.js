const { playSong } = require("./lib/audio");

const openVisualiserWindow = (visualiserFile) => {
  window.open(
    visualiserFile,
    "_blank",
    "frame=true,nodeIntegration=yes,contextIsolation=no"
  );
};

const visuals = ["letsGetThePartyStarted", "oliStreets", "mergeVisual"];

const visualiserLinks = visuals.map((v) => {
  return {
    visualName: v,
    docRef: document.getElementById(v),
  };
});

visualiserLinks.map((vl) =>
  vl.docRef.addEventListener("click", (e) => {
    openVisualiserWindow(`${vl.visualName}/${vl.visualName}.html`);
  })
);

// const playButton = document.getElementById("#play");
// playButton.addEventListener("click", () => {
//   playSong("file_example_MP3_1MG.mp3");
// });
