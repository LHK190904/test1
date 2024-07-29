import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";
import axiosInstance from "../../../services/axiosInstance";
import { PlusOutlined } from "@ant-design/icons";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";
import {
  Form,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import uploadFile from "../../../utils/upload";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function CartRequest() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dataGoldAPI, setDataGoldAPI] = useState([]);
  const [material, setMaterial] = useState([]);
  const [materialName, setMaterialName] = useState("");
  const [selectedReqID, setSelectedReqID] = useState(null);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const [deniedReason, setDeniedReason] = useState("");

  const fetchRequests = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.id) {
        console.error("User is not authenticated or user ID is missing");
        return;
      }
      const reqRes = await axiosInstance.get(`requests/customer/${user.id}`);
      const list = reqRes.data.result;

      const combinedData = await Promise.all(
        list.map(async (req) => {
          try {
            const quoRes = await axiosInstance.get(`quotation/${req.id}`);
            return { ...req, quotation: quoRes.data.result };
          } catch (error) {
            console.error(
              `Error fetching quotation for request ID ${req.id}`,
              error
            );
            return { ...req, quotation: null };
          }
        })
      );

      setRequests(combinedData);
      console.log(combinedData);
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate("/login");
    } else {
      fetchRequests();
      fetchAPI();
    }
  }, []);

  useEffect(() => {
    if (isRequestSent) {
      fetchRequests();
      setIsRequestSent(false);
    }
  }, [isRequestSent]);

  const handleApprove = async (reqID) => {
    try {
      await axiosInstance.put(`requests/approveQuotationFromCustomer/${reqID}`);
      await axiosInstance.post(`payment/${reqID}`);
      setRequests((prevRequest) =>
        prevRequest.map((req) =>
          req.id === reqID ? { ...req, status: "Depositing" } : req
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeny = (reqID) => {
    setSelectedReqID(reqID);
    setIsDenyModalOpen(true);
  };

  const handleConfirmDeny = async () => {
    try {
      const response = await axiosInstance.put(
        `requests/denyQuotationFromCustomer/${selectedReqID}`,
        deniedReason,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      console.log(response);
      setRequests((prevRequest) =>
        prevRequest.map((req) =>
          req.id === selectedReqID ? { ...req, status: "Denied" } : req
        )
      );
      setIsDenyModalOpen(false);
      setDeniedReason("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (reqID) => {
    try {
      await axiosInstance.put(`requests/deleteRequest/${reqID}`);
      setRequests((prevRequest) =>
        prevRequest.filter((req) => req.id !== reqID)
      );
    } catch (error) {
      console.error(`Error deleting request ID ${reqID}`, error);
    }
  };

  const fetchAPI = async () => {
    try {
      const goldResponse = await axiosInstance.get(`api/gold/prices`);
      const goldData = goldResponse.data.DataList.Data.map((item, index) => ({
        goldType: item[`@n_${index + 1}`],
        sellCost: item[`@pb_${index + 1}`],
        buyCost: item[`@pb_${index + 1}`],
        updated: item[`@d_${index + 1}`],
      }));
      setDataGoldAPI(goldData);

      const materialResponse = await axiosInstance.get(`material/notGold`);
      console.log(materialResponse.data.result);
      setMaterial(materialResponse.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequestData = async (reqID) => {
    try {
      const response = await axiosInstance.get(`/requests/${reqID}`);
      return response.data.result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const openUpdateModal = async (reqID) => {
    try {
      const requestData = await fetchRequestData(reqID);
      initializeFormAndFileList(requestData);
      setSelectedReqID(reqID);
      setIsModalOpen(true);
    } catch (error) {
      console.log("Failed to open modal");
    }
  };

  const handleHideModal = () => {
    setIsModalOpen(false);
    setFileList([]);
    form.resetFields();
  };
  const uploadImages = async (reqID) => {
    const uploadPromises = fileList.map(async (file) => {
      if (!file.url) {
        const url = await uploadFile(file.originFileObj, `request/${reqID}`);
        return url;
      }
      return file.url;
    });
    return await Promise.all(uploadPromises);
  };

  const handleUpload = async () => {
    try {
      // Lấy danh sách URL hình ảnh đã upload
      const uploadedUrls = await uploadImages(selectedReqID);
      const values = await form.validateFields();
      const {
        description,
        category,
        mainStone = 0,
        subStone = 0,
        materialWeight,
        materialName,
      } = values;

      const goldResponse = await axiosInstance.get(`api/gold/prices`);
      const goldData = goldResponse.data.DataList.Data.map((item, index) => ({
        goldType: item[`@n_${index + 1}`],
        sellCost: item[`@pb_${index + 1}`],
        buyCost: item[`@pb_${index + 1}`],
        updated: item[`@d_${index + 1}`],
      }));

      // Tìm giá vàng tương ứng với vật liệu
      const selectedGoldTypeData = goldData.find(
        (item) => item.goldType === materialName
      );

      let buyCost, sellCost, updated;
      if (selectedGoldTypeData) {
        buyCost = selectedGoldTypeData.buyCost;
        sellCost = selectedGoldTypeData.sellCost;
        updated = selectedGoldTypeData.updated;
      } else {
        throw new Error("Không tìm thấy thông tin giá vàng phù hợp");
      }

      // Find the IDs for mainStone and subStone based on their names
      let mainStoneID = mainStone;
      let subStoneID = subStone;

      if (typeof mainStone === "string") {
        mainStoneID =
          material.find((item) => item.materialName === mainStone)?.id || null;
      }
      if (typeof subStone === "string") {
        subStoneID =
          material.find((item) => item.materialName === subStone)?.id || null;
      }

      // Check the data types
      console.log("mainStoneID:", mainStoneID, "type:", typeof mainStoneID);
      console.log("subStoneID:", subStoneID, "type:", typeof subStoneID);

      const payload = {
        description,
        listURLImage: uploadedUrls,
        category,
        goldType: materialName,
        mainStoneId: mainStoneID,
        subStoneId: subStoneID,
        materialWeight,
        buyCost,
        sellCost,
        updated,
      };
      // console.log(payload);
      await axiosInstance.put(`/requests/${selectedReqID}`, payload);
      handleHideModal();
      message.success("Cập nhật yêu cầu thành công.");
    } catch (error) {
      console.error(error);
      message.error("Tải lên thất bại.");
    }
  };
  const initializeFormAndFileList = (requestItem) => {
    form.setFieldsValue({
      description: requestItem.description,
      category: requestItem.category,
      designName: requestItem.designName,
      materialName: requestItem.materialName,
      mainStone: requestItem.mainStone ?? "0",
      subStone: requestItem.subStone ?? "0",
      materialWeight: requestItem.materialWeight,
    });

    const initialFileList = (requestItem.listURLImage || []).map(
      (url, index) => ({
        uid: index,
        name: `image-${index}`,
        status: "done",
        url,
      })
    );
    setFileList(initialFileList);
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const handleGoldTypeChange = async (value) => {
    try {
      const selectedGoldTypeData = dataGoldAPI.find(
        (item) => item.goldType === value
      );
      setMaterialName(selectedGoldTypeData?.goldType || "");
    } catch (error) {
      console.error(error);
    }
  };
  const handleSendRequest = async (reqID) => {
    try {
      await axiosInstance.put(`/requests/sendRequest/${reqID}`);
      setIsRequestSent(true);
      message.success("Gửi yêu cầu thành công");
    } catch (error) {
      console.log(error);
      message.error("Gửi yêu cầu thât bại");
    }
  };
  const handleOrderClick = async (reqID) => {
    try {
      const responseOrder = await axiosInstance.get(
        `request-orders/getOrderByRequestIdForCustomer/${reqID}`
      );
      const orderData = responseOrder.data.result;

      if (orderData && orderData.id) {
        navigate(`/cart/order/${reqID}`);
      } else {
        navigate(`/cart/request_detail/${reqID}`);
      }
    } catch (error) {
      console.error("Is not a order", error);
      navigate(`/cart/request_detail/${reqID}`);
    }
  };

  const getStatusTranslation = (status) => {
    switch (status) {
      case "Approved":
        return "Đã được phê duyệt";
      case "Unapproved":
        return "Chưa được phê duyệt";
      case "Denied from manager":
        return "Quản lý từ chối giá đã báo";
      case "Ordering":
        return "Đang đặt hàng";
      case "finished":
        return "Đã hoàn thành";
      case "Sending":
        return "Đã gửi yêu cầu";
      case "Denied":
        return "Khách hàng từ chối giá đã báo";
      case "Depositing":
        return "Thực hiện đặt cọc";
      case "Processing":
        return "Đang xử lý";
      case "Pending quotation for manager":
        return "Đợi quản lý phê duyệt giá";
      case "Pending quotation for customer":
        return "Đợi khách hàng phê duyệt giá";
      default:
        return status;
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );
  return (
    <>
      <div className="bg-[#434343] min-h-screen w-screen">
        <div className="grid grid-cols-12 gap-4 pt-4 px-2 lg:px-0">
          <div className="col-span-12 lg:col-start-2 lg:col-span-10 bg-gray-300 text-center p-1 rounded-lg">
            <h1 className="bg-gray-400 p-4 text-2xl">YÊU CẦU</h1>
            <div className="hidden lg:grid lg:grid-cols-8 border">
              <div className="col-span-1 p-2 text-xl border">MÃ YÊU CẦU</div>
              <div className="col-span-1 p-2 text-xl border">
                NHÂN VIÊN BÁN HÀNG
              </div>
              <div className="col-span-1 p-2 text-xl border">TRẠNG THÁI</div>
              <div className="col-span-1 p-2 text-xl border">THỜI ĐIỂM TẠO</div>
              <div className="col-span-1 p-2 text-xl border">
                THỜI ĐIỂM TIẾP NHẬN
              </div>
              <div className="col-span-1 p-2 text-xl border">GIÁ</div>
              <div className="col-span-1 p-2 text-xl border">MÔ TẢ</div>
              <div className="col-span-1 p-2 text-xl border"></div>
            </div>
            {requests.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-8 border my-2 lg:my-0"
              >
                <div className="col-span-1 p-2 bg-white border">{item.id}</div>
                <div className="col-span-1 p-2 bg-white border">
                  {item.saleStaffID}
                </div>
                {item.status === "action" ||
                item.status === "Pending quotation for customer" ? (
                  <div className="col-span-1 p-2 bg-white flex flex-col lg:flex-row">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="bg-green-400 p-1 rounded-lg mb-2 lg:mr-2 lg:mb-0 hover:bg-green-500"
                    >
                      Chấp nhận
                    </button>
                    <button
                      onClick={() => handleDeny(item.id)}
                      className="bg-red-400 p-1 rounded-lg hover:bg-red-500"
                    >
                      Từ chối
                    </button>
                  </div>
                ) : (
                  <div className="col-span-1 p-2 bg-white">
                    <span>{getStatusTranslation(item.status)}</span>
                  </div>
                )}
                <div className="col-span-1 p-2 bg-white border">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
                <div className="col-span-1 p-2 bg-white border">
                  {new Date(item.recievedAt).toLocaleString()}
                </div>
                <div className="col-span-1 p-2 bg-white border">
                  {item.quotation
                    ? new Intl.NumberFormat().format(item.quotation.cost)
                    : "N/A"}
                </div>
                <div className="col-span-1 p-2 bg-white border">
                  {item.description}
                </div>
                {item.status === "Approved" ||
                item.status === "Ordering" ||
                item.status === "Depositing" ||
                item.status === "finished" ? (
                  <div className="col-span-1 p-2 bg-white border">
                    <button
                      onClick={() => handleOrderClick(item.id)}
                      className="bg-blue-300 p-2 rounded-md hover:bg-blue-600"
                    >
                      CHI TIẾT
                    </button>
                  </div>
                ) : item.status === "Denied" || item.status === "Unapproved" ? (
                  <div className="col-span-1 p-2 bg-white border">
                    <Popconfirm
                      title="Xác nhận xóa yêu cầu "
                      onConfirm={() => handleDelete(item.id)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <button className="bg-red-500 p-2 rounded-md hover:bg-red-600">
                        <DeleteOutlined />
                      </button>
                    </Popconfirm>

                    {item.companyDesign === null && (
                      <button
                        onClick={() => openUpdateModal(item.id)}
                        className="p-2 rounded-md hover:bg-slate-300"
                      >
                        <EditOutlined />
                      </button>
                    )}
                    <Popconfirm
                      title="Xác nhận gửi yêu cầu "
                      onConfirm={() => handleSendRequest(item.id)}
                      okText="Gửi yêu cầu"
                      cancelText="Hủy"
                    >
                      <button className="bg-green-500 p-2 rounded-lg hover:bg-green-600">
                        <CheckOutlined />
                      </button>
                    </Popconfirm>
                  </div>
                ) : (
                  <div className="col-span-1 p-2 bg-white border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        title="Chỉnh sửa yêu cầu"
        open={isModalOpen}
        onOk={handleUpload}
        onCancel={handleHideModal}
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          initialValues={{ mainStone: 0, subStone: 0 }}
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
            name="materialName"
            label="Vật liệu:"
            rules={[{ required: true, message: "Vui lòng nhập vật liệu" }]}
          >
            <Select onChange={handleGoldTypeChange}>
              {dataGoldAPI.map((item, index) => (
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
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="mainStone" label="Đá chính (Nếu có):">
            <Select allowClear>
              {material.map((item, index) => (
                <Select.Option key={index} value={item.id}>
                  {item.materialName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="subStone" label="Đá phụ (Nếu có):">
            <Select allowClear>
              {material.map((item, index) => (
                <Select.Option key={index} value={item.id}>
                  {item.materialName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả:"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item label="Tải lên hình ảnh:">
            <Upload
              listType="picture-card"
              fileList={fileList}
              accept=".png,.jpg,.jpeg,.jfif"
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        title="Preview Image"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <Image src={previewImage} />
      </Modal>

      <Modal
        title="Lý do từ chối"
        open={isDenyModalOpen}
        onOk={handleConfirmDeny}
        onCancel={() => setIsDenyModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Input.TextArea
          rows={4}
          value={deniedReason}
          onChange={(e) => setDeniedReason(e.target.value)}
          placeholder="Nhập lý do từ chối..."
        />
      </Modal>
    </>
  );
}

export default CartRequest;
