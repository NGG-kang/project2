import React, { useState, useEffect } from "react";
import { Alert, Spin } from "antd";
import { Row, Col } from "antd";
import Post from "./Post";
import { Link } from "react-router-dom";
import { axiosInstance } from "api";
import { useAppContext } from "store";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [isBottom, setIsBottom] = useState(true);

  const [xs, setXS] = useState({ span: 32, offset: 0 });
  const [md, setMD] = useState({ span: 32, offset: 0 });
  const [lg, setLG] = useState({ span: 32, offset: 0 });
  const [xl, setXL] = useState({ span: 32, offset: 0 });
  const {
    store: { jwtToken },
  } = useAppContext();

  useEffect(() => {
    setTimeout(() => {}, 1000);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleScroll() {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    if (scrollTop + window.innerHeight + 50 >= scrollHeight && hasMore) {
      setIsBottom(true);
    }
  }
  const fetchData = async () => {
    try {
      if (!hasMore) {
        return;
      }

      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const response = await axiosInstance.get(
        `/post-infinity-scroll/?items=${items}`,
        {
          headers,
        }
      );
      const originPost = response.data["post"];
      if (!originPost) setPosts([]);
      else setPosts(originPost.map((post) => ({ ...post, posts })));

      console.log(originPost);
      if (originPost.length >= 5) {
        console.log("설정완료");
        setXS({ span: 20, offset: 0 });
        setMD({ span: 10, offset: 1 });
        setLG({ span: 6, offset: 2 });
        setXL({ span: 6, offset: 0 });
      }
      setHasMore(response.data["has_more"]);
      setLoading(false);
    } catch (e) {
      setError(e);
      console.log(e);
    }
    setIsBottom(false);
    return hasMore;
  };

  useEffect(() => {
    if (isBottom) {
      if (fetchData()) {
        setItems(items + 20);
      }
    }
  }, [isBottom]);

  if (error)
    return (
      <Alert
        style={{ width: "50%", height: "10%", textAlign: "center" }}
        type="warning"
        message="에러가 발생했습니다."
      />
    );

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ width: "50%", height: "10%", textAlign: "center" }}
      />
    );
  }

  return (
    <Row gutter={[32, 32]}>
      {posts && posts.length === 0 && (
        <Alert type="warning" message="포스팅이 없습니다. :-(" />
      )}
      {posts &&
        posts.map((post) => (
          <Col xs={xs} md={md} lg={lg} xl={xl} key={post.id} id={post.id}>
            <Link to={{ pathname: "/post/" + post.id }} key={post.id}>
              <Post post={post} key={post.id} />
            </Link>
          </Col>
        ))}
    </Row>
  );
}

export default PostList;
