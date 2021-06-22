import React, { useState, useEffect } from "react";
import { useAppContext } from "store";
import { Table, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import axios from "axios";
// Table에 나올 column들 지정

// 모든 유저에게 공개되는 ProfileView
// 그 유저의 업로드한 동영상만 보여준다.(pubic만 가능)
export default function UserProfileView({ upload }) {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [hasSelected, setHasSelected] = useState(false);
  const [change, setChange] = useState(false);

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
      setHasSelected(true);
    } else {
      setHasSelected(false);
    }
  }, [selectedRowKeys]);

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

  // 요청 user의 post목록 불러오기
  useEffect(() => {
    async function fn() {
      const instance = axios.create({
        baseURL: "",
        headers: headers,
      });
      const response = await instance.get("/post-user-view/");
      setData(response.data);
      console.table(response.data);
      console.log(data);
    }

    fn();
    setChange(false);
    setSelectedRowKeys([]);
    setHasSelected(false);
  }, [change]);

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
        dataSource={data}
        tableLayout="fixed"
        rowKey="id"
        columns={[
          {
            title: "영상 썸네일",
            dataIndex: "thumb_nail",
            width: "44%",
            render: (thumb_nail, row, index) => (
              <Link to={{ pathname: "/accounts/studio/" + row.id + "/edit" }}>
                <img width={150} src={thumb_nail} alt={row.id} />
              </Link>
            ),
          },
          {
            title: "제목",
            dataIndex: "title",
            width: "20%",
            align: "left",
            render: (title, row) => (
              <Link to={{ pathname: "/post/" + row.id }}>{title}</Link>
            ),
          },
          {
            title: "공개상태",
            dataIndex: "public_status",
            width: "12%",
            render: (public_status, row) => {
              <>
                {() => {
                  switch (public_status) {
                    case "0":
                      return "초안";
                    case "1":
                      return "공개";
                    case "2":
                      return "비공개";
                    case "3":
                      return "일부공개";
                    default:
                      return "초안";
                  }
                }}
                {public_status}
              </>;
            },
          },
          {
            title: "날짜",
            dataIndex: "created_at",
            width: "12%",

            render: (created_at) => (
              <div>
                <Moment format="YYYY/MM/DD">{created_at}</Moment>
              </div>
            ),
          },
          {
            title: "조회수",
            dataIndex: "views_count",
            width: "12%",
            render: (views_count) => <>{views_count !== 0 && views_count}</>,
          },
        ]}
      />
    </div>
  );
}
