"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Api, { ApiErrorResponse } from "@/api";
import { toast } from "sonner";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("E-mail é obrigatório")
    .email("Digite um e-mail válido"),
  password: yup
    .string()
    .required("Senha é obrigatória")
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
});

type FormData = yup.InferType<typeof schema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    setIsloading(true);
    try {
      await Api.post("/", data);

      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        router.replace("/dashboard");
      }, 2000);
    } catch (error) {
      const apiError = error as ApiErrorResponse;

      console.error("🚀 ~ Erro de autenticação:", apiError);
      toast.error(`Erro de autenticação: ${apiError.message}`);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg py-10 px-4 sm:px-4 max-md:px-2">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center">
          <Image
            src={"/images/logoLogin.png"}
            width={1000}
            height={1000}
            alt="logo"
            className="w-40 sm:w-56 md:w-60"
          />
        </div>
        <h1 className="text-4xl lg:text-3xl md:text-2xl sm:text-xl max-md:text-[22px]  text-gray-900 text-left">
          Login
        </h1>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[16px] lg:text-[15px] md:text-[14px] sm:text-[13px] font-medium text-black"
            >
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={`rounded-[8px] w-full p-4 text-base lg:text-sm md:text-[14px] sm:text-[13px] placeholder:text-[#CCCCCC] placeholder:italic ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="Digite seu e-mail..."
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label
              htmlFor="password"
              className="text-[16px] lg:text-[15px] md:text-[14px] sm:text-[13px] font-medium text-black"
            >
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`rounded-[8px] w-full p-4 text-base lg:text-sm md:text-[14px] sm:text-[13px] placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Digite sua senha..."
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-base lg:text-sm md:text-[14px] sm:text-[13px] text-[#0077FF] hover:text-blue-800"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#529FF6] font-bold hover:bg-blue-700 text-white py-4 sm:py-5 text-base lg:text-sm md:text-[14px] sm:text-[13px] rounded-[8px] cursor-pointer "
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              </>
            ) : (
              "Entrar"
            )}
          </Button>

          <div className="text-center pt-4 flex flex-col gap-2">
            <span className="text-sm lg:text-[13px] md:text-[12px] sm:text-[11px] text-gray-600">
              Não tem uma conta?
            </span>
            <Link
              href="/signup"
              className="text-sm lg:text-[13px] md:text-[12px] sm:text-[11px] text-[#3a96ff] hover:text-blue-800 font-bold underline"
            >
              Criar conta
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
