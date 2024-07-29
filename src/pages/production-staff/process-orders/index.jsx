import { useEffect, useState } from "react";
import authService from "../../../services/authService";
import axiosInstance from "../../../services/axiosInstance";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../../../components/logoutButton";
import { Modal, Image } from "antd";
import Navbar from "../../../components/navbar";
import authorService from "../../../services/authorService";

function ProductionStaff() {
  const location = useLocation();
  const [dataSource, setDataSource] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [statusProcess, setStatusProcess] = useState("");
  const [user, setUser] = useState(null);
  const [material, setMaterial] = useState([]);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  const fetchMaterial = async () => {
    try {
      const response = await axiosInstance.get(`material/notGold`);
      setMaterial(response.data.result);
      console.log(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSalerData = async () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      try {
        setUser(currentUser);
        const response = await axiosInstance.get(
          `/request-orders/getAllOrderByProductionStaff/${currentUser.id}`
        );
        setDataSource(response.data.result || []);
      } catch (error) {
        console.error("Không thể lấy yêu cầu:", error);
      }
    } else {
      console.error("Người dùng chưa đăng nhập");
    }
  };

  useEffect(() => {
    if (authorService.checkPermission("PRODUCTION_STAFF")) {
      fetchSalerData();
      fetchMaterial();
    } else {
      navigate("/unauthorized");
    }
  }, [navigate]);

  const handleSelectOrder = async (id) => {
    try {
      const response = await axiosInstance.get(`design/${id}`);
      console.log(response.data.result);
      setSelectedOrder(response.data.result || null);
      setOrderId(id);
      const statusResponse = await axiosInstance.get(
        `/process/getProcessByRequestOrderId/${id}`
      );
      setStatusProcess(statusResponse.data.result || {});
    } catch (error) {
      console.error("Không thể lấy chi tiết đơn hàng:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const updateStatusProcess = async (orderId) => {
    try {
      await axiosInstance.post(`/process/${orderId}/${user.id}`);
      // Fetch updated status process
      const statusResponse = await axiosInstance.get(
        `/process/getProcessByRequestOrderId/${orderId}`
      );
      setStatusProcess(statusResponse.data.result || {});
    } catch (error) {
      console.error("Không thể cập nhật trạng thái:", error);
    }
  };

  const paginatedData = dataSource.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(dataSource.length / itemsPerPage);

  const getStatusInVietnamese = (status) => {
    switch (status) {
      case "Producing":
        return "Đang gia công";
      default:
        return status;
    }
  };

  const getMaterialName = (id) => {
    const materialItem = material.find((item) => item.id === id);
    return materialItem ? materialItem.materialName : "Không có";
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

      <div className="bg-[#434343] min-h-screen w-screen flex">
        <div className="grid grid-cols-12 w-full">
          <div className="col-start-2 col-span-6 m-4 rounded-lg p-4 bg-gray-300 flex flex-col">
            <h1 className="bg-gray-400 p-4 text-2xl text-center">
              CHI TIẾT ĐƠN HÀNG
            </h1>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-bold">BẢN THIẾT KẾ</div>
                  <button
                    className="bg-blue-500 text-white p-2 rounded-md"
                    onClick={showModal}
                  >
                    Xem bản thiết kế
                  </button>
                  <Modal
                    title="Bản thiết kế"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                  >
                    <div className="flex flex-wrap justify-center">
                      {selectedOrder.listURLImage.map((url, index) => (
                        <Image
                          key={index}
                          src={url}
                          alt={`Design ${index + 1}`}
                          className="w-[200px] h-[200px] mx-2 my-2"
                        />
                      ))}
                    </div>
                  </Modal>
                </div>
                <div className="space-y-2">
                  <div className="font-bold">MÔ TẢ</div>
                  <div className="bg-white p-2 rounded-md">
                    {selectedOrder.description}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold">Loại trang sức</div>
                  <div className="bg-white p-2 rounded-md">
                    {selectedOrder.category}
                  </div>
                </div>
                <div className="space-y-2 flex gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="font-bold mt-2">Đá chính</div>
                    <div className="bg-white p-2 rounded-md w-full">
                      {getMaterialName(selectedOrder.mainStoneId)}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="font-bold">Đá phụ</div>
                    <div className="bg-white p-2 rounded-md w-full">
                      {getMaterialName(selectedOrder.subStoneId)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold">Trọng lượng vật liệu</div>
                  <div className="bg-white p-2 rounded-md">
                    {selectedOrder.materialWeight}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-bold">Vật liệu</div>
                  <div className="bg-white p-2 rounded-md">
                    {selectedOrder.materialName}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-bold">Tiến độ hoàn thành</div>
                  <div className="bg-white p-2 rounded-md">
                    {statusProcess.status}
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    className="bg-green-500 text-white p-2 rounded-md"
                    onClick={() => updateStatusProcess(orderId)}
                  >
                    Cập nhật tiến độ
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="col-start-8 col-span-4 m-4 rounded-lg p-4 bg-gray-300 flex flex-col">
            <h1 className="text-center bg-gray-400 p-4 text-2xl">ĐƠN HÀNG</h1>
            <div className="grid grid-cols-2 text-center mt-4 border">
              <div className="col-span-1">Mã đơn</div>
              <div className="col-span-1">TRẠNG THÁI</div>
            </div>
            <div className="flex-grow overflow-auto">
              {paginatedData.map((order) => (
                <div
                  className="grid grid-cols-2 text-center border"
                  key={order.id}
                >
                  <div
                    className={`col-span-1 p-2 bg-white border cursor-pointer ${
                      orderId === order.id ? "underline" : ""
                    }`}
                    onClick={() => handleSelectOrder(order.id)}
                  >
                    {order.id}
                  </div>
                  <div
                    className="col-span-1 p-2 bg-white border cursor-pointer"
                    onClick={() => handleSelectOrder(order.id)}
                  >
                    {getStatusInVietnamese(order.status)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 px-2 py-1 border ${
                    currentPage === index + 1 ? "bg-gray-400" : "bg-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductionStaff;
