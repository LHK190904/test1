import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../../../components/logoutButton";
import { Modal, Input, Button, Form } from "antd";
import Navbar from "../../../components/navbar";
import authorService from "../../../services/authorService";

function ManageMaterial() {
  const location = useLocation();
  const [materials, setMaterials] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (authorService.checkPermission("PRODUCTION_STAFF")) {
      fetchMaterials();
    } else {
      navigate("/unauthorized");
    }
  }, [navigate]);

  const fetchMaterials = async () => {
    try {
      const response = await axiosInstance.get("/material/notGold");
      setMaterials(response.data.result || []);
    } catch (error) {
      console.error("Không thể lấy danh sách nguyên liệu:", error);
    }
  };

  const handleAddMaterial = () => {
    setIsEditMode(false);
    setCurrentMaterial(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditMaterial = (material) => {
    setIsEditMode(true);
    setCurrentMaterial(material);
    form.setFieldsValue(material);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    try {
      if (isEditMode) {
        await axiosInstance.put(`/material/${currentMaterial.id}`, values);
      } else {
        await axiosInstance.post("/material", values);
      }
      fetchMaterials();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Không thể lưu nguyên liệu:", error);
    }
  };

  return (
    <>
      <div className="bg-[#353640] text-white h-40 flex justify-between items-center px-10">
        <Link to={"/"}>
          <img
            className="h-[160px] w-auto"
            src="/src/assets/images/logo.png"
            alt="Logo"
          />
        </Link>
        <div className="flex-grow text-center">
          <h1 className="text-5xl">Nhân viên gia công</h1>
        </div>
        <div className="w-80 text-right">
          <LogoutButton />
        </div>
      </div>
      <Navbar />
      <div className="bg-[#434343] text-gray-100 pl-5">
        <Link
          className={`mr-4 ${
            location.pathname === "/production-staff/process-orders"
              ? "underline font-bold"
              : ""
          }`}
          to="/production-staff/process-orders"
        >
          Xử lí đơn hàng
        </Link>
        <Link
          className={`${
            location.pathname === "/production-staff/manage-materials"
              ? "underline font-bold"
              : ""
          }`}
          to="/production-staff/manage-materials"
        >
          Quản lí vật liệu
        </Link>
      </div>
      <div className="bg-[#434343] min-h-screen w-screen flex justify-center items-center">
        <div className="w-3/4 bg-gray-300 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl">Bảng nguyên vật liệu</h1>
            <Button type="primary" onClick={handleAddMaterial}>
              Thêm vật liệu
            </Button>
          </div>
          <table className="w-full bg-white rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Loại</th>
                <th className="p-4 text-left">Giá theo đơn vị</th>
                <th className="p-4 text-left">Tên vật liệu</th>
                <th className="p-4 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id} className="border-b">
                  <td className="p-4">{material.type}</td>
                  <td className="p-4">{material.pricePerUnit}</td>
                  <td className="p-4">{material.materialName}</td>
                  <td className="p-4 text-center">
                    <Button
                      type="link"
                      onClick={() => handleEditMaterial(material)}
                    >
                      Chỉnh sửa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title={isEditMode ? "Chỉnh sửa vật liệu" : "Thêm mới vật liệu"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Loại"
            name="type"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giá theo đơn vị"
            name="pricePerUnit"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Tên vật liệu"
            name="materialName"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ManageMaterial;
