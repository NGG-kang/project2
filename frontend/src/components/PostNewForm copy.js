import React, { useState } from "react";
import { Form, Input, Button, Upload, notification } from "antd";
import {
  FrownOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { parseErrorMessages } from "utils/forms";
import { axiosInstance } from "api";
import { useAppContext } from "store";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

export default function PostNewForm() {
  const {
    store: { jwtToken },
  } = useAppContext();
  const [videoup, setVideo] = useState({});
  const [imageup, setImage] = useState({});
  const [videoList, setVideoList] = useState({});
  const [imageList, setImageList] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const history = useHistory();

  // 글 작성 onFinish
  const onFinish = (values) => {
    console.log(values);
    console.log(values.video[0]);
    const { title, video, thumb_nail } = values;
    video.forEach((item) => setVideoList(item));
    thumb_nail.forEach((item) => setImageList(item));
    console.log("imageup:", imageup);
    console.log("videoup:", videoup);

    const formData = new FormData();
    formData.append("title", title["title"]);
    formData.append("video", videoList.originFileObj);
    formData.append("thumb_nail", imageList.originFileObj);
    console.log(formData);
    const headers = { Authorization: `Bearer ${jwtToken}` };
    const fn = async () => {
      try {
        const response = await axiosInstance.post("/post/", formData, {
          headers,
        });
        console.log("success response :", response);
        history.push("/");
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
    fn();
  };

  // 영상, 썸네일 업로드 이벤트 확인
  const ImageFile = (e) => {
    console.log("Image Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    console.log(imageup);
    return e && e.fileList;
  };
  const VideoFile = (e) => {
    console.log("Video Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // 썸네일 업로드 확인
  const ImageonChange = (info) => {
    const nextState = {};
    switch (info.file.status) {
      case "uploading":
        nextState.selectedFileList = [info.file];
        break;
      case "done":
        nextState.selectedFile = info.file;
        nextState.selectedFileList = [info.file];
        break;

      default:
        // error or removed
        nextState.selectedFile = null;
        nextState.selectedFileList = [];
    }
    setImage(nextState);
    console.log("image change");
  };

  // 영상 업로드 확인
  const VideoonChange = (info) => {
    const nextState = {};
    switch (info.file.status) {
      case "uploading":
        nextState.selectedFileList = [info.file];
        break;
      case "done":
        nextState.selectedFile = info.file;
        nextState.selectedFileList = [info.file];
        break;

      default:
        // error or removed
        nextState.selectedFile = null;
        nextState.selectedFileList = [];
    }
    console.log("video change");
    setVideo(nextState);
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Form.Item
        name={["title", "title"]}
        label="title"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="thumb_nail"
        label="thumb_nail"
        valuePropName="fileList"
        getValueFromEvent={ImageFile}
        extra="썸네일 이미지를 업로드 하세요"
        rules={[{ required: true }]}
      >
        <Upload
          name="thumb_nail"
          customRequest={dummyRequest}
          onChange={ImageonChange}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Dragger">
        <Form.Item
          name="video"
          label="video"
          valuePropName="fileList"
          getValueFromEvent={VideoFile}
          noStyle
          rules={[{ required: true }]}
        >
          <Upload.Dragger
            name="video"
            customRequest={dummyRequest}
            onChange={VideoonChange}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">클릭 또는 드래그로 업로드하세요</p>
          </Upload.Dragger>
        </Form.Item>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
