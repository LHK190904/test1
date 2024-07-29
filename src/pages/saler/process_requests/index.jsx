import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import authService from "../../../services/authService";
import {
  Button,
  Modal,
  Form,
  Input,
  Table,
  Tag,
  Space,
  message,
  InputNumber,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormItem from "antd/es/form/FormItem";
import LogoutButton from "../../../components/logoutButton";
import Navbar from "../../../components/navbar";
import authorService from "../../../services/authorService";

function ProcessRequests() {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState("");
  const [customerInfo, setCustomerInfo] = useState(null);
  const [deniedReasons, setDeniedReasons] = useState(null);
  const [formData] = useForm();
  const [formDataQuotation] = useForm();
  const [capitalCost, setCapitalCost] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchSalerData = async () => {
    const saler = authService.getCurrentUser();
    if (saler && saler.id) {
      try {
        const response = await axiosInstance.get(`/requests/sales/${saler.id}`);
        console.log(response);
        setRequests(response.data.result);
      } catch (error) {
        console.error("Không thể lấy yêu cầu:", error);
      }
    } else {
      console.error("Người dùng chưa đăng nhập");
    }
  };

  useEffect(() => {
    if (authorService.checkPermission("SALE_STAFF")) {
      fetchSalerData();
    } else {
      navigate("/unauthorized");
    }
  }, [navigate]);

  const handleShowModal = async (record) => {
    try {
      const [quotationResponse, autoPricingResponse] = await Promise.all([
        axiosInstance.get(`quotation/${record.id}`),
        axiosInstance.get(`/quotation/autoPricing/${record.id}`),
      ]);

      const quotationData = quotationResponse.data.result;
      const autoPricingData = autoPricingResponse.data.result;

      console.log(quotationData.deniedReason);
      setDeniedReasons(quotationData.deniedReason);
      setSelectedRecord(record);

      const capitalCost =
        (autoPricingData.materialPrice || 0) *
          (autoPricingData.materialWeight || 0) +
        (autoPricingData.producePrice || 0) +
        (autoPricingData.stonePrice || 0);

      formData.setFieldsValue({
        materialPrice: autoPricingData.materialPrice,
        materialWeight: autoPricingData.materialWeight,
        producePrice: autoPricingData.producePrice,
        stonePrice: autoPricingData.stonePrice,
        capitalCost: capitalCost,
      });

      setCapitalCost(capitalCost);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Không thể lấy dữ liệu:", error);
      message.error("Không thể lấy dữ liệu.");
    }
  };

  const handleHideModal = () => {
    setIsModalOpen(false);
    setSelectedRecord("");
    formData.resetFields();
  };

  const handleShowQuotationModal = async (record) => {
    setSelectedRecord(record);
    setIsQuotationModalOpen(true);

    try {
      const response = await axiosInstance.get(`/quotation/${record.id}`);
      const data = response.data.result;
      formDataQuotation.setFieldsValue({
        createdAt: new Date(data.createdAt).toLocaleString(),
        capitalCost: new Intl.NumberFormat().format(data.capitalCost),
        cost: new Intl.NumberFormat().format(data.cost),
      });
    } catch (error) {
      console.error("Không thể lấy thông tin báo giá:", error);
      message.error("Không thể lấy thông tin báo giá.");
    }
  };

  const handleHideQuotationModal = () => {
    setIsQuotationModalOpen(false);
  };

  const handleOk = () => {
    formData.validateFields().then((values) => {
      handleSubmit(values);
    });
  };

  const handleSubmit = async (values) => {
    if (!values.cost) {
      message.warning("Bạn chưa lấy giá cho đơn hàng này.");
      return;
    }

    try {
      const updatedRecord = {
        ...selectedRecord,
        ...values,
        status: "Pending quotation for manager",
      };
      console.log(updatedRecord);
      await axiosInstance.post(
        `/quotation/${selectedRecord.id}`,
        updatedRecord
      );
      setRequests(
        requests.map((request) =>
          request.id === updatedRecord.id ? updatedRecord : request
        )
      );
      message.success("Đã gửi cho quản lý!");
      handleHideModal();
    } catch (error) {
      console.error("Không thể cập nhật yêu cầu:", error);
      message.error("Giá tổng phải lớn hơn giá vốn");
    }
  };

  const handleShowCustomerInfo = async (record) => {
    try {
      console.log(record.customerID);
      const response = await axiosInstance.get(`/user/${record.customerID}`);
      console.log(response);
      setCustomerInfo(response.data);
      setIsCustomerModalOpen(true);
    } catch (error) {
      console.error("Không thể lấy thông tin khách hàng:", error);
      message.error("Không thể lấy thông tin khách hàng.");
    }
  };

  const handleHideCustomerModal = () => {
    setIsCustomerModalOpen(false);
    setCustomerInfo(null);
  };

  const columns = [
    { title: "Mã yêu cầu", dataIndex: "id", key: "id", width: "10%" },
    {
      title: "Chi tiết",
      dataIndex: "description",
      key: "description",
      width: "40%",
    },
    {
      title: "Thời gian nhận đơn",
      dataIndex: "recievedAt",
      key: "recievedAt",
      width: "15%",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      width: "5%",
      render: (status) => {
        let color = "green";
        let showStatus = "Hoàn thành";
        if (status === "Ordering") {
          color = "yellow";
          showStatus = "Khách đã duyệt";
        } else if (status === "Processing") {
          color = "gray";
          showStatus = "Chưa xử lí";
        } else if (status === "Pending quotation for manager") {
          color = "blue";
          showStatus = "Chờ quản lí duyệt";
        } else if (status === "Pending quotation for customer") {
          color = "blue";
          showStatus = "Chờ khách hàng duyệt";
        } else if (status === "Denied from manager") {
          color = "volcano";
          showStatus = "Quản lí từ chối giá đã báo";
        } else if (status === "Denied") {
          color = "volcano";
          showStatus = "Khách từ chối giá đã báo";
        }
        return (
          <Tag color={color} key={status}>
            {showStatus}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "Processing" ||
          record.status === "Denied from manager" ? (
            <Button type="primary" onClick={() => handleShowModal(record)}>
              Lấy giá
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => handleShowQuotationModal(record)}
            >
              Thông tin báo giá
            </Button>
          )}
          <Button onClick={() => handleShowCustomerInfo(record)}>
            Thông tin khách hàng
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-[#353640] text-white h-40 flex justify-between items-center px-10">
        <Link to={"/"}>
          <img
            className="h-[160px] w-auto"
            src="/src/assets/images/logo.png"
            alt="Logo"
          />
        </Link>
        <div className="flex-grow text-center">
          <h1 className="text-5xl">Nhân viên bán hàng</h1>
        </div>
        <div className="w-80 text-right">
          <LogoutButton />
        </div>
      </div>
      <Navbar />

      <div className="mb-4 flex space-x-4 ml-3 mt-3">
        <Link
          className={`mr-4 ${
            location.pathname === "/saler/receive_requests"
              ? "underline font-bold"
              : ""
          }`}
          to="/saler/receive_requests"
        >
          Nhận đơn để xử lý
        </Link>
        <Link
          className={`${
            location.pathname === "/saler/process_requests"
              ? "underline font-bold"
              : ""
          }`}
          to="/saler/process_requests"
        >
          Đơn đã nhận
        </Link>
      </div>

      <Table columns={columns} dataSource={requests} />

      <Modal
        open={isModalOpen}
        title={<div className="text-center text-2xl">Nhập thông tin</div>}
        onOk={handleOk}
        onCancel={handleHideModal}
        width="60%"
        footer={[
          <Button key="back" onClick={handleHideModal}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Gửi cho quản lí
          </Button>,
        ]}
      >
        <p className="text-lg font-semibold mb-10">
          Mã yêu cầu: {selectedRecord.id}
        </p>
        {selectedRecord.deniedReason !== null && (
          <p className="p-4 border border-red-500 bg-red-100 text-red-700 rounded-md mb-5">
            <span className="font-extrabold">Lí do từ chối:</span>{" "}
            {selectedRecord.deniedReason}
          </p>
        )}
        {deniedReasons !== null && (
          <p className="p-4 border border-red-500 bg-red-100 text-red-700 rounded-md mb-5">
            <span className="font-extrabold">Lí do từ chối:</span>{" "}
            {deniedReasons}
          </p>
        )}
        <Form form={formData}>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-wrap w-1/2">
              <FormItem label="Giá vàng" name="materialPrice">
                <InputNumber
                  readOnly
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${new Intl.NumberFormat().format(value)}`
                  }
                />
              </FormItem>
              <FormItem label="Trọng lượng" name="materialWeight">
                <Input readOnly />
              </FormItem>
              <FormItem label="Tiền công" name="producePrice">
                <InputNumber
                  readOnly
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${new Intl.NumberFormat().format(value)}`
                  }
                />
              </FormItem>
            </div>
            <div className="flex flex-col flex-wrap w-1/2">
              <FormItem label="Tiền đá" name="stonePrice">
                <InputNumber
                  readOnly
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${new Intl.NumberFormat().format(value)}`
                  }
                />
              </FormItem>
              <FormItem label="Giá vốn" name="capitalCost">
                <InputNumber
                  readOnly
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${new Intl.NumberFormat().format(value)}`
                  }
                />
              </FormItem>
              <FormItem
                label="Tổng giá bán"
                name="cost"
                rules={[
                  {
                    type: "number",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${new Intl.NumberFormat().format(value)}`
                  }
                />
              </FormItem>
            </div>
          </div>
        </Form>
      </Modal>

      <Modal
        open={isQuotationModalOpen}
        title={<div className="text-center text-2xl">Thông tin báo giá</div>}
        onCancel={handleHideQuotationModal}
        width="60%"
        footer={[
          <Button key="back" onClick={handleHideQuotationModal}>
            Đóng
          </Button>,
        ]}
      >
        {}
        <p className="text-lg font-semibold mb-10">
          Mã yêu cầu: {selectedRecord.id}
        </p>
        <Form form={formDataQuotation}>
          <div className="flex flex-row gap-4">
            <FormItem label="Thời điểm báo giá" name="createdAt">
              <Input disabled />
            </FormItem>
            <FormItem label="Giá vốn" name="capitalCost">
              <Input disabled />
            </FormItem>
            <FormItem label="Giá tổng" name="cost">
              <Input disabled />
            </FormItem>
          </div>
        </Form>
      </Modal>

      <Modal
        open={isCustomerModalOpen}
        title={<div className="text-center text-2xl">Thông tin khách hàng</div>}
        onCancel={handleHideCustomerModal}
        width="60%"
        footer={[
          <Button key="back" onClick={handleHideCustomerModal}>
            Đóng
          </Button>,
        ]}
      >
        {customerInfo && (
          <div>
            <p className="text-lg font-semibold mb-2">
              Tên khách hàng:{" "}
              <span className="font-thin">{customerInfo.cusName}</span>
            </p>
            <p className="text-lg font-semibold mb-2">
              Email: <span className="font-thin">{customerInfo.email}</span>
            </p>
            <p className="text-lg font-semibold mb-2">
              Địa chỉ: <span className="font-thin">{customerInfo.address}</span>
            </p>
            <p className="text-lg font-semibold mb-2">
              Số điện thoại:{" "}
              <span className="font-thin">{customerInfo.phoneNum}</span>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ProcessRequests;
