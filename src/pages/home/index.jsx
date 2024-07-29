import { useEffect, useState } from "react";
import uploadFile from "../../utils/upload";
import axiosInstance from "../../services/axiosInstance";
import authService from "../../services/authService";
import { Form, Input, Modal, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Tutorial from "../../components/tutorial";
import "./style.css";
import RevealAppear from "../../components/revealAppear";

function Home() {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [goldPrice, setGoldPrice] = useState([]);
  const [materialPrice, setMaterialPrice] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const initialForm = {
    category: "",
    goldType: "",
    materialWeight: "",
    mainStoneId: 0,
    subStoneId: 0,
    description: "",
    updated: "",
    sellCost: 0,
    buyCost: 0,
    listURLImage: [],
  };
  const [formData, setFormData] = useState({
    category: "",
    goldType: "",
    materialWeight: "",
    mainStoneId: 0,
    subStoneId: 0,
    description: "",
    updated: "",
    sellCost: 0,
    buyCost: 0,
    listURLImage: [],
  });

  const fetchData = async () => {
    try {
      const goldResponse = await axiosInstance.get(`api/gold/prices`);
      const goldData = goldResponse.data.DataList.Data.map((item, index) => ({
        goldType: item[`@n_${index + 1}`],
        sellCost: item[`@pb_${index + 1}`],
        buyCost: item[`@pb_${index + 1}`],
        updated: item[`@d_${index + 1}`],
      }));
      setGoldPrice(goldData);
      const materialResponse = await axiosInstance.get(`material/notGold`);
      setMaterialPrice(materialResponse.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error("Vui lòng chọn file hình ảnh");
      return;
    }
    setUploading(true);
    try {
      const uploadedURLs = await Promise.all(
        fileList.map((file) => uploadFile(file.originFileObj, "requests"))
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        listURLImage: [...prevFormData.listURLImage, ...uploadedURLs],
      }));
      message.success("Tải ảnh thành công");
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleHideModal = () => {
    setIsModalOpen(false);
  };

  const handleShowModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        message.error("Vui lòng đăng nhập để đặt yêu cầu");
        throw new Error("Vui lòng đăng nhập để đặt yêu cầu");
      }
      await axiosInstance.post(`/requests/${user.id}`, formData);
      handleHideModal();
      message.success("Đặt yêu cầu thành công");
      form.resetFields();
    } catch (error) {
      message.error("Vui lòng cập nhật địa chỉ, SĐT");
    }
  };

  const handleGoldTypeChange = (value) => {
    const selectedGoldTypeData = goldPrice.find(
      (item) => item.goldType === value
    );
    if (selectedGoldTypeData) {
      form.setFieldsValue({
        goldType: value,
      });
      setFormData((prevFormData) => ({
        ...prevFormData,
        goldType: value,
        updated: selectedGoldTypeData.updated,
        sellCost: selectedGoldTypeData.sellCost,
        buyCost: selectedGoldTypeData.buyCost,
      }));
    }
  };

  const handleFormChange = (changedValues, allValues) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...allValues,
    }));
  };

  return (
    <div className="w-screen min-h-screen bg-[#434343] text-[#F7EF8A]">
      <div className="grid grid-cols-12">
        <div className="col-span-12 relative">
          <video
            className="w-screen h-auto"
            autoPlay
            loop
            muted
            src="./bgvideo.webm"
          ></video>
          <h1 className="text-[#F7EF8A] text-center text-7xl my-4 font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shiny-text">
            WELCOME TO LUXE
          </h1>
        </div>
        <div className="col-span-12">
          <RevealAppear>
            <h1 className="text-center text-4xl my-10 font-bold">
              QUY TRÌNH ĐẶT GIA CÔNG TẠI LUXE
            </h1>
          </RevealAppear>
        </div>
        <div className="col-start-2 col-span-10">
          <RevealAppear>
            <Tutorial />
          </RevealAppear>
        </div>

        <button
          onClick={handleShowModal}
          className="col-start-5 col-span-4 bg-[#F7EF8A] text-black p-4 my-4 rounded-lg font-bold hover:bg-gradient-to-br hover:from-white hover:to-[#fcec5f]"
        >
          ĐẶT YÊU CẦU
        </button>
      </div>
      <Modal
        title="YÊU CẦU TƯ VẤN GIA CÔNG"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleHideModal}
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          initialValues={initialForm}
          onValuesChange={handleFormChange}
        >
          <Form.Item
            name="category"
            label="Loại trang sức:"
            rules={[
              { required: true, message: "Vui lòng chọn loại trang sức" },
            ]}
          >
            <Select>
              <Select.Option value="RING">Nhẫn</Select.Option>
              <Select.Option value="NECKLACE">Dây chuyền</Select.Option>
              <Select.Option value="BRACELET">Vòng tay</Select.Option>
              <Select.Option value="EARRINGS">Bông tai</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="goldType"
            label="Vật liệu:"
            rules={[{ required: true, message: "Vui lòng nhập vật liệu" }]}
          >
            <Select onChange={handleGoldTypeChange}>
              {goldPrice.map((item, index) => (
                <Select.Option key={index} value={item.goldType}>
                  {item.goldType}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="materialWeight"
            label="Trọng lượng vật liệu: (Đơn vị: Chỉ)"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trọng lượng vật liệu",
              },
              {
                validator: (_, value) => {
                  if (isNaN(value) || parseFloat(value) <= 0) {
                    return Promise.reject(
                      new Error("Trọng lượng vật liệu là số lớn hơn 0")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="mainStoneId" label="Đá chính (Nếu có):">
            <Select allowClear>
              {materialPrice.map((item, index) => (
                <Select.Option key={index} value={item.id}>
                  {item.materialName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="subStoneId" label="Đá phụ (Nếu có):">
            <Select allowClear>
              {materialPrice.map((item, index) => (
                <Select.Option key={index} value={item.id}>
                  {item.materialName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả:"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Bản thiết kế (Nếu có):">
            <Upload
              multiple
              onChange={handleFileChange}
              fileList={fileList}
              showUploadList={true}
              accept=".png,.jpg"
              customRequest={({ onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
            {fileList.length > 0 && (
              <Button onClick={handleUpload} loading={uploading}>
                Tải lên
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Home;
