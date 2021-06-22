import "./AppLayout.css";
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import { Layout, Menu, Input, Button, Modal, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import { useAppContext } from "store";
import { axiosInstance } from "api";
import Users from "./Users";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  TeamOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import logoImage from "logo/logo.png";
import VideoNew from "components/VideoNew";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

export default function PostNewLayout({ children }) {
  const {
    store: { jwtToken },
  } = useAppContext();
  const history = useHistory();

  const [collapsed, setCollapsed] = useState(false);
  // const [subscribes, setSubscribe] = useState([]);
  const [IsUpload, setIsUpload] = useState(false);
  const [error, setError] = useState(null);

  const [prev, setPrev] = useState(null);
  const [search, setSearch] = useState(null);

  const [logowidth, setLogoWidth] = useState(5);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  const onSearch = (value) => {
    setSearch(value);
  };

  // 모달관련
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  // 여기까지

  const props = {
    name: "file",
    multiple: false,
    action: "/video/",
    headers: headers,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
        setIsUpload(true);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setIsModalVisible(false);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  // Upload 끝나면 Modal Destroy
  useEffect(() => {
    if (IsUpload) {
      setIsUpload(false);
    }
  }, [IsUpload]);

  // search가 달라짐에 따라 history push하는 useEffect
  useEffect(() => {
    if (prev !== search) {
      console.log(prev, search);
      history.push({
        pathname: "/search",
        search: `title=${search}`,
      });
    }
    setPrev(search);
  }, [search]);

  // 레이아웃에 따라 메뉴바 사이즈 달라지는 함수
  const toggle = (col, type) => {
    console.log(col, type);
    setCollapsed(!collapsed);
    if (collapsed) {
      setLogoWidth(5);
    } else {
      setLogoWidth(2.5);
      console.log(logowidth);
    }
  };

  if (error) {
    console.log(error);
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggle}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
      >
        {/* <div
          style={{
            width: "100%",
            height: `${logowidth}%`,
            marginTop: "10px",
            textAlign: "center",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          <Link to="/">
            <img src={logoImage} style={{ height: "75%" }} alt="logo" />
          </Link>
        </div> */}
        <Button type="primary" onClick={toggle} style={{ margin: 16 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
          )}
        </Button>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="home" icon={<PieChartOutlined />}>
            <Link to="/">홈</Link>
          </Menu.Item>
          <Menu.Item
            key="뒤로가기"
            icon={<PieChartOutlined />}
            onClick={() => {
              history.goBack();
            }}
          >
            뒤로가기
          </Menu.Item>
          <Menu.Item key="재생목록" icon={<PieChartOutlined />}>
            <Link to="/">재생목록</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ padding: 0, display: "flex" }}
        >
          {/* {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )} */}
          <Search
            placeholder="input search text"
            allowClear
            onSearch={onSearch}
            style={{ width: "400px", margin: 15, flex: 20 }}
          />

          <Button
            style={{ margin: 16 }}
            onClick={() => setIsModalVisible(true)}
          >
            만들기
            <VideoCameraAddOutlined />
          </Button>

          <Users style={{ flex: 1 }} />
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 500,
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
          <Modal
            title="동영상 업로드"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <VideoNew props={props} />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}
