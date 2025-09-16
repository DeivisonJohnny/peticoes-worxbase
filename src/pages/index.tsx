import AuthPage from "./auth/[form]";

// AQUI VAI FICAR A LOGICA DE SE O USUARIO JÁ TIVER AUTENTICADO NÃO FICAR EM LOGIN. JOGAR PARA O DASHBOARD

import { Suspense } from "react";
import SpinLoader from "@/components/SpinLoader";

export default function initialPage() {
  return (
    <Suspense fallback={<SpinLoader />}>
      <AuthPage />
    </Suspense>
  );
}
