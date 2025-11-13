"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Api, { ApiErrorResponse } from "@/api";
import { toast } from "sonner";
import { useRouter } from "next/router";

const schema = yup.object().shape({
  name: yup.string().required("O nome não pode ser vazio."),
  email: yup
    .string()
    .required("E-mail é obrigatório")
    .email("Digite um e-mail válido"),
  password: yup
    .string()
    .required("Senha é obrigatória")
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem")
    .required("Confirme sua senha"),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _, ...apiData } = data;
      const response = await Api.post("/users", apiData);
      console.log("🚀 ~ onSubmit ~ response:", response);
      toast.success("Usuário cadastrado com sucesso!");
      router.push('/users')
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error("Erro capturado no componente:", apiError);
      toast.error(apiError.message);
    }
  };

  return (
    <Card className="w-full max-w-[548px] shadow-lg py-10 px-[5px] mx-auto">
      <CardHeader className="text-center pb-6">
        <h1 className="text-[clamp(24px,2.3vw,40px)] text-gray-900 text-left font-medium">
          Cadastro
        </h1>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-[15px] md:text-[15] font-medium text-black"
            >
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              className={`rounded-xl w-full p-[18px] md:p-5 text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="Digite seu nome completo..."
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[15px] md:text-[15] font-medium text-black"
            >
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={`rounded-xl w-full p-[18px] md:p-5 text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
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
              className="text-[15px] md:text-[15] font-medium text-black"
            >
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`rounded-xl w-full p-[18px] md:p-5 text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Digite sua senha..."
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
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

          <div className="space-y-2 relative">
            <Label
              htmlFor="confirmPassword"
              className="text-[15px] md:text-[15] font-medium text-black"
            >
              Confirme sua senha
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className={`rounded-xl w-full p-[18px] md:p-5 text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                placeholder="Repita sua senha..."
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#529FF6] font-bold hover:bg-blue-700 text-white py-5 md:py-6 text-[15px] md:text-[15] rounded-xl"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Cadastrando...</span>
              </div>
            ) : (
              "Cadastrar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
