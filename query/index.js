const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
    res.send({});
});

app.post("/events", (req, res) => {
    console.log('Received event :>> ', req.body.type);
    res.send({});
});

app.listen(4002, () => {
    console.log('Listening on 4002');
});
