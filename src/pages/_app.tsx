import Layout from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import GenerateDocumentProvider from "@/contexts/GenerateContext";
import "@/styles/globals.css";
import { AlertCircle, CheckCircle } from "lucide-react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
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
          <Component {...pageProps} />
        </GenerateDocumentProvider>
      </Layout>
    </>
  );
}
