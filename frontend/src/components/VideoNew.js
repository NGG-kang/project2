import React from "react";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

export default function VideoNew({ props }) {
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">클릭 또는 드래그로 업로드하세요</p>
      <p className="ant-upload-hint">
        업로드가 진행되는동안 이 페이지를 벗어나지 마시오
      </p>
    </Dragger>
  );
}
