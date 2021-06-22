import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { Comment as Commentantd } from "antd";

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" onClick={onSubmit} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </>
);

export default function Comment(handleSubmit) {
  const [value, setValue] = useState(null);

  const handleChange = useEffect(
    (value) => {
      setValue(value);
      console.log(value);
    },
    [value]
  );

  return (
    <>
      <Commentantd
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            value={value}
          />
        }
      />
    </>
  );
}
