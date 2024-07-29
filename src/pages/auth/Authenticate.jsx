import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getToken, setToken } from "../../services/authService";
import axiosInstance from "../../services/axiosInstance"; // Import axiosInstance
import {
  Box,
  CircularProgress,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Authenticate() {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  const getUserDetails = async (accessToken) => {
    try {
      const response = await axiosInstance.get("/cust/myInfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = response.data;

      if (data.result) {
        const userData = {
          username: data.result.userName,
          token: accessToken,
          title: data.result.title,
          id: data.result.id,
          noPassword: data.result.noPassword,
        };
        localStorage.setItem("user", JSON.stringify(userData));

        setCurrentUser(userData);
        setIsLoggedin(true);
      } else {
        console.error("Failed to get user details:", data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const authenticateUser = async () => {
    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];

      try {
        const response = await axiosInstance.post(
          `/auth/outbound/authentication?code=${authCode}`
        );
        const data = response.data;
        console.log(data);
        setToken(data.result.token);
        await getUserDetails(data.result.token);
      } catch (error) {
        console.error("Error during authentication:", error);
      }
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  const addPassword = async (event) => {
    event.preventDefault();

    const body = {
      password: newPassword,
    };

    try {
      const response = await axiosInstance.post("/cust/create-password", body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = response.data;

      if (data.code !== 1000) throw new Error(data.message);

      setToken(data.result?.token);
      setCurrentUser(data.result);
      if (doNotShowAgain) {
        localStorage.setItem("skipPasswordCreation", "true");
      }
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSkip = () => {
    if (doNotShowAgain) {
      localStorage.setItem("skipPasswordCreation", "true");
    }
    navigate("/");
  };

  useEffect(() => {
    const skipPasswordCreation =
      localStorage.getItem("skipPasswordCreation") === "true";
    if (skipPasswordCreation) {
      navigate("/");
    } else if (isLoggedin) {
      if (currentUser?.noPassword) {
        setCurrentUser(currentUser);
      } else {
        navigate("/");
      }
    }
  }, [isLoggedin, navigate, currentUser]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {!currentUser?.noPassword ? (
        <>
          <CircularProgress />
          <Typography>Authenticating...</Typography>
        </>
      ) : (
        <Box sx={{ width: "300px" }}>
          <Typography variant="h5">Đặt mật khẩu</Typography>
          <form onSubmit={addPassword}>
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={doNotShowAgain}
                  onChange={(e) => setDoNotShowAgain(e.target.checked)}
                />
              }
              label="Không hiển thị lại"
            />
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Đặt mật khẩu
            </Button>
            <Button
              onClick={handleSkip}
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mt: 1 }}
            >
              Bỏ qua
            </Button>
          </form>
        </Box>
      )}
    </Box>
  );
}
