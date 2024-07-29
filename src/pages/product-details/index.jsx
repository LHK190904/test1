import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import authService from "../../services/authService";
import { message } from "antd";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      const response = await axiosInstance.get("design/getAllCompanyDesign");
      const allProducts = response.data.result;
      const selectedProduct = allProducts.find(
        (item) => item.id === parseInt(productId)
      );
      setProduct(selectedProduct || {});
      setSelectedImage(selectedProduct?.listURLImage?.[0] || null);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axiosInstance.get("material/notGold");
      setMaterials(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const user = authService.getCurrentUser();
      console.log(user);
      if (!user) {
        navigate(`/login`);
      } else {
        try {
          const response = await axiosInstance.post(
            `requests/requestCompanyDesign/${user.id}/${product.id}`
          );
          message.success("Đặt gia công thành công");
        } catch (error) {
          message.error(
            "Vui lòng cập nhật đầy đủ thông tin trong 'Thông tin cá nhân'"
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchMaterials();
  }, [productId]);

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const getMaterialNameById = (id) => {
    const material = materials.find((item) => item.id === id);
    return material ? material.materialName : "";
  };

  return (
    <div className="w-screen min-h-screen bg-[#434343]">
      <h1 className="text-center text-2xl md:text-4xl font-bold py-4 text-[#F7EF8A]">
        CHI TIẾT SẢN PHẨM
      </h1>
      <div className="flex justify-center">
        <div className="w-full max-w-7xl bg-gray-300 rounded-lg p-4 md:p-8">
          <h1 className="text-xl md:text-2xl text-center my-4">CHI TIẾT</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center">
              <img
                src={selectedImage}
                alt={product.designName}
                className="rounded-lg w-full md:w-[400px] h-[400px] object-cover shadow-lg"
              />
              <div className="flex flex-wrap justify-center mt-4">
                {product.listURLImage &&
                  product.listURLImage.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={product.designName}
                      className="rounded-lg cursor-pointer w-[100px] h-[100px] mx-1 shadow-sm hover:shadow-lg transition-shadow duration-300"
                      onClick={() => handleImageClick(url)}
                    />
                  ))}
              </div>
            </div>
            <div className="text-lg md:text-xl">
              <div className="mb-2">
                <strong>LOẠI TRANG SỨC:</strong> {product.category}
              </div>
              <div className="mb-2">
                <strong>LOẠI VÀNG:</strong> {product.materialName}
              </div>
              <div className="mb-2">
                <strong>TRỌNG LƯỢNG:</strong> {product.materialWeight} lượng
              </div>
              <div className="mb-2">
                <strong>ĐÁ CHÍNH:</strong>{" "}
                {getMaterialNameById(product.mainStoneId)}
              </div>
              <div className="mb-2">
                <strong>ĐÁ PHỤ:</strong>{" "}
                {getMaterialNameById(product.subStoneId)}
              </div>
              <div className="mb-2">
                <strong>MÔ TẢ:</strong> {product.description}
              </div>
              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2 bg-[#F7EF8A] font-bold text-black rounded hover:bg-gradient-to-br hover:from-white hover:to-[#fcec5f] shadow-lg transition-transform duration-300 transform hover:scale-105"
                >
                  ĐẶT GIA CÔNG
                </button>
                <button
                  onClick={() => handleNavigate(`/collections`)}
                  className="px-6 py-2 text-[#F7EF8A] font-bold bg-black rounded shadow-lg transition-transform duration-300 transform hover:scale-105"
                >
                  QUAY VỀ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
