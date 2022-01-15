module.exports.playSong = (URL) => {
  const context = new AudioContext();
  let songBuffer;

  window.fetch(URL)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      playButton.disabled = false;
      songBuffer = audioBuffer;
      console.log(songBuffer);
      play(songBuffer);
    });

  function play(audioBuffer) {
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();
  }
};
