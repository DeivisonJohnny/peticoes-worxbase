"use client";

import { useState, useEffect } from "react";
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

type UserType = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// Base schema for type inference (relaxed)
const baseSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().optional(),
  confirmPassword: yup.string().optional(),
});

type FormData = yup.InferType<typeof baseSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = id && id !== "new";
  const [showPassword, setShowPassword] = useState(false);

  // Dynamic schema based on isEditing
  const currentSchema = yup.object().shape({
    name: yup.string().required("O nome não pode ser vazio."),
    email: yup
      .string()
      .required("E-mail é obrigatório")
      .email("Digite um e-mail válido"),
    password: yup
      .string()
      .test("password-required", "Senha é obrigatória", function (value) {
        if (!isEditing && !value) return false;
        return true;
      })
      .test(
        "password-min",
        "A senha deve ter pelo menos 8 caracteres",
        function (value) {
          if (value && value.length < 8) return false;
          return true;
        }
      ),
    confirmPassword: yup
      .string()
      .test("passwords-match", "As senhas não coincidem", function (value) {
        return this.parent.password === value;
      })
      .test("confirm-required", "Confirme sua senha", function (value) {
        if (this.parent.password && !value) return false;
        return true;
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(currentSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (isEditing) {
      const fetchUser = async () => {
        try {
          const { name, email } = (await Api.get(`/users/${id}`)) as UserType;
          reset({
            name: name,
            email: email,
          });
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
          toast.error("Erro ao carregar dados do usuário.");
          router.push("/users");
        }
      };
      fetchUser();
    }
  }, [id, isEditing, reset, router]);

  const onSubmit = async (data: FormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _, ...apiData } = data;

      // If editing and password is empty, remove it from payload
      if (isEditing && !apiData.password) {
        delete (apiData as any).password;
      }

      if (isEditing) {
        await Api.patch(`/users/${id}`, apiData);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await Api.post("/users", apiData);
        toast.success("Usuário cadastrado com sucesso!");
      }
      router.push("/users");
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error("Erro capturado no componente:", apiError);
      toast.error(apiError.message);
    }
  };

  return (
    <Card className="w-full max-w-[548px] shadow-2xl py-10 px-[5px] mx-auto border-none">
      <CardHeader className="text-center pb-6">
        <h1 className="text-[clamp(24px,2.3vw,40px)] text-gray-900 text-left font-medium">
          {isEditing ? "Editar Usuário" : "Cadastro"}
        </h1>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-[15px] font-medium text-gray-700"
            >
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              className={`rounded-xl w-full p-5 text-[15px] md:text-[16px] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#529FF6] placeholder:text-gray-400 ${
                errors.name ? "ring-2 ring-red-500 bg-red-50" : ""
              }`}
              placeholder="Digite seu nome completo..."
            />
            {errors.name && (
              <p className="text-red-500 text-sm ml-1">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[15px] font-medium text-gray-700"
            >
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={`rounded-xl w-full p-5 text-[15px] md:text-[16px] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#529FF6] placeholder:text-gray-400 ${
                errors.email ? "ring-2 ring-red-500 bg-red-50" : ""
              }`}
              placeholder="Digite seu e-mail..."
            />
            {errors.email && (
              <p className="text-red-500 text-sm ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label
              htmlFor="password"
              className="text-[15px] font-medium text-gray-700"
            >
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`rounded-xl w-full p-5 text-[15px] md:text-[16px] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#529FF6] placeholder:text-gray-400 ${
                  errors.password ? "ring-2 ring-red-500 bg-red-50" : ""
                }`}
                placeholder={
                  isEditing
                    ? "Deixe em branco para manter a atual"
                    : "Digite sua senha..."
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-[#529FF6] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label
              htmlFor="confirmPassword"
              className="text-[15px] font-medium text-gray-700"
            >
              Confirme sua senha
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className={`rounded-xl w-full p-5 text-[15px] md:text-[16px] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#529FF6] placeholder:text-gray-400 ${
                  errors.confirmPassword ? "ring-2 ring-red-500 bg-red-50" : ""
                }`}
                placeholder={
                  isEditing ? "Repita a nova senha..." : "Repita sua senha..."
                }
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#529FF6] hover:bg-blue-600 active:scale-[0.99] transition-all duration-200 font-bold text-white py-6 text-[16px] rounded-xl shadow-md hover:shadow-lg mt-4"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{isEditing ? "Salvando..." : "Cadastrando..."}</span>
              </div>
            ) : isEditing ? (
              "Salvar Alterações"
            ) : (
              "Cadastrar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
