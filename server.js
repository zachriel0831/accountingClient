const express = require('express');
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 8080;
const app = express();
// the __dirname is the current directory from where the script is running


app.use(cors());
app.options('*', cors());

app.use(express.static(__dirname));
// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.get('/*', (req, res) => {
    let url = path.join(__dirname, '../client/build', 'index.html');
    if (!url.startsWith('/app/')) // we're on local windows
      url = url.substring(1);


      console.log('url ' + url);
      console.log('__dirname ' + __dirname);

    res.sendFile(url);
  });

  app.listen(port);
