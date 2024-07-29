import { Button, Form, Menu, Modal, Select, message, Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";
import LogoutButton from "../../../components/logoutButton";
import Navbar from "../../../components/navbar";
import authorService from "../../../services/authorService";

function ManagerOrder() {
  const [isOpenModal, setOpenModal] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [designStaffList, setDesignStaffList] = useState([]);
  const [productionStaffList, setProductionStaffList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm(); // Sử dụng hook Form
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [orderResponse, designResponse, productionResponse] =
        await Promise.all([
          axiosInstance.get("request-orders/getAllNewRequestOrder"),
          axiosInstance.get("request-orders/getUserByRole/DESIGN_STAFF"),
          axiosInstance.get("request-orders/getUserByRole/PRODUCTION_STAFF"),
        ]);
      console.log(orderResponse.data.result);
      setOrderList(orderResponse.data.result);
      setDesignStaffList(designResponse.data.result);
      setProductionStaffList(productionResponse.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (authorService.checkPermission("MANAGER")) {
      fetchData();
    } else {
      navigate("/unauthorized");
    }
  }, [navigate]);

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleHideModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const designStaffId =
        selectedOrder?.designID === null ? values.designStaff : "0";
      const url = `request-orders/${selectedOrder.id}/${designStaffId}/${values.productionStaff}`;
      await axiosInstance.put(url);
      message.success("Phân công thành công");
      handleHideModal();
    } catch (error) {
      console.error("Error assigning staff:", error);
      message.error("Phân công thất bại");
    }
  };

  const handleNavigateClick = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="requests">
        <button onClick={() => handleNavigateClick("/manager/request")}>
          QUẢN LÝ YÊU CẦU
        </button>
      </Menu.Item>
      <Menu.Item key="orders">
        <button onClick={() => handleNavigateClick("/manager/order")}>
          QUẢN LÝ ĐƠN HÀNG
        </button>
      </Menu.Item>
      <Menu.Item key="dashboard">
        <button onClick={() => handleNavigateClick("/dashboard")}>
          DASHBOARD
        </button>
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutButton />
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-[#434343] min-h-screen w-screen">
      <div className="bg-[#1d1d1d] text-white h-40 flex justify-between items-center px-10">
        <Link to={"/"}>
          <img
            className="h-[160px] w-auto"
            src="/src/assets/images/logo.png"
            alt="Logo"
          />
        </Link>
        <div className="flex-grow text-center">
          <h1 className="text-5xl">QUẢN LÝ</h1>
        </div>
        <div className="w-80 text-right">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button className="bg-[#F7EF8A]">MENU</Button>
          </Dropdown>
        </div>
      </div>
      <Navbar />
      <h1 className="text-center text-[#F7EF8A] text-4xl font-bold my-4">
        QUẢN LÝ ĐƠN HÀNG
      </h1>
      <div className="grid grid-cols-4 w-3/4 mx-auto bg-gray-300 p-4 rounded-lg">
        <div className="col-span-1 bg-gray-400 p-2 font-bold text-center">
          MÃ ĐƠN HÀNG
        </div>
        <div className="col-span-1 bg-gray-400 p-2 font-bold text-center">
          MÃ YÊU CẦU
        </div>
        <div className="col-span-2 bg-gray-400 p-2 font-bold text-center">
          CHỈ ĐỊNH CÔNG VIỆC
        </div>
        {orderList.map((item) => (
          <React.Fragment key={item.id}>
            <div className="col-span-1 border p-2 text-center bg-white">
              {item.id}
            </div>
            <div className="col-span-1 border p-2 text-center bg-white">
              {item.requestID}
            </div>
            <div className="col-span-2 border p-2 text-center bg-white">
              <Button type="link" onClick={() => handleShowModal(item)}>
                Chọn nhân viên
              </Button>
            </div>
          </React.Fragment>
        ))}
      </div>
      <Modal
        title="CHỈ ĐỊNH CÔNG VIỆC"
        open={isOpenModal}
        onCancel={handleHideModal}
        footer={null}
      >
        <Form
          form={form} // Liên kết form với hook Form
          initialValues={{
            designStaff: "",
            productionStaff: "",
          }}
          onFinish={handleSubmit}
        >
          {selectedOrder?.designID === null && (
            <Form.Item
              name="designStaff"
              label="Nhân viến thiết kế"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn nhân viên thiết kế",
                },
              ]}
            >
              <Select>
                {designStaffList.map((staff) => (
                  <Select.Option key={staff.id} value={staff.id}>
                    {staff.userName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            name="productionStaff"
            label="Nhân viên gia công"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn nhân viên gia công",
              },
            ]}
          >
            <Select>
              {productionStaffList.map((staff) => (
                <Select.Option key={staff.id} value={staff.id}>
                  {staff.userName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              CHỈ ĐỊNH
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManagerOrder;
