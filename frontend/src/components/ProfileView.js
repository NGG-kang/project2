import React, { useState, useEffect } from "react";
import { useAppContext } from "store";
import { Table, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import Moment from "react-moment";
import axios from "axios";

const columns = [
  {
    title: "영상 썸네일",
    dataIndex: "thumb_nail",
    render: (thumb_nail, row) => (
      <Link to={{ pathname: "/post/" + row.id }}>
        <img width={100} src={thumb_nail} />
      </Link>
    ),
  },
  {
    title: "제목",
    dataIndex: "title",
    render: (title, row) => (
      <Link to={{ pathname: "/post/" + row.id }}>{title}</Link>
    ),
  },
  {
    title: "날짜",
    dataIndex: "created_at",
    render: (created_at) => (
      <Moment fromNow ago>
        {created_at}
      </Moment>
    ),
  },
];

// 로그인한 User 개인 PostProfileView
// 개인 업로드한 포스트 수정가능
export default function ProfileView() {
  const history = useHistory();

  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [hasSelected, setHasSelected] = useState(false);
  const [change, setChange] = useState(false);
  const [userCheck, setUserCheck] = useState(false);
  const user = history.location.pathname.split("/").pop();

  const onSelectChange = (selectlowkey) => {
    console.log("selectedRowKeys changed: ", selectlowkey, hasSelected);

    setSelectedRowKeys(selectlowkey);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    if (selectedRowKeys.length > 0) {
      if (userCheck) {
        setHasSelected(true);
      } else {
        setHasSelected(false);
      }
    } else {
      setHasSelected(false);
    }
  }, [selectedRowKeys, userCheck]);

  const Posts_del = async (id) => {
    console.log(id);

    const instance = axios.create({
      baseURL: "",
      headers: headers,
    });
    const response = await instance.delete(
      `/post/${id}/`,
      { pk: id },
      {
        headers,
      }
    );
    if (response.status === 204) {
      setChange(true);
      setSelectedRowKeys([]);
      setHasSelected(false);
      console.log(change);
      console.log("del sueccess");
      notification.open({
        message: "게시글 삭제 성공",
        description: "화면을 리프레쉬 합니다.",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
    } else {
      notification.open({
        message: "삭제 실패",
        description: "자신의 게시글이 아닙니다.",
        icon: <FrownOutlined style={{ color: "#108ee9" }} />,
      });
    }

    console.log(response);
  };

  const onDelete = () => {
    console.log(selectedRowKeys);
    selectedRowKeys.map((id) => {
      Posts_del(id);
    });
    setSelectedRowKeys([]);
  };

  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  // username별 post목록 불러오기
  useEffect(() => {
    async function fn() {
      console.log("user", user);
      const instance = axios.create({
        baseURL: "",
        headers: headers,
      });
      const response = await instance.get("/post_user/", {
        params: {
          user: user,
        },
      });
      setUserCheck(response.data.userCheck);
      setData(response.data.data);
    }
    fn();
    setChange(false);
    setSelectedRowKeys([]);
    setHasSelected(false);
  }, [change, user]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={onDelete} disabled={!hasSelected}>
          Delete
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey="id"
      />
    </div>
  );
}
