import React, { useEffect, useState } from "react";
import { useAppContext } from "store";
import axios from "axios";
import { Comment as Commentantd, Form, Input, List, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { parseErrorMessages } from "utils/forms";
import { axiosInstance } from "api";

const { TextArea } = Input;

function CommentList({ post }) {
  const {
    store: { jwtToken },
  } = useAppContext();
  // 댓글 작성자인지 파악하기 위한 user
  const [user, setUser] = useState(null);
  // 댓글 목록 저장하기 위한 commentList
  const [commentList, setCommentList] = useState([]);
  // 성공 여부 success값
  const [success, setSuccess] = useState(true);
  // 수정, 작성버튼 바꾸기 위한 true false
  const [modify, setModify] = useState(false);
  // 수정할 아이디 받기위한 modifyid
  const [modifyid, setModifyId] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  // Textarea comment 값 작성이나 수정시 사라지게 만들어야함
  const [comment, setComment] = useState("");
  const headers = { Authorization: `Bearer ${jwtToken}` };

  // GET CommentList
  useEffect(() => {
    async function fn() {
      console.log(post.id);

      const response = await axiosInstance.get(`/posts/${post.id}/comments/`, {
        headers,
      });
      console.log(response.data);
      setCommentList(response.data);
      setSuccess(false);
    }
    fn();
  }, [success, post]);

  // GET Login User
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (headers) {
          const response = await axiosInstance.get("/login-user/", {
            headers,
          });
          setUser(response.data[0]); // 데이터는 response.data 안에 들어있습니다.
          console.log(response);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchUsers();
  }, []);

  // Comment Create
  const onSubmit = async () => {
    const apiUrl = `/posts/${post.id}/comments/`;
    console.log(apiUrl);
    try {
      const response = await axiosInstance.post(
        apiUrl,
        { message: comment },
        { headers }
      );
      if (response.status === 201) {
        setSuccess(true);
        setComment("");
        setModify(false);
      }
    } catch (error) {
      if (error.response) {
        const { status, data: fieldsErrorMessages } = error.response;
        if (typeof fieldsErrorMessages === "string") {
          notification.open({
            message: "서버 오류",
            description: `에러) ${status} 응답을 받았습니다. 서버 에러를 확인해주세요.`,
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });
        } else {
          setFieldErrors(parseErrorMessages(fieldsErrorMessages));
        }
      }
    }
  };

  // Comment Delete
  const CommentDelete = async (event) => {
    const comment_id = event.target.id;
    try {
      const instance = axios.create({
        baseURL: "",
        headers: headers,
      });
      const response = await instance.delete(
        `/posts/${post.id}/comments/${comment_id}/`
      );
      if (response.status === 204) {
        console.log("del sueccess");
        notification.open({
          message: "댓글 삭제 성공",
          description: `${response.status} 화면을 리프레쉬 합니다.`,
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        console.log(response);
        setSuccess(true);
        setModify(false);
      }
    } catch (e) {
      if (e.response.status === 400) {
        notification.open({
          message: "삭제 실패",
          description: `작성자가 아닙니다. ${e}`,
          icon: <FrownOutlined style={{ color: "#108ee9" }} />,
        });
      } else {
        notification.open({
          message: "삭제 실패",
          description: `수정에 실패했습니다. ${e}`,
          icon: <FrownOutlined style={{ color: "#108ee9" }} />,
        });
      }
    }
  };

  // Comment Modify
  const CommentModify = async () => {
    const comment_id = modifyid;
    try {
      const instance = axios.create({
        baseURL: "",
        headers: headers,
      });
      const response = await instance.put(
        `/posts/${post.id}/comments/${comment_id}/`,
        { message: comment }
      );
      if (response.status === 204) {
        setModify(false);
        setComment("");
        notification.open({
          message: "게시글 수정 성공",
          description: `${response.status} 화면을 리프레쉬 합니다.`,
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        console.log(response);
        setSuccess(true);
      }
    } catch (e) {
      if (e.response.status === 400) {
        notification.open({
          message: "수정 실패",
          description: `작성자가 아닙니다. ${e}`,
          icon: <FrownOutlined style={{ color: "#108ee9" }} />,
        });
      } else {
        notification.open({
          message: "수정 실패",
          description: `수정에 실패했습니다. ${e}`,
          icon: <FrownOutlined style={{ color: "#108ee9" }} />,
        });
      }
    }
  };

  const CommentChange = (e) => {
    setComment(e.target.value);
    setModifyId(e.target.id);
    setModify(true);
    console.log(modify);
  };

  const ModifyButton = (
    <button
      type="submit"
      onClick={CommentModify}
      className="ant-btn ant-btn-primary"
    >
      수정
    </button>
  );
  const AddButon = (
    <button
      type="submit"
      onClick={onSubmit}
      className="ant-btn ant-btn-primary"
    >
      작성
    </button>
  );

  return (
    <div style={{ marginTop: "10px" }}>
      <>
        <Form.Item>
          <TextArea
            rows={4}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            required={true}
          />
        </Form.Item>
        <Form.Item>{!modify ? AddButon : ModifyButton}</Form.Item>
      </>
      <List
        className="comment-list"
        header={`${commentList.length} replies`}
        itemLayout="horizontal"
        dataSource={commentList}
        renderItem={(item) => (
          <li key={item.id}>
            <Commentantd
              id={item.id}
              author={item.author.username}
              content={item.message}
              datetime={item.created_at}
            />
            <button
              hidden={item.author.id !== user.id}
              disabled={item.author.id !== user.id}
              id={item.id}
              className="ant-btn ant-btn-primary"
              onClick={CommentDelete}
            >
              삭제
            </button>
            <button
              style={{ marginLeft: "10px" }}
              hidden={item.author.id !== user.id}
              disabled={item.author.id !== user.id}
              id={item.id}
              value={item.message}
              className="ant-btn ant-btn-primary"
              onClick={CommentChange}
            >
              수정
            </button>
          </li>
        )}
      />
    </div>
  );
}

export default CommentList;
