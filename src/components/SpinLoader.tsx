import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function SpinLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  );
}
