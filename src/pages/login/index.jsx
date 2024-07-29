import { useState } from "react";
import authService from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { OAuthConfig } from "../../config/OAuthConfig";
import GoogleIcon from "@mui/icons-material/Google";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.login(userName, password);
      console.log(user);
      if (user) {
        if (user.title === "ADMIN") {
          navigate("/admin");
          window.location.reload();
        } else if (user.title === "SALE_STAFF") {
          navigate("/saler/receive_requests");
          window.location.reload();
        } else if (user.title === "MANAGER") {
          navigate("/manager/order");
          window.location.reload();
        } else if (user.title === "DESIGN_STAFF") {
          navigate("/designer/process_orders");
          window.location.reload();
        } else if (user.title === "PRODUCTION_STAFF") {
          navigate("/production-staff/process-orders");
          window.location.reload();
        } else {
          navigate("/");
          window.location.reload();
        }
      }
    } catch (error) {}
  };

  const handleContinueWithGoogle = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    window.location.href = targetUrl;
  };

  return (
    <div className="flex items-center justify-center w-screen lg:min-h-screen bg-[#434343]">
      <div className="bg-white shadow-md rounded-lg w-full max-w-lg text-center m-4">
        <h4 className="text-2xl font-semibold p-4 border-b">ĐĂNG NHẬP</h4>
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 text-red-500">{errorMessage}</div>
          )}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-1/4 text-right mr-4" htmlFor="username">
                  Tài khoản:
                </label>
                <div className="flex-grow">
                  <input
                    type="text"
                    className="form-input w-full p-2 border border-gray-300 rounded-md"
                    id="username"
                    placeholder="Tài khoản"
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-1/4 text-right mr-4" htmlFor="password">
                  Mật khẩu:
                </label>
                <div className="flex-grow">
                  <input
                    type="password"
                    className="form-input w-full p-2 border border-gray-300 rounded-md"
                    id="password"
                    placeholder="Mật khẩu"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="w-1/2 bg-gray-800 text-[#F7EF8A] hover:text-[#ddd012] py-2 px-4 rounded-md transition-transform duration-300 transform hover:scale-105"
                >
                  ĐĂNG NHẬP
                </button>
                <button
                  type="button"
                  className="flex w-1/2 justify-center bg-white border border-gray-300 rounded-md py-2 px-2 gap-1 text-base transition-transform duration-300 transform hover:scale-105"
                  onClick={handleContinueWithGoogle}
                >
                  <GoogleIcon />
                  <span>ĐĂNG NHẬP VỚI GOOGLE</span>
                </button>
              </div>
              <Link
                to={"/register"}
                className="flex space-x-4 justify-center transition-transform duration-300 transform hover:scale-105"
              >
                ĐĂNG KÝ NGAY
              </Link>
            </div>
          </form>
          <button
            className="transition-transform duration-300 transform hover:scale-105 my-2"
            onClick={() => navigate("/forgot-password")}
          >
            QUÊN MẬT KHẨU
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
