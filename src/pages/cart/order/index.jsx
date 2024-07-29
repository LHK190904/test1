import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";
import { Button, message, Modal, Popconfirm } from "antd";
import Stepper from "../../../components/stepper";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PayPalButton from "../../../components/paypalButton";
import { DeleteOutlined } from "@mui/icons-material";
import authService from "../../../services/authService";

function CartOrder() {
  const { requestID } = useParams();
  const [order, setOrder] = useState({});

  const [design, setDesign] = useState({});
  const [invoice, setInvoice] = useState({});
  const [process, setProcess] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [stones, setStones] = useState([]);
  const [isPaid, setIsPaid] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!requestID) {
      console.error("Request ID is undefined");
      return;
    }
    try {
      const responseOrder = await axiosInstance.get(
        `request-orders/getOrderByRequestIdForCustomer/${requestID}`
      );
      setOrder(responseOrder.data.result);
      console.log(responseOrder.data.result);
      if (responseOrder.data.result.status === "finished") {
        setIsPaid(true);
      }
      try {
        const responseDesign = await axiosInstance.get(
          `design/${responseOrder.data.result.id}`
        );
        setDesign(responseDesign.data.result);
      } catch (error) {
        console.log(`No image found`);
      }
      try {
        const responseProcess = await axiosInstance.get(
          `process/getProcessByRequestOrderId/${responseOrder.data.result.id}`
        );
        setProcess(responseProcess.data.result);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrder({});
    }
  };

  const fetchInvoice = async () => {
    try {
      await axiosInstance.post(`invoices/${order.requestID}`);
      await axiosInstance.post(`invoice-details/${order.id}`);
      const response = await axiosInstance(
        `invoices/getInvoiceInfor/${order.id}`
      );
      setInvoice(response.data.result);
      console.log(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStone = async () => {
    try {
      const response = await axiosInstance.get(`material/notGold`);
      setStones(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      fetchOrders();
      fetchStone();
    } else {
      navigate("/");
    }
  }, [requestID, isPaid]);

  useEffect(() => {
    if (order.status === "Completed!!!") {
      fetchInvoice();
    } else if (order.status === "finished") {
      fetchInvoice();
      setIsPaid(true);
    }
  }, [order]);

  const handlePaymentSuccess = async () => {
    try {
      console.log("Order:", order);
      await axiosInstance.post(`/payment/createPayment/${requestID}`);
      const payID = await axiosInstance.get(
        `payment/getPayment/${requestID}/Payment`
      );
      await axiosInstance.put(`/payment/makePayment/${payID.data.result.id}`);
      await axiosInstance.post(`/warranty-cards/${order.id}`);
      setIsPaid(true);

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

  const handleApprove = async () => {
    try {
      const values = { feedback };
      await axiosInstance.put(
        `request-orders/acceptDesign/${design.id}`,
        values
      );
      message.success(`Đã gửi`);
      setFeedback("");
      window.location.reload();
    } catch (error) {
      console.log(error);
      message.error("Nhân viên thiết kế chưa gửi bản thiết kế");
    }
  };

  const handleDeny = async () => {
    try {
      const requestData = {
        description: feedback,
      };
      await axiosInstance.put(`design/denyDesign/${design.id}`, requestData);
      message.success(`Đã gửi`);
      setFeedback("");
    } catch (error) {
      console.log(error);
      message.error("Nhân viên thiết kế chưa gửi bản thiết kế");
    }
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleChange = (e) => {
    setFeedback(e.target.value);
  };

  const getCurrentStep = () => {
    if (process && process.status) {
      switch (process.status) {
        case "25%":
          return 1;
        case "50%":
          return 2;
        case "75%":
          return 3;
        case "100%":
          return 4;
        default:
          return 1;
      }
    }
    return 1;
  };

  const handleShowModal = () => {
    setIsOpenModal(true);
  };

  const handleHideModal = () => {
    setIsOpenModal(false);
  };
  const handleDelete = async (reqID) => {
    try {
      await axiosInstance.put(`requests/deleteRequest/${reqID}`);
      navigate("/cart/request");
      message.success("Huỷ đơn thành công");
    } catch (error) {
      console.error(`Error deleting request ID ${reqID}`, error);
    }
  };
  const getStoneType = (stoneId) => {
    const stone = stones.find((stone) => stone.id === stoneId);
    return stone ? stone.materialName : "N/A";
  };

  const handleViewWarranty = async () => {
    try {
      const response = await axiosInstance.get(
        `/generate-certificate/${requestID}`,
        {
          responseType: "blob", // Đảm bảo rằng phản hồi từ API là dạng blob
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Warranty_${order.id}.pdf`); // Tên tệp tải xuống
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success("Giấy bảo hành đã được tải thành công!");
    } catch (error) {
      console.error("Error fetching warranty:", error);
      message.error("Có lỗi xảy ra khi tải giấy bảo hành");
    }
  };

  return (
    <div className="bg-[#434343] min-h-screen w-screen p-4 md:p-8">
      <h1 className="text-center text-2xl md:text-4xl font-bold py-4 text-[#F7EF8A]">
        CHI TIẾT ĐƠN HÀNG
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        <div className="col-span-1 md:col-start-2 md:col-span-10 bg-gray-300 rounded-lg p-4 md:p-2">
          <h1 className="text-xl md:text-2xl text-center my-4">CHI TIẾT</h1>
          <div className="grid grid-cols-1 md:grid-cols-5 mt-4">
            <div className="col-span-1 md:col-span-5 bg-white">
              {order.status === "New" ? (
                <div className="my-4 text-lg md:text-2xl text-center">
                  Đang chờ phân công công việc . . .
                </div>
              ) : order.status === "Assigned" ||
                order.status === "Design Denied" ||
                order.status === "Waiting for customer's decision" ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {design.listURLImage && design.listURLImage.length > 0 ? (
                    <div className="col-span-1 md:col-span-6 flex flex-col items-center">
                      <img
                        src={selectedImage || design.listURLImage[0]}
                        alt="Chưa có hình ảnh"
                        className="rounded-lg w-full md:w-[300px] h-[300px] object-cover"
                      />
                      <div className="flex flex-wrap justify-center mt-4">
                        {design.listURLImage.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt="Chưa có hình ảnh"
                            className="rounded-lg cursor-pointer w-[100px] h-[100px] mx-1"
                            onClick={() => handleImageClick(url)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-1 md:col-span-12 text-center">
                      Chưa có hình ảnh bản thiết kế chưa hoàn thành
                    </div>
                  )}

                  <div className="col-span-1 md:col-span-6 text-lg md:text-xl">
                    <div className="flex flex-col justify-evenly h-full p-1">
                      <form>
                        <label className="text-lg md:text-2xl">Nhận xét</label>
                        <textarea
                          value={feedback}
                          onChange={handleChange}
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        <div className="flex flex-col md:flex-row justify-around mt-4">
                          <Button
                            className="w-full md:w-auto bg-green-400 p-2 font-bold"
                            onClick={handleApprove}
                          >
                            Chấp nhận
                          </Button>
                          <Button
                            className="w-full md:w-auto bg-red-400 p-2 font-bold"
                            onClick={handleDeny}
                          >
                            Từ chối
                          </Button>
                        </div>
                      </form>

                      <Popconfirm
                        title="Xác nhận hủy đơn "
                        onConfirm={() => handleDelete(requestID)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <button className="bg-red-500 p-2 rounded-md hover:bg-red-600 text-white mt-28">
                          Huỷ đơn <DeleteOutlined />
                        </button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {design.listURLImage && design.listURLImage.length > 0 ? (
                    <div className="col-span-1 md:col-span-6 flex flex-col items-center">
                      <img
                        src={selectedImage || design.listURLImage[0]}
                        alt=""
                        className="rounded-lg w-full md:w-[300px] h-[300px] object-cover"
                      />
                      <div className="flex flex-wrap justify-center mt-4">
                        {design.listURLImage.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt=""
                            className="rounded-lg cursor-pointer w-[100px] h-[100px] mx-1"
                            onClick={() => handleImageClick(url)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-1 md:col-span-12 text-center">
                      Chưa có hình ảnh
                    </div>
                  )}
                  <div className="col-span-1 md:col-span-6 text-lg md:text-xl">
                    <div className="h-full">
                      <div>
                        <b>LOẠI TRANG SỨC:</b> {design.category}
                      </div>
                      <div>
                        <b>LOẠI VÀNG:</b> {design.materialName}
                      </div>
                      <div>
                        <b>TRỌNG LƯỢNG:</b> {design.materialWeight}
                      </div>
                      <div>
                        <b>ĐÁ CHÍNH:</b> {getStoneType(design.mainStoneId)}
                      </div>
                      <div>
                        <b>ĐÁ PHỤ:</b> {getStoneType(design.subStoneId)}
                      </div>
                      <div>
                        <b>MÔ TẢ:</b> {design.description}
                      </div>
                      <div>
                        <b>TIẾN TRÌNH:</b> {process ? process.status : "N/A"}
                      </div>
                      <Stepper currentStep={getCurrentStep()} />
                      <div className="mb-10 mt-3">
                        <b>CẬP NHẬT LÚC:</b>
                        {process
                          ? new Date(process.updatedAt).toLocaleString()
                          : "N/A"}
                      </div>
                      {order.status !== "finished" && (
                        <Popconfirm
                          title="Xác nhận hủy đơn "
                          onConfirm={() => handleDelete(requestID)}
                          okText="Có"
                          cancelText="Không"
                        >
                          <button className="bg-red-500 p-2 rounded-md hover:bg-red-600 text-white">
                            Huỷ đơn <DeleteOutlined />
                          </button>
                        </Popconfirm>
                      )}
                      {(order.status === "finished" ||
                        order.status === "Completed!!!") && (
                        <>
                          <button
                            onClick={handleShowModal}
                            className="bg-[#F7EF8A] w-full p-2 rounded-lg text-lg md:text-2xl hover:bg-gradient-to-br hover:from-white hover:to-[#fcec5f] mt-4"
                          >
                            XEM HÓA ĐƠN
                          </button>
                          <button
                            onClick={handleViewWarranty}
                            className="bg-[#F7EF8A] w-full p-2 rounded-lg text-lg md:text-2xl hover:bg-gradient-to-br hover:from-white hover:to-[#fcec5f] mt-4"
                          >
                            XEM GIẤY BẢO HÀNH
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="CHI TIẾT HÓA ĐƠN"
        open={isOpenModal}
        onOk={handleHideModal}
        onCancel={handleHideModal}
        width={"75%"}
        footer={null}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>TÊN SẢN PHẨM</TableCell>
                <TableCell>VẬT LIỆU</TableCell>
                <TableCell>TIỀN VẬT LIỆU</TableCell>
                <TableCell>ĐÁ CHÍNH</TableCell>
                <TableCell>TIỀN ĐÁ CHÍNH</TableCell>
                <TableCell>ĐÁ PHỤ</TableCell>
                <TableCell>TIỀN ĐÁ PHỤ</TableCell>
                <TableCell>TIỀN CÔNG</TableCell>
                <TableCell>TỔNG TIỀN</TableCell>
                <TableCell>NGÀY TẠO HÓA ĐƠN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{design.designName}</TableCell>
                <TableCell>{invoice.materialName}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat().format(invoice.materialTotalCost)}{" "}
                  VNĐ
                </TableCell>
                <TableCell>{invoice.mainStone}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat().format(invoice.mainStoneCost)} VNĐ
                </TableCell>
                <TableCell>{invoice.subStone}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat().format(invoice.subStoneCost)} VNĐ
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat().format(invoice.produceCost)} VNĐ
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat().format(invoice.invoiceTotalCost)} VNĐ
                </TableCell>
                <TableCell>
                  {new Date(invoice.invoiceCreatedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex justify-center mt-4">
          {isPaid ? (
            <div>Đã thanh toán</div>
          ) : (
            <PayPalButton
              amount={invoice.invoiceTotalCost / 2}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default CartOrder;
