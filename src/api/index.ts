import axios from "axios";
import { toast } from "sonner";

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        document.cookie =
          "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const publicPaths = ["/auth/", "/public"];

          const isPublicPath = publicPaths.some((path) =>
            currentPath.startsWith(path)
          );

          if (!isPublicPath) {
            toast.error(`Erro de autenticação: ${error.response.data.message}`);
            console.warn("Sessão expirada. Redirecionando para login...");
            window.location.href = "/auth/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default Api;
