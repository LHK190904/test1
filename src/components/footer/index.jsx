import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-[#F7EF8A] p-4 w-screen">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <a href="/">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/jewelry-production-a025c.appspot.com/o/requests%2Flogo.png?alt=media&token=f74d4ea2-5687-40b8-b045-21d1c2daee7b"
              alt="Company Logo"
              className="w-[200px] h-auto"
            />
          </a>
        </div>
        <div>
          <div className="text-xl font-bold">Chi nhánh</div>
          <p>Quận 12</p>
          <p>Bình Thạnh</p>
          <p>Phú Nhuận</p>
          <p>Biên Hòa</p>
          <p>Quận 3</p>
          <p>Thủ Đức</p>
          <p>Bình Dương</p>
        </div>
        <div>
          <div className="text-xl font-bold">Phương thức thanh toán</div>
          <p>Paypal</p>
          <div className="text-xl font-bold">Chính sách</div>
          <p>Chính sách hoàn tiền</p>
        </div>
        <div>
          <div className="text-xl font-bold">Kết nối với chúng tôi</div>
          <div className="flex space-x-4 mb-4">
            <a
              href="https://www.facebook.com/profile.php?id=100006428314927"
              target="_blank"
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/jewelry-production-a025c.appspot.com/o/requests%2Ffacebook.jpg?alt=media&token=d26d6223-51ee-42ee-85db-f382e8c835b8"
                alt="Facebook"
                className="w-[50px] h-auto"
              />
            </a>
            <a href="#">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/jewelry-production-a025c.appspot.com/o/requests%2Finstagram.jpg?alt=media&token=17e9dc04-e6e6-4161-9117-670248fc3dc6"
                target="_blank"
                alt="Instagram"
                className="w-[50px] h-auto"
              />
            </a>
            <a href="https://zalo.me/0909910224" target="_blank">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/jewelry-production-a025c.appspot.com/o/requests%2Fzalo.jpg?alt=media&token=00313680-e692-447d-8b88-5c45b81a5b5a"
                alt="Zalo"
                className="w-[50px] h-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
