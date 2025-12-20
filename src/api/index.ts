/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

export interface ApiErrorResponse {
  message: string;
  status?: number;
  data?: any;
}

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor de requisição para debug
Api.interceptors.request.use(
  (config) => {
    console.log(`🔵 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`🔵 [Cookies] ${document.cookie}`);
    return config;
  },
  (error) => {
    console.error('🔴 [Request Error]', error);
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`🟢 [API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);

    const contentType = response.headers["content-type"];

    if (
      contentType?.includes("application/pdf") ||
      contentType?.includes("application/zip") ||
      response.request?.responseType === "blob"
    ) {
      return response;
    }

    return response.data;
  },

  async (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`🔴 [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${status}`);

      if (status === 401) {
        console.warn('⚠️ [401 Unauthorized] Cookie httpOnly pode não estar sendo enviado corretamente');
        // httpOnly cookies são gerenciados pelo servidor
        // Solicitar ao backend para limpar o cookie
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const publicPaths = ["/auth/", "/public", "/"];

          const isPublicPath = publicPaths.some((path) =>
            currentPath.startsWith(path)
          );

          if (!isPublicPath) {
            // Fazer logout no backend para limpar o cookie httpOnly
            try {
              await Api.post("/logout").catch(() => {
                // Ignorar erros de logout
              });
            } catch {
              // Ignorar erros
            }

            toast.error(`Sessão expirada! Faça o login novamente.`);
            console.warn("Sessão expirada. Redirecionando para login...");
            window.location.href = "/";
          }
        }
      }

      const simplifiedError: ApiErrorResponse = {
        message: (data as any)?.message || error.message,
        status: status,
        data: data,
      };

      return Promise.reject(simplifiedError);
    }

    const networkError: ApiErrorResponse = {
      message: error.message || "Ocorreu um erro de rede.",
    };
    return Promise.reject(networkError);
  }
);

export default Api;
