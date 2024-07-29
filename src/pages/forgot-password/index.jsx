import { Form, Input, Button, message } from "antd";
import React, { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    code: "",
  });
  const [code, setCode] = useState();
  const navigate = useNavigate();

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleSubmitStep1 = async () => {
    try {
      const response = await axiosInstance.put(
        `cust/SendCodeThroughEmail?email=${formData.email}`
      );
      setCode(response.data.result);
      handleNextStep();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitStep2 = async () => {
    if (formData.code === code) {
      if (formData.newPassword.length < 8) {
        message.error("Mật khẩu phải có ít nhất 8 ký tự");
      } else {
        if (formData.newPassword === formData.confirmPassword) {
          try {
            const response = await axiosInstance.put(
              `cust/ResetNewPassword?email=${formData.email}&newPassword=${formData.newPassword}`
            );
            message.success("Đổi mật khẩu thành công");
            navigate("/login");
          } catch (error) {
            console.log(error);
          }
        } else {
          message.error("Mật khẩu không trùng khớp");
        }
      }
    } else {
      message.error("Mã xác thực không đúng");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-[#434343] min-h-screen w-screen flex items-center justify-center p-4">
      {step === 1 ? (
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h2 className="text-4xl mb-4">VUI LÒNG NHẬP EMAIL ĐÃ ĐƯỢC ĐĂNG KÝ</h2>
          <Form onFinish={handleSubmitStep1}>
            <label>Email:</label>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email đã được đăng ký!",
                },
              ]}
            >
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                name="email"
                className="w-full p-2 border rounded"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-[#F7EF8A] text-black text-xl hover:bg-gradient-to-br hover:from-white hover:to-[#fcec5f] rounded-lg p-2"
              >
                XÁC NHẬN
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : step === 2 ? (
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h2 className="text-2xl mb-4">NHẬP MẬT KHẨU MỚI</h2>
          <Form onFinish={handleSubmitStep2}>
            <label>Email:</label>
            <Form.Item>
              <Input
                value={formData.email}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </Form.Item>
            <label>Mật khẩu mới:</label>
            <Form.Item
              name="newPassword"
              rules={[{ required: true, message: "Nhập mật khẩu mới" }]}
            >
              <Input.Password
                value={formData.newPassword}
                onChange={handleInputChange}
                name="newPassword"
                className="w-full p-2 border rounded"
              />
            </Form.Item>
            <label>Xác nhận lại mật khẩu:</label>
            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Nhập lại mật khẩu vừa nhập",
                },
              ]}
            >
              <Input.Password
                value={formData.confirmPassword}
                onChange={handleInputChange}
                name="confirmPassword"
                className="w-full p-2 border rounded"
              />
            </Form.Item>
            <label>Mã xác nhận:</label>
            <Form.Item
              name="code"
              rules={[
                {
                  required: true,
                  message: "Nhập mã code đã được gửi trong email",
                },
              ]}
            >
              <Input
                value={formData.code}
                onChange={handleInputChange}
                name="code"
                className="w-full p-2 border rounded"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-[#F7EF8A] text-black text-xl hover:bg-gradient-to-br hover:from-white hover:to-[#fcec5f] rounded-lg p-2"
              >
                XÁC NHẬN
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default ForgotPassword;
