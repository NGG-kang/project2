import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Radio,
  notification,
  Space,
  message,
} from "antd";

import {
  SmileOutlined,
  FrownOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useAppContext } from "store";
import { axiosInstance } from "api";
import { convertURLtoFile } from "utils/convertURLtoFile";
import axios from "axios";

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

export default function PostEditForm({ match }) {
  const [form] = Form.useForm();
  const [radioval, setRadioVal] = useState(0);

  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `Bearer ${jwtToken}` };
  const history = useHistory();
  const [postData, setPostData] = useState([]);
  const [imageup, setImage] = useState([]);
  const [imageList, setImageList] = useState([]);
  const id = match.params.id;

  // Get : Post Modify하기 위한 PostDetail
  useEffect(() => {
    async function fn() {
      const response = await axiosInstance.get(`/post/${id}/`, {
        headers,
      });
      console.table(response.data);
      setPostData(response.data);
      form.setFieldsValue({
        title: response.data.title,
        description: response.data.description,
        public_status: response.data.public_status,
      });
    }
    console.log(postData);

    setRadioVal(postData.public_status);
    if (postData.thumb_nail) {
      const filename = postData.public_status.split("/").pop();
      setImageList([
        {
          uid: "-1",
          name: filename,
          status: "done",
          url: postData.thumb_nail,
          thumbUrl: postData.thumb_nail,
        },
      ]);
      console.log("썸네일구간");
    }

    fn();
  }, []);

  // function : 영상, 썸네일 업로드 이벤트 확인
  const ImageFile = (e) => {
    console.log("Image Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // function : 썸네일 업로드 확인
  const ImageonChange = (info) => {
    const nextState = {};
    if (info.file.status !== "uploading") {
      nextState.selectedFileList = [info.file];
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      nextState.selectedFile = info.file;
      nextState.selectedFileList = [info.file];
    } else if (info.file.status === "error") {
      nextState.selectedFile = null;
      nextState.selectedFileList = [];
      message.error(`${info.file.name} file upload failed.`);
    }
    setImage(nextState);
    console.log("image change");
  };

  // Put : 글 수정하기
  const PostModify = async (data) => {
    const { title, description, thumb_nail, public_status } = data;
    console.log(title, description, public_status);
    thumb_nail.forEach((item) => setImageList(item));
    const formData = new FormData();
    formData.append("title", title);
    formData.append("thumb_nail", imageList.originFileObj);
    formData.append("description", description);
    formData.append("public_status", public_status);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    try {
      const instance = axios.create({
        baseURL: "",
        headers: headers,
      });
      const response = await instance.put(`/post-user-view/${id}/`, {
        formData,
      });
      if (response.status === 204) {
        notification.open({
          message: "게시글 수정 성공",
          description: `${response.status} 이전 화면으로 돌아갑니다.`,
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        history.goBack();
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

  // function : 라디오 버튼 디폴트값 설정
  const radioChange = (e) => {
    console.log("radio checked", e.target.value);
    setRadioVal(e.target.value);
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={PostModify}
      form={form}
      validateMessages={validateMessages}
      style={{ width: "80%", marginLeft: "-20%" }}
    >
      <Form.Item name="title" label="title" rules={[{ required: true }]}>
        <Input maxLength="100" placeholder="영상의 제목을 입력해주세요" />
      </Form.Item>
      <Form.Item
        name="description"
        label="description"
        rules={[{ required: false }]}
      >
        <Input placeholder="회원들에게 이 영상의 설명을 해주세요" />
      </Form.Item>

      <Form.Item
        name="thumb_nail"
        label="thumb_nail"
        valuePropName="fileList"
        getValueFromEvent={ImageFile}
        required={[{ required: true }]}
        extra="미리보기 이미지를 업로드 하세요"
      >
        <Upload
          name="thumb_nail"
          accept="image/*"
          customRequest={dummyRequest}
          onChange={ImageonChange}
          maxCount={1}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="public_status"
        label="공개여부"
        rules={[{ required: true }]}
      >
        <Space direction="vertical">
          <Radio.Group onChange={radioChange} value={radioval}>
            <Radio value={1}>공개</Radio>
            <Radio value={2}>비공개</Radio>
            <Radio value={3}>일부공개</Radio>
          </Radio.Group>
        </Space>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
