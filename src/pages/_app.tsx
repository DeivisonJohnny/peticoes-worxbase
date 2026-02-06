import Layout from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import GenerateDocumentProvider from "@/contexts/GenerateContext";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/styles/globals.css";
import { AlertCircle, CheckCircle } from "lucide-react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const publicRoutes = ["/", "/auth/login", "/auth/register", "/auth/forgot-password"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublicRoute = publicRoutes.includes(router.pathname) || router.pathname.startsWith("/auth/");

  return (
    <>
      <AuthProvider>
        <Layout>
          <Toaster
            theme="light"
            position="top-right"
            icons={{
              error: <AlertCircle color="red" />,
              success: <CheckCircle color="#16a34a" />,
            }}
            toastOptions={{
              classNames: {
                toast: "toast",
                success: "success",
                error: "error",
                warning: "warning",
                info: "info",
              },
            }}
            style={{ top: "80px", right: "30px", position: "fixed" }}
          />
          <GenerateDocumentProvider>
            {isPublicRoute ? (
              <Component {...pageProps} />
            ) : (
              <ProtectedRoute>
                <Component {...pageProps} />
              </ProtectedRoute>
            )}
          </GenerateDocumentProvider>
        </Layout>
      </AuthProvider>
    </>
  );
}
