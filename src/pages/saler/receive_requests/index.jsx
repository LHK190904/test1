import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { Button, Table } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../../../components/logoutButton";
import Navbar from "../../../components/navbar";
import authorService from "../../../services/authorService";

function ReceiveRequests() {
  const [requests, setRequests] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (authorService.checkPermission("SALE_STAFF")) {
      fetchRequests();
    } else {
      navigate("/unauthorized");
    }
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get("requests/unrecievedRequest");
      setRequests(response.data.result);
    } catch (error) {
      console.error("Không thể lấy yêu cầu:", error);
    }
  };

  const handleAcceptRequest = async (record) => {
    try {
      await axiosInstance.put(`requests/sales/${record.id}`);
      setRequests(requests.filter((request) => request.id !== record.id));
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const columns = [
    { title: "Mã yêu cầu", dataIndex: "id", key: "id" },
    { title: "Chi tiết", dataIndex: "description", key: "description" },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleAcceptRequest(record)}>
          Nhận đơn
        </Button>
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
      <div className="mb-4 mt-3 ml-3">
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
    </div>
  );
}

export default ReceiveRequests;
