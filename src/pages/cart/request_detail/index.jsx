import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";
import { message, Popconfirm, Modal } from "antd";
import { DeleteOutlined } from "@mui/icons-material";
import PayPalButton from "../../../components/paypalButton";
import authService from "../../../services/authService";

function RequestDetail() {
  const { requestID } = useParams();
  const [request, setRequest] = useState({});
  const navigate = useNavigate();
  const [totalCost, setTotalCost] = useState("0");
  const [paymentID, setPaymentID] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const jewelryTypeMapping = {
    NECKLACE: "Dây chuyền",
    RING: "Nhẫn",
    BRACELET: "Vòng tay",
    EARRINGS: "Bông tai",
  };

  const fetchRequest = async () => {
    if (!requestID) {
      console.error("Request ID is undefined");
      return;
    }

    try {
      const responseRequest = await axiosInstance.get(`requests/${requestID}`);
      const quote = await axiosInstance.get(`quotation/${requestID}`);
      setTotalCost(quote.data.result.cost);
      setRequest(responseRequest.data.result);
      console.log(responseRequest.data.result);
    } catch (error) {
      console.log("Error fetching request", error);
    }
  };

  const fetchPaymentId = async () => {
    try {
      const payID = await axiosInstance.get(
        `payment/getPayment/${requestID}/Deposit`
      );
      console.log(payID.data.result.id);
      setPaymentID(payID.data.result.id);
    } catch (error) {
      console.log("Error fetching paymentId", error);
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      fetchRequest();
      fetchPaymentId();
    } else {
      navigate("/");
    }
  }, [requestID]);

  const handleDelete = async (reqID) => {
    try {
      await axiosInstance.put(`requests/deleteRequest/${reqID}`);
      navigate("/cart/request");
      message.success("Huỷ đơn thành công");
    } catch (error) {
      console.error(`Error deleting request ID ${reqID}`, error);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      console.log(paymentID);
      await axiosInstance.put(`/payment/makePayment/${paymentID}`);
      await axiosInstance.post(`request-orders/${requestID}`);
      navigate(`/cart/order/${requestID}`);
      message.success("Thanh toán thành công!");
    } catch (error) {
      console.error("Error during payment success handling:", error);
      message.error("Có lỗi xảy ra khi xử lý thanh toán");
    }
  };

  const handlePaymentError = (error) => {
    message.error("Có lỗi xảy ra khi thanh toán");
    console.error("PayPal Error:", error);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="bg-gray-800 min-h-screen w-screen p-4 md:p-8">
        <h1 className="text-center text-2xl md:text-4xl font-bold py-4 text-yellow-400">
          CHI TIẾT ĐƠN HÀNG
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="col-span-1 md:col-start-2 md:col-span-10 bg-gray-300 rounded-lg p-4 md:p-2">
            <h1 className="text-xl md:text-2xl text-center my-4">CHI TIẾT</h1>
            <div className="grid grid-cols-1 md:grid-cols-5 mt-4">
              <div className="col-span-1 md:col-span-5 bg-white p-4 rounded-lg shadow">
                <div className="text-lg md:text-xl">
                  <div className="mb-2">
                    <b>LOẠI TRANG SỨC:</b>{" "}
                    {jewelryTypeMapping[request.category] ?? request.category}
                  </div>
                  <div className="mb-2">
                    <b>LOẠI VÀNG:</b> {request.materialName}
                  </div>
                  <div className="mb-2">
                    <b>TRỌNG LƯỢNG:</b> {request.materialWeight}
                  </div>
                  <div className="mb-2">
                    <b>ĐÁ CHÍNH:</b> {request.mainStone ?? "N/A"}
                  </div>
                  <div className="mb-2">
                    <b>ĐÁ PHỤ:</b> {request.subStone ?? "N/A"}
                  </div>
                  <div className="mb-2">
                    <b>MÔ TẢ:</b> {request.description}
                  </div>
                  <div className="mb-2">
                    <b>Chi phí: </b>
                    <b className="text-[#003468]">
                      {totalCost
                        ? new Intl.NumberFormat().format(totalCost)
                        : "N/A"}{" "}
                      ₫
                    </b>
                  </div>
                  <Popconfirm
                    title="Xác nhận hủy đơn "
                    onConfirm={() => handleDelete(request.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <button className="bg-red-500 p-2 rounded-md hover:bg-red-600 text-white">
                      Huỷ đơn <DeleteOutlined />
                    </button>
                  </Popconfirm>
                  <button
                    onClick={showModal}
                    className="bg-yellow-400 w-full p-2 rounded-lg text-lg md:text-2xl hover:bg-yellow-500 mt-4"
                  >
                    Đặt cọc
                  </button>
                  <Modal
                    title="Thanh toán đặt cọc"
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <p>
                      Số tiền đặt cọc:{" "}
                      <span className="text-[#003468]">
                        {new Intl.NumberFormat().format(totalCost / 2)} ₫
                      </span>
                    </p>
                    <PayPalButton
                      amount={totalCost / 2}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestDetail;
