import React from "react";
import { Form, Input, Button, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory, useLocation, Link } from "react-router-dom";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { axiosInstance } from "api";
import { useAppContext } from "store";
import { setToken, setRefreshToken } from "store";
import GoogleLogin from "react-google-login";
import "./AccountsLayout.css";

function Login() {
  const { dispatch } = useAppContext();
  const location = useLocation();
  const history = useHistory();
  const { from: loginRedirectUrl } = location.state || {
    from: { pathname: "/" },
  };

  // google auth login
  // 로컬환경만 가능하게 해서 불가능
  const responseGoogle = async (accesstoken) => {
    try {
      const response = await axiosInstance.post(
        "/accounts/rest-auth/google/",
        accesstoken.qc
      );
      const {
        data: { access_token: token },
      } = response;
      dispatch(setToken(token));
      notification.open({
        message: "로그인 성공",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      history.push(loginRedirectUrl);
    } catch (error) {
      console.log(error);
      if (error.response) {
        notification.open({
          message: "로그인 실패",
          description: "아이디/암호를 확인해주세요.",
          icon: <FrownOutlined style={{ color: "#ff3333" }} />,
        });
      }
    }
  };

  // login onfinish
  const onFinish = (values) => {
    console.log(values);
    async function fn() {
      const { username, password } = values;

      const data = { username, password };
      try {
        const response = await axiosInstance.post(
          "http://15.164.104.62:8000/api/token/",
          data
        );
        const {
          data: { access: token, refresh: rfresh_token },
        } = response;
        console.log(response.data);
        dispatch(setToken(token));
        dispatch(setRefreshToken(rfresh_token));
        notification.open({
          message: "로그인 성공",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        // history.goBack();
        history.push(loginRedirectUrl);
      } catch (error) {
        if (error.response) {
          notification.open({
            message: "로그인 실패",
            description: "아이디/암호를 확인해주세요.",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });
        }
      }
    }
    fn();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        style={{
          width: 600,
          height: 600,
          border: "1px solid #CECACA",
          borderRadius: 10,

          margin: "0 auto",
          paddingTop: 200,
          paddingLeft: 20,
          paddingRight: 20,
          display: "inline",
        }}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <Link to="/accounts/signup">회원가입</Link>
        </Form.Item>
        <GoogleLogin
          clientId="2119196737-s0dnq2647meuc6g63m9mngc7bjs3au0p.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </Form>
    </div>
  );
}

export default Login;
