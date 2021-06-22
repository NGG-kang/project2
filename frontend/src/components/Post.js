import React from "react";
import { Card } from "antd";
const { Meta } = Card;

function Post({ post }) {
  return (
    <Card hoverable cover={<img alt="example" src={post.thumb_nail} />}>
      <Meta title={post.title} description={post.author.username} />
    </Card>
  );
}
export default Post;
