import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { Form, Input, Button, message } from "antd";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(`cust/myInfo`);
      setProfile(response.data.result);
      form.setFieldsValue(response.data.result);
      console.log(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const response = await axiosInstance.put(
        `cust/UpdateInfor/${profile.id}`,
        values
      );
      setProfile(response.data.result);
      console.log(response.data.result);
      setIsEdit(false);
      message.success("Cập nhật thành công");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="bg-[#434343] w-screen min-h-screen flex justify-center">
      <div className="bg-white w-3/4 p-8 rounded-lg">
        <h1 className="text-center text-4xl font-bold mb-6">
          THÔNG TIN NGƯỜI DÙNG
        </h1>
        {profile && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            initialValues={profile}
          >
            <Form.Item label="TÊN KHÁCH HÀNG" name="cusName">
              <Input readOnly={!isEdit} />
            </Form.Item>

            <Form.Item label="TÊN TÀI KHOẢN" name="userName">
              <Input readOnly />
            </Form.Item>

            <Form.Item label="EMAIL" name="email">
              <Input readOnly={!isEdit} />
            </Form.Item>

            <Form.Item label="ĐỊA CHỈ" name="address">
              <Input readOnly={!isEdit} />
            </Form.Item>

            <Form.Item label="SỐ ĐIỆN THOẠI" name="phoneNum">
              <Input readOnly={!isEdit} />
            </Form.Item>

            <div className="text-center mt-6">
              {isEdit ? (
                <div className="">
                  <button
                    type="submit"
                    className="text-xl p-2 w-1/4 rounded-lg bg-green-500 hover:bg-green-600 mx-1"
                  >
                    XÁC NHẬN
                  </button>
                  <button
                    type="reset"
                    onClick={() => setIsEdit(false)}
                    className="text-xl p-2 w-1/4 rounded-lg bg-red-500 hover:bg-red-600 mx-1"
                  >
                    HỦY
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="w-1/4 text-xl p-2 rounded-lg bg-[#F7EF8A] hover:bg-gradient-to-br hover:from-white hover:to-[#fcec5f]"
                >
                  CẬP NHẬT
                </button>
              )}
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}

export default Profile;
