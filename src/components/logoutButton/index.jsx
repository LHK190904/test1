import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { LogoutOutlined } from "@mui/icons-material";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    authService.logout();
  };

  return (
    <button
      className=" bg-red-500 text-black text-xl rounded-md p-1"
      onClick={handleLogout}
    >
      <LogoutOutlined />
      ĐĂNG XUẤT
    </button>
  );
}

export default LogoutButton;
