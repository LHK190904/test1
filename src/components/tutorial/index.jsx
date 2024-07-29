import React from "react";

function Tutorial() {
  return (
    <div className="bg-black text-white p-4 rounded-lg text-xl">
      <span>
        <ol className="mx-10">
          <li className="p-1">
            1. Tạo yêu cầu gia công với các{" "}
            <u>bản thiết kế có sẵn của công ty</u> hoặc do <b>khách hàng</b>{" "}
            <u>cung cấp</u>.
          </li>
          <li className="p-1">
            2. Nhân viên Sales của cửa hàng sẽ tiếp nhận, xem xét và đưa ra{" "}
            <u>giá phù hợp</u> cho yêu cầu. Yêu cầu sau đó sẽ được gửi cho{" "}
            <b>Quản lý</b> để được duyệt.
          </li>
          <li className="p-1">
            3. <b>Quản lý</b> sau khi nhận được yêu cầu cần được phê duyệt sẽ
            xem xét về giá đã được đưa ra và từ đó{" "}
            <u>đưa ra quyết định phê duyệt</u>.
          </li>
          <li className="p-1">
            4. Yêu cầu sau khi được phê duyệt sẽ được gửi về cho{" "}
            <b>khách hàng</b> trong giỏ hàng và <b>khách hàng</b> sẽ{" "}
            <u>xem được giá đã được phê duyệt</u>.
          </li>
          <li className="p-1">
            5. <b>Khách hàng</b> <u>xem xét giá</u> đã được gửi về để đưa ra
            quyết định(chấp nhận/từ chối kèm theo lý do) đối với giá đó để bắt
            đầu tạo đơn hàng-nếu không thì có thể chỉnh sửa lại yêu cầu.
          </li>
          <li className="p-1">
            6. <b>Khách hàng</b> <u>thực hiện đặt cọc</u> để tạo đơn hàng đối
            với yêu cầu đã được chấp thuận về giá ở 2 bên. Đơn hàng sẽ được gửi
            cho <b>Quản lý</b> và đợi để gia công
          </li>
          <li className="p-1">
            7. <b>Quản lý</b> nhận đơn hàng được đặt và{" "}
            <u>phân công công việc</u> cho các thợ gia công, thiết kế(nếu{" "}
            <b>khách hàng </b>
            <u>không có bản thiết kế</u>).
          </li>
          <ol className="p-1">
            <li className="mx-4">
              7.1 Nếu <b>khách hàng</b> đặt <u>gia công theo yêu cầu</u> và{" "}
              <u>không cung cấp bản thiết kế</u> thì khi tạo đơn, phía công ty
              sẽ chỉ định <b>nhân viên thiết kế</b> làm việc với khách hàng để
              đưa ra <u>bản thiết kế phù hợp</u>.
            </li>
            <li className="mx-4">
              7.2 <b>Khách hàng</b> có thể xem xét{" "}
              <u>chấp thuận hoặc từ chối</u> (kèm theo lý do) đối với bản thiết
              kế cá nhân do <b>nhân viên thiết kế</b> cung cấp.
            </li>
            <li className="mx-4">
              7.3 Nếu <u>chấp thuận</u>, <u>bản thiết kế cá nhân</u> sẽ được gửi
              cho <b>nhân viên gia công</b> để thực hiện gia công.
            </li>
          </ol>
          <li>
            8. Các <b>nhân viên gia công</b> sẽ nhận được đơn hàng và tiến hành
            gia công theo như yêu cầu đã được nêu trong đơn hàng cùng với đó là{" "}
            <u>báo cáo tiến độ gia công</u> của sản phẩm.
          </li>
          <li>
            9. Sản phẩm sau khi được hoàn thiện sẽ báo cho bên khách hàng để
            tiến hành <u>thanh toán và bàn giao sản phẩm</u>.
          </li>
        </ol>
      </span>
    </div>
  );
}

export default Tutorial;
