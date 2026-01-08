import { useState } from "react";
import { AuthAPI } from "../api/auth.api";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await AuthAPI.login(username, password);

      const { access, refresh } = response.data;

      // salvar tokens no storage (ou cookies)
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      return true;
    } catch (err: any) {
      setError("Usuário ou senha inválidos.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};