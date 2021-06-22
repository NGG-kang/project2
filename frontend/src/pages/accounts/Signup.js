import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./AccountsLayout.css";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function Signup() {
  const [form] = Form.useForm();
  const [fieldErrors, setFieldErrors] = useState({});
  const history = useHistory();

  // 회원가입 onFinish
  const onFinish = (values) => {
    async function fn() {
      const axiosInstance = axios.create({
        baseURL: "",
      });
      const { username, password } = values;
      const data = { username, password };

      try {
        await axiosInstance.post("/accounts/signup/", data);

        notification.open({
          message: "회원가입 성공",
          description: "로그인 페이지로 이동합니다.",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });

        history.push("/accounts/login");
      } catch (error) {
        if (error.response) {
          console.log(error.response);
          notification.open({
            message: "회원가입 실패",
            description: "아이디/암호를 확인해주세요.",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });

          const { data: fieldsErrorMessages } = error.response;
          // fieldsErrorMessages => { username: "m1 m2", password: [] }
          // python: mydict.items()
          try {
            setFieldErrors(
              Object.entries(fieldsErrorMessages).reduce(
                (acc, [fieldName, errors]) => {
                  // errors : ["m1", "m2"].join(" ") => "m1 "m2"
                  acc[fieldName] = {
                    validateStatus: "error",
                    help: errors.join(" "),
                  };
                  return acc;
                },
                {}
              )
            );
            console.log(fieldErrors);
          } catch {}
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
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        style={{
          width: 600,
          height: 600,
          border: "1px solid #CECACA",
          borderRadius: 10,

          margin: "0 auto",
          paddingTop: 200,

          paddingRight: 90,
          display: "inline",
        }}
      >
        <Form.Item
          name="username"
          label="아이디"
          tooltip="아이디를 입력하세요"
          rules={[
            {
              required: true,
              message: "아이디를 입력하세요",
              whitespace: true,
            },
          ]}
          hasFeedback
          {...fieldErrors.username}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="비밀번호"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
          {...fieldErrors.password}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="비밀번호 확인"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            회원가입
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
