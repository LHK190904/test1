import LatestTransaction from "./transactions";
import TopSelling from "./top-selling";
import SaleTrend from "./trend";
import Overview from "./overview";
import Navbar from "../../components/navbar";
import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "../../components/logoutButton";
import { useEffect } from "react";
import authorService from "../../services/authorService";
import { Button, Dropdown, Menu } from "antd";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authorService.checkPermission("MANAGER")) {
      navigate("/unauthorized");
    }
  }, [navigate]);

  const handleNavigateClick = (path) => {
    navigate(path);
  };

  const menu = (
    <Menu>
      <Menu.Item key="requests">
        <button
          onClick={() => handleNavigateClick("/manager/request")}
          className="w-full text-left"
        >
          QUẢN LÝ YÊU CẦU
        </button>
      </Menu.Item>
      <Menu.Item key="orders">
        <button
          onClick={() => handleNavigateClick("/manager/order")}
          className="w-full text-left"
        >
          QUẢN LÝ ĐƠN HÀNG
        </button>
      </Menu.Item>
      <Menu.Item key="dashboard">
        <button
          onClick={() => handleNavigateClick("/dashboard")}
          className="w-full text-left"
        >
          DASHBOARD
        </button>
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutButton />
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="w-screen min-h-screen bg-gray-300">
      <div className="bg-[#1d1d1d] text-white h-40 flex justify-between items-center px-10">
        <Link to={"/"}>
          <img
            className="h-[160px] w-auto"
            src="/src/assets/images/logo.png"
            alt="Logo"
          />
        </Link>
        <div className="flex-grow text-center">
          <h1 className="text-5xl">QUẢN LÝ</h1>
        </div>
        <div className="w-80 text-right">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button className="bg-[#F7EF8A]">MENU</Button>
          </Dropdown>
        </div>
      </div>
      <Navbar />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-full">
          <Overview />
        </div>
        <div className="col-span-full">
          <SaleTrend />
        </div>
        <div className="col-span-7">
          <LatestTransaction />
        </div>
        <div className="col-span-5">
          <TopSelling />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
