const wabd = require("web-audio-beat-detector");

module.exports.playSong = (URL) => {
  const context = new AudioContext();
  let songBuffer;

  window
    .fetch(URL)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      return context.decodeAudioData(arrayBuffer);
    })
    .then((audioBuffer) => {
      // console.log(getPeaksAtThreshold(audioBuffer, 10));
      // playButton.disabled = false;
      wabd
        .guess(audioBuffer)
        .then(({ bpm, offset, tempo }) => {
          // the bpm and offset could be guessed
          // the tempo is the same as the one returned by analyze()
          console.log(JSON.stringify({ bpm, offset, tempo }));
        })
        .catch((err) => {
          // something went wrong
          console.log(err);
        });
      songBuffer = audioBuffer;
      console.log(songBuffer);
      play(songBuffer);
      // console.log(getPeaksAtThreshold(songBuffer, 10));
    });

  function play(audioBuffer) {
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();
  }

  // Function to identify peaks

  function getPeaksAtThreshold(data, threshold) {
    console.log(data);
    var peaksArray = [];
    var length = data.length;
    console.log(data, length);
    for (var i = 0; i < length; ) {
      console.log(data[i]);
      if (data[i] > threshold) {
        peaksArray.push(i);
        // Skip forward ~ 1/4s to get past this peak.
        i += 10000;
      }
      i++;
    }
    return peaksArray;
  }
};
