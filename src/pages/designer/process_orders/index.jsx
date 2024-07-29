import React, { useEffect, useState } from "react";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Upload, Modal, Image, Form } from "antd";
import uploadFile from "../../../utils/upload";
import LogoutButton from "../../../components/logoutButton";
import authService from "../../../services/authService";
import axiosInstance from "../../../services/axiosInstance";
import TextArea from "antd/es/input/TextArea";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar";
import authorService from "../../../services/authorService";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function ProcessOrder() {
  const [listItems, setListItems] = useState([]);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [form] = Form.useForm();
  const [designID, setDesignID] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchInfo = async () => {
    try {
      const designer = authService.getCurrentUser();
      const response = await axiosInstance.get(
        `/request-orders/getOrderForDesigner/${designer.id}`
      );
      setListItems(response.data.result || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authorService.checkPermission("DESIGN_STAFF")) {
      fetchInfo();
    } else {
      navigate("/unauthorized");
    }
  }, [navigate]);

  useEffect(() => {
    if (!uploading) {
      fetchInfo();
    }
  }, [uploading]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadDesignImages = async () => {
    const uploadPromises = fileList.map(async (file) => {
      if (!file.url) {
        const url = await uploadFile(
          file.originFileObj,
          `orders/${selectedOrderItem.id}`
        );
        return url;
      }
      return file.url;
    });
    return await Promise.all(uploadPromises);
  };

  const saveDesignData = async (uploadedUrls) => {
    const values = await form.validateFields();
    const { description } = values;
    const payload = {
      description,
      listURLImage: uploadedUrls,
    };

    if (designID) {
      const response = await axiosInstance.put(`/design/${designID}`, payload);
    } else {
      await axiosInstance.post(`/design/${selectedOrderItem.id}`, payload);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const uploadedUrls = await uploadDesignImages();
      await saveDesignData(uploadedUrls);

      setFileList([]);
      message.success("Tải lên thành công.");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      message.error("Tải lên thất bại.");
    } finally {
      setUploading(false);
    }
  };

  const fetchDesignData = async (orderId) => {
    try {
      const response = await axiosInstance.get(`/design/${orderId}`);
      return response.data.result;
    } catch (error) {
      console.error("Failed to fetch design data:", error);
      throw error;
    }
  };

  const initializeFormAndFileList = (designData) => {
    if (designData && designData.description) {
      form.setFieldsValue({
        description: designData.description,
      });

      // Cập nhật danh sách tệp tin với URL ảnh từ API, đảm bảo listURLImage luôn là một mảng
      const initialFileList = (designData.listURLImage || []).map(
        (url, index) => ({
          uid: index,
          name: `image-${index}`,
          status: "done",
          url,
        })
      );
      setFileList(initialFileList);
    } else {
      form.resetFields();
      setFileList([]);
    }
  };

  const openModal = async () => {
    try {
      let designData;
      try {
        designData = await fetchDesignData(selectedOrderItem.id);
      } catch (error) {
        designData = null;
      }
      setDesignID(designData?.id || null); // Đặt designID thành null nếu không có dữ liệu thiết kế
      if (designData && designData.id) {
        initializeFormAndFileList(designData);
      } else {
        form.resetFields();
        setFileList([]);
      }
      setIsModalOpen(true);
    } catch (error) {
      message.error("Failed to open modal.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFileList([]);
    form.resetFields();
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  const getStatusInVietnamese = (status) => {
    switch (status) {
      case "Waiting for customer's decision":
        return "Chờ khách hàng duyệt";
      case "Assigned":
        return "Chưa xử lí";
      case "Design Denied":
        return "Từ chối bản thiết kế";
      default:
        return status;
    }
  };

  return (
    <div className="bg-[#434343] min-h-screen w-screen">
      <div className="bg-[#353640] text-white h-40 flex justify-between items-center px-10">
        <Link to={"/"}>
          <img
            className="h-[160px] w-auto"
            src="/src/assets/images/logo.png"
            alt="Logo"
          />
        </Link>
        <div className="flex-grow text-center">
          <h1 className="text-5xl">Nhân viên thiết kế</h1>
        </div>
        <div className="w-80 text-right">
          <LogoutButton />
        </div>
      </div>
      <Navbar />

      <div className="mb-4 text-white">
        <Link
          className={`mr-4 ml-4 ${
            location.pathname === "/designer/process_orders"
              ? "underline font-bold"
              : ""
          }`}
          to="/designer/process_orders"
        >
          Xử lí đơn hàng
        </Link>
        <Link
          className={` ${
            location.pathname === "/designer/manage_designs"
              ? "underline font-bold"
              : ""
          }`}
          to="/designer/manage_designs"
        >
          Quản lí bản thiết kế
        </Link>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-start-1 col-span-8 bg-white m-4 rounded-lg p-4">
          <h1 className="text-center font-extrabold text-3xl">
            CHI TIẾT ĐƠN HÀNG {selectedOrderItem?.id}
          </h1>
          <div className="grid grid-cols-2 text-center mt-4">
            <div className="col-span-1 font-bold">MÔ TẢ TỪ KHÁCH HÀNG</div>
            <div className="col-span-1 font-bold">BẢN THIẾT KẾ</div>
            {selectedOrderItem ? (
              <React.Fragment key={selectedOrderItem.id}>
                <div className="col-span-1 mt-2">
                  {selectedOrderItem.description}
                </div>
                <div className="col-span-1 flex justify-center mt-2">
                  <Button icon={<UploadOutlined />} onClick={openModal}>
                    Thêm bản thiết kế
                  </Button>
                </div>
              </React.Fragment>
            ) : (
              <div className="col-span-5 text-center mt-16">
                Chọn đơn hàng để xem thông tin
              </div>
            )}
          </div>
        </div>

        <div className="col-start-9 col-span-4 bg-white m-4 rounded-lg p-4">
          <h1 className="text-center text-3xl font-bold">ĐƠN HÀNG</h1>
          <div className="grid grid-cols-2 text-center mt-4 max-h-screen">
            <div className="col-span-1 font-bold">Mã đơn</div>
            <div className="col-span-1 font-bold">TRẠNG THÁI</div>
            {listItems.map(
              (item) =>
                item.status !== "finished" &&
                item.status !== "Completed!!!" && (
                  <React.Fragment key={item.id}>
                    <div
                      className={`col-span-1 cursor-pointer ${
                        selectedOrderItem?.id === item.id ? "underline" : ""
                      }`}
                      onClick={() => setSelectedOrderItem(item)}
                    >
                      {item.id}
                    </div>
                    <div
                      className="col-span-1 cursor-pointer"
                      onClick={() => setSelectedOrderItem(item)}
                    >
                      {getStatusInVietnamese(item.status)}
                    </div>
                  </React.Fragment>
                )
            )}
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        title="Tải lên bản thiết kế"
        onCancel={closeModal}
        footer={[
          <Button key="back" onClick={closeModal}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
          >
            {uploading ? "Đang tải lên" : "Tải lên"}
          </Button>,
        ]}
      >
        <Form form={form} labelCol={{ span: 24 }}>
          <Form.Item
            label="Mô tả bản thiết kế"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả bản thiết kế" },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            accept=".png,.jpg"
            beforeUpload={() => false}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
        </Form>
      </Modal>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}

export default ProcessOrder;
