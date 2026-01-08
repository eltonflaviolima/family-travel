import axios from "axios";

export const AuthAPI = {
  login: (username: string, password: string) =>
    axios.post("http://localhost:8000/api/token/", { username, password }),
};
