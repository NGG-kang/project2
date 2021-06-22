import React from "react";
import "antd/dist/antd.css";
import AppLayout from "components/AppLayout";
import PostList from "components/PostList";

function Home({ children }) {
  return (
    <AppLayout>
      {children}
      <PostList />
    </AppLayout>
  );
}

export default Home;
