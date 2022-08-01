const BASE_URL = `${process.env.SERVER_HOSTNAME}:${process.env.API_PORT}/api`;
import axios from "axios";
import LoginForm from "types/LoginForm";

const login = async (data: LoginForm) => {
  const response = await axios.post(`http://${BASE_URL}/login`, data);
  const token = response.data;
  localStorage.setItem("token", token);
  window.location.href = "/";
};
export default login;
