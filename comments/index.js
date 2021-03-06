const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const postId = req.params.id;
  console.log('comments content :>> ', content);

  const comments = commentsByPostId[postId] || [];
  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostId[postId] = comments;

  await axios.post("http://events-bus-srv:4005/events", {
    type: "CommentCreated", data: { id: commentId, content, postId, status: "pending" }
  })
    .catch((err) => {
      console.log(err.message);
    });
  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  if (req.body.type === "CommentModerated") {
    console.log('Received event :>> ', req.body.type);
    const { postId, id, content, status } = req.body.data;
    const comments = commentsByPostId[postId];
    const comment = comments.find(comment => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;

    await axios.post("http://events-bus-srv:4005/events", {
      type: "CommentUpdated", data: { id, content, postId, status }
    })
      .catch((err) => {
        console.log(err.message);
      });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log('version 1 :>> ');
  console.log('Listening on 4001');
});
