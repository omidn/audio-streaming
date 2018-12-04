
var wavFileInfo = require('wav-file-info');
wavFileInfo.infoByFilename('witz.wav', function(err, info){
    if (err) throw err;
    console.log(info);
});

// wavFileInfo.infoByFilename('blobsave.wav', function(err, info){
//     // if (err) throw err;
//     console.log(info);
//     console.log(err);
// });

// wavFileInfo.infoByFilename('base64save.wav', function(err, info){
//     // if (err) throw err;
//     console.log(info);
//     // console.log(err);
// });