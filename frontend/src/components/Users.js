import { axiosInstance } from "api";
import { useHistory, useLocation, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAppContext } from "store";
import { deleteToken, deleteRefreshToken } from "store";
import { UserOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, notification, Alert } from "antd";

function Users() {
  const [user, setUser] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const {
    store: { jwtToken, refreshToken },
  } = useAppContext();
  const { dispatch } = useAppContext();
  const headers = {
    Authorization: `Bearer ${jwtToken}`,
  };
  const { from: logoutRedirectUrl } = location.state || {
    from: { pathname: "/accounts/login/" },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUser(null);
        if (headers) {
          const response = await axiosInstance.get("/login-user/", {
            headers,
          });
          setUser(response.data[0]);
        } else {
          setUser(null);
        }
      } catch (e) {}
    };

    fetchUsers();
  }, []);

  const Logout = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/token/refresh/",
        {
          refresh: refreshToken,
        },
        {
          headers,
        }
      );
      console.log(response);
      dispatch(deleteToken(jwtToken));
      dispatch(deleteRefreshToken(refreshToken));

      notification.open({
        message: "로그아웃, 로그인 페이지로 이동합니다.",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      history.push(logoutRedirectUrl);
    } catch (e) {
      notification.open({
        message: "로그아웃 실패",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
    }
  };

  if (!user)
    return (
      <Link to="/accounts/login/" style={{ flex: 1 }}>
        <Button style={{ marginRight: 10, flex: 1 }}>
          로그인
          <UserOutlined />
        </Button>
      </Link>
    );
  return (
    <>
      <Link to={{ pathname: "/accounts/studio/" }}>
        <Button>
          {user.username}
          <UserOutlined />
        </Button>
      </Link>
      <Button style={{ margin: "16px" }} onClick={Logout}>
        로그아웃
      </Button>
    </>
  );
}

export default Users;
