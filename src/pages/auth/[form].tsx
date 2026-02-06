"use client";

import RegisterForm from "@/components/RegisterForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

type FormType = "login" | "signup" | string;

export default function AuthPage() {
  const [typeForm, setTypeForm] = useState<FormType>("login");
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const form = router.query.form as string;
    setTypeForm(form);
    
    if (form === "login") {
      router.replace("/");
    }
  }, [router.query.form, router]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gray-50 flex items-center justify-center p-4">
      {typeForm === "signup" ? <RegisterForm /> : null}
    </div>
  );
}
