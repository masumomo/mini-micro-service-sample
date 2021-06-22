const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

const handleEvent = (type, data) => {
    if (type === "PostCreated") {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    } else if (type === "CommentCreated") {
        const { id, content, postId, status } = data;
        posts[postId].comments.push({ id, content, status });
    } else if (type === "CommentUpdated") {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;
        comment.content = content;
    }
};

app.post("/events", (req, res) => {
    console.log('Received event :>> ', req.body.type);
    const { type, data } = req.body;

    handleEvent(type, data);
    res.send({});
});

app.listen(4002, async () => {
    console.log('Listening on 4002');

    const res = await axios.get("http://event-bus-srv:4005/events").catch((e) => {
        console.log('e :>> ', e);
    });
    console.log('res :>> ', res.data);
    for (let event of res.data) {
        console.log('Received event :>> ', event.type);
        const { type, data } = event;
        handleEvent(type, data);
    }
});
