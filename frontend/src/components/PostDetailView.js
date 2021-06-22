import React, { useEffect, useState } from "react";
import {
  Player,
  BigPlayButton,
  LoadingSpinner,
  ControlBar,
  ReplayControl,
  ForwardControl,
  PlaybackRateMenuButton,
} from "video-react";
import "video-react/dist/video-react.css";
import { Card, Button, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { useAppContext } from "store";
import { axiosInstance } from "api";
import axios from "axios";
import CommentList from "components/CommentList";
const { Meta } = Card;

function PostDetailView({ id }) {
  const [post, setPost] = useState([]);
  const [error, setError] = useState(null);
  const [player, setPlayer] = useState(null);
  const [username, setUsername] = useState(null);
  const [subscribe, setSubscribe] = useState(false);
  const {
    store: { jwtToken },
  } = useAppContext();

  const headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  const Subscribe_set = async () => {
    const data = { author: post.author.username, request: "subscribe" };
    console.log(data);
    const instance = axios.create({
      baseURL: "",
      headers: headers,
    });
    const response = await instance.post("/subscribe/", {
      data,
    });
    if (response.data.messages === "success") {
      setSubscribe(true);
    }
  };

  const Subscribe_del = async () => {
    const data = { author: post.author.username, request: "remove" };
    console.log(data);
    const instance = axios.create({
      baseURL: "",
      headers: headers,
    });
    const response = await instance.post("/subscribe/", {
      data,
    });
    if (response.data.messages === "success") {
      setSubscribe(false);
    }
    console.log(response);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        const response = await axiosInstance.get(`/post/${id}/`, {
          headers,
        });
        const subresponse = await axiosInstance.get(`/subscribe/`, {
          headers,
        });
        setPost(response.data);
        console.log(response.data);
        setUsername(response.data.author.username);
        setPlayer(post.video);
        console.log(subresponse);
        if (subresponse.data.length > 0) {
          subresponse.data[0].sub_users.map((sub) => {
            if (sub === response.data.author.username) {
              console.log(sub);
              setSubscribe(true);
            }
          });
        }
      } catch (e) {
        setError(e);
      }
    };

    fetchUsers();
  }, [subscribe]);

  useEffect(() => {}, []);
  if (error) {
    console.log(error);
    return <div>에러가 발생했습니다</div>;
  }
  return (
    <div style={{ width: "100%" }}>
      <Card>
        <Player
          ref={(player) => {
            setPlayer(player);
          }}
          playsInline
          poster={post.thumb_nail}
          src={post.video}
        >
          <BigPlayButton position="center" />
          <LoadingSpinner />
          <ControlBar autoHide={false}>
            <ReplayControl seconds={10} order={2.1} />
            <ForwardControl seconds={10} order={3.2} />
            <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} />
          </ControlBar>
        </Player>
        <Meta
          title={post.title}
          description={post.created_at}
          style={{ marginTop: "20px" }}
        />
        <div style={{ width: "100%", marginTop: "20px", padding: "10px" }}>
          <Avatar size="large" icon={<UserOutlined />} />
          {username}
          {subscribe ? (
            <Button onClick={Subscribe_del} value={post.id}>
              구독중
            </Button>
          ) : (
            <Button onClick={Subscribe_set} value={post.id}>
              구독
            </Button>
          )}
        </div>
      </Card>
      <CommentList post={post} />
    </div>
  );
}

export default PostDetailView;
