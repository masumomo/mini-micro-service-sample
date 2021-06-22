import React from "react";

const CommentList = ({ comments }) => {

  const renderedComments = comments.map((comment) => {
    console.log('comment :>> ', comment);
    let content;
    if (comment.status === "approved") {
      content = comment.content;
    }
    else if (comment.status === "pending") {
      content = "Pending...";
    }
    else if (comment.status === "rejected") {
      content = "REJECTED!";
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
