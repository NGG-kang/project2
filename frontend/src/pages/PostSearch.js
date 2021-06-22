import React from "react";
import "antd/dist/antd.css";
import AppLayout from "components/AppLayout";
import PostSearchView from "components/PostSearchView";

function PostSearch({ match, location }) {
  return (
    <AppLayout>
      <PostSearchView location={location} />
    </AppLayout>
  );
}

export default PostSearch;
