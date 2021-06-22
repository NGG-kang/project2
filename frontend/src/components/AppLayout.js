import "./AppLayout.css";
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import { Layout, Menu, Input, Button } from "antd";
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

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

function AppLayout({ children }) {
  const {
    store: { jwtToken },
  } = useAppContext();
  const history = useHistory();

  const [collapsed, setCollapsed] = useState(false);
  // const [subscribes, setSubscribe] = useState([]);
  const [sub_users, setSub_Users] = useState([]);
  const [error, setError] = useState(null);

  const [prev, setPrev] = useState(null);
  const [search, setSearch] = useState(null);

  const [prevProfile, setprevProfile] = useState(null);
  const [profile, setProfile] = useState(null);

  const [logowidth, setLogoWidth] = useState(5);

  const onSearch = (value) => {
    setSearch(value);
  };
  const ViewProfile = (value) => {
    setProfile(value.key);
  };

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

  const GoPostNew = () => {
    history.push({
      pathname: "/accounts/studio/",
    });
  };

  useEffect(() => {
    if (prevProfile !== profile) {
      console.log(profile, prevProfile);
      history.push({
        pathname: "/accounts/profile/" + profile,
      });
    }
    setprevProfile(profile);
  }, [profile]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };

        const response = await axiosInstance.get("/subscribe/", {
          headers,
        });
        if (response.data.length > 0) {
          setSub_Users(response.data[0]["sub_users"]);
          // setSubscribe(response.data);
        }
      } catch (e) {
        setError(e);
      }
    };

    fetchUsers();
  }, [profile]);

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
        collapsedWidth="0"
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
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="home" icon={<PieChartOutlined />}>
            <Link to="/">홈</Link>
          </Menu.Item>
          <SubMenu key="구독" icon={<TeamOutlined />} title="구독">
            {sub_users && sub_users.length === 0 && (
              <Menu.Item key="None">구독자가 없습니다</Menu.Item>
            )}
            {sub_users &&
              sub_users.map((sub_user, index) => (
                <Menu.Item key={sub_user} onClick={ViewProfile}>
                  {sub_user}
                </Menu.Item>
              ))}
          </SubMenu>
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

          <Button style={{ margin: 16 }} onClick={GoPostNew}>
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
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
