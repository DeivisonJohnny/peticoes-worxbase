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

    if (response.status === 401) {
      return Promise.reject(
        new AxiosError(
          "Unauthorized",
          "401",
          response.config,
          response.request,
          response,
        ),
      );
    }

    return response.data;
  },

  async (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`🔴 [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${status}`);

      if (status === 401) {
        console.warn("⚠️ [401 Unauthorized] Sessão inválida ou expirada");

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const isLoginPage = currentPath === "/";

          if (!isLoginPage) {
            toast.error(
              "Sua sessão expirou. Por favor, faça login novamente para continuar.",
              {
                duration: 5000,
                action: {
                  label: "Login",
                  onClick: () => (window.location.href = "/"),
                },
              },
            );

            try {
              await Api.post("/auth/logout");
            } catch (e) {}

            // Não forçar recarregamento se não for necessário para invalidar scripts.
            // Deixar que o ProtectedRoute ou o usuário redirecione.
            // Mas se estivermos em uma rota não protegida que fez uma requisição XHR e deu 401?
            // O ideal seria redirecionar via router do Next, mas aqui é difícil.
            // Vamos adicionar um delay para o toast aparecer antes do reload,
            // OU confiar que o AuthContext vai atualizar o estado e causar redirecionamento reativo.

            // Se o AuthContext atualizar 'isAuthenticated' para false,
            // componentes como ProtectedRoute e Header vão reagir.

            // Vamos testar removendo o window.location.href imediato.
            if (window.location.pathname !== "/") {
              setTimeout(() => {
                window.location.href = "/";
              }, 1500);
            }
          } else {
            // Se já estiver no login e der 401:
            // Verificar se é a rota /auth/me (verificação automática de sessão) para não mostrar erro
            // Se for login manual, mostra erro
            const isAuthCheck = error.config?.url?.includes("/auth/me");

            if (!isAuthCheck) {
              toast.error("Credenciais inválidas ou sessão expirada.");
            }
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
