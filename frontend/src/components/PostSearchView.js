import React, { useState, useEffect } from "react";
import { Row, Col, Alert } from "antd";
import Post from "./Post";
import { Link } from "react-router-dom";
import { axiosInstance } from "api";
import { useAppContext } from "store";

function PostSearchView({ match, location }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  // const [prev, setPrev] = useState(null);
  // const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const title = location.search.split("=")[1];
  const {
    store: { jwtToken },
  } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const response = await axiosInstance.get(`/search/?title=${title}`, {
          headers,
        });
        // setPrev(search);
        setPosts(response.data);
        setLoading(false);
      } catch (e) {
        setError(e);
        console.log(e);
      }
    };
    fetchData();
  }, [title]);

  if (error)
    return (
      <Alert
        style={{ width: "50%", height: "10%", textAlign: "center" }}
        type="warning"
        message="로그인이 필요합니다"
      />
    );
  if (loading) {
    return (
      <Alert
        style={{ width: "50%", height: "10%", textAlign: "center" }}
        type="warning"
        message="로딩중입니다. :-)"
      />
    );
  }
  if (!posts)
    return (
      <Alert
        style={{ width: "50%", height: "10%", textAlign: "center" }}
        type="warning"
        message="포스팅이 없습니다. :-("
      />
    );
  return (
    <Row
      gutter={[30, 30]}
      style={{
        width: "100%",
        height: "100%",
        marginTop: "20px",
        padding: "10px",
      }}
    >
      {posts && posts.length === 0 && (
        <Alert
          style={{ width: "50%", height: "10%", textAlign: "center" }}
          type="warning"
          message="포스팅이 없습니다. :-("
        />
      )}
      {posts &&
        posts.map((post) => (
          <Col span={4} key={post.id} id={post.id}>
            <Link to={{ pathname: "/" + post.id }} key={post.id}>
              <Post post={post} key={post.id} />
            </Link>
          </Col>
        ))}
    </Row>
  );
}

export default PostSearchView;
