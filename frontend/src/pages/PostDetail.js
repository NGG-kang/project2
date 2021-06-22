import React from "react";
import "antd/dist/antd.css";
import AppLayout from "components/AppLayout";
import PostDetailView from "components/PostDetailView";

function PostDetail({ match }) {
  return (
    <AppLayout>
      <PostDetailView id={match.params.id} />
    </AppLayout>
  );
}

export default PostDetail;
