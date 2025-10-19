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

Api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (
      (response.headers["content-type"] as string).includes("application/pdf")
    ) {
      return response;
    }

    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;

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
            toast.error(`Sessão expirada! Faça o login novamente.`);
            console.warn("Sessão expirada. Redirecionando para login...");
            // window.location.href = "/auth/login";
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
