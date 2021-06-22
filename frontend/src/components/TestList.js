import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { Row, Col } from "antd";

function TestList() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const { Meta } = Card;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await axios.get(`/post/1/`);
        setPosts(response.data);
        console.log(response.data);
      } catch (e) {
        setError(e);
        console.log(e);
      }
    };
    fetchData();
  }, []);

  if (error) return <div>에러가 발생했습니다</div>;
  if (!posts) return <div>없음</div>;
  return (
    <Row gutter={[30, 30]}>
      <Col className="gutter-row" span={6} key={posts.id} id={posts.id}>
        <Card hoverable cover={<img alt="example" src={posts.thumb_nail} />}>
          <Meta title={posts.title} description={posts.title} />
        </Card>
      </Col>
    </Row>
  );
}

export default TestList;

// 디테일 페이지 테스트
