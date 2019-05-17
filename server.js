const express = require('express');
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 8080;
const app = express();
// the __dirname is the current directory from where the script is running


app.use(cors());

app.options('*', cors());

app.use(express.static(path.join(__dirname,'/dist')));
// app.use(express.static(path.join(__dirname, 'js/build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './dist/index.html'));
});

app.listen(port);
