"use client";

import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

type FormType = "login" | "signup" | string;

export default function AuthPage() {
  const [typeForm, setTypeForm] = useState<FormType>("login");

  const router = useRouter();

  useEffect(() => {
    setTypeForm(router.query.form as string);
  }, [router.query.form]);

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gray-50 flex items-center justify-center p-4">
      {typeForm == "signup" ? <RegisterForm /> : <LoginForm />}
    </div>
  );
}
