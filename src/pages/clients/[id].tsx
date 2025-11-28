
"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Util from "@/utils/Util";
import Api, { ApiErrorResponse } from "@/api";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ClientType } from "../dashboard";
import { useRouter } from "next/router";
import SpinLoader from "@/components/SpinLoader";

function formatPhone(value: string) {
  value = value.replace(/\D/g, "");
  if (value.length <= 10) {
    return value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    return value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }
}

type FormData = {
  name: string;
  cpforcnpj: string;
  address: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  rg?: string;
  maritalStatus?: string;
  birthPlace?: string;
  rgIssuer?: string;
  nickname?: string;
  nationality?: string;
  motherName?: string;
  occupation?: string;
};

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "O campo deve ter ao menos 3 caracteres")
    .required("O nome completo é obrigatório"),
  cpforcnpj: yup
    .string()
    .required("O CPF/CNPJ é obrigatório")
    .test(
      "is-valid-cpf-cnpj",
      "CPF/CNPJ inválido",
      (value) => value !== undefined && Util.validateCpfOrCnpj(value)
    ),
  address: yup
    .string()
    .min(3, "O campo deve ter ao menos 3 caracteres")
    .required("O endereço é obrigatório"),
  email: yup
    .string()
    .email("E-mail inválido")
    .required("O e-mail é obrigatório"),
  phone: yup
    .string()
    .required("O telefone é obrigatório")
    .test("is-valid-phone", "Telefone inválido", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }),
  dateOfBirth: yup.string(),
  rg: yup.string(),
  maritalStatus: yup.string(),
  birthPlace: yup.string(),
  rgIssuer: yup.string(),
  nickname: yup.string(),
  nationality: yup.string(),
  motherName: yup.string(),
  occupation: yup.string(),
});

export default function RegisterOrUpdateClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const router = useRouter();

  const { id } = router.query;

  const isNew = id === "new";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const isCnpj = data.cpforcnpj.length > 14;
      const { cpforcnpj, ...rest } = data;
      const bodySend = {
        ...rest,
        ...(isCnpj ? { cnpj: cpforcnpj } : { cpf: cpforcnpj }),
      };

      if (isNew) {
        const newClient: ClientType = await Api.post("/clients", bodySend);
        toast.success(`Cliente ${newClient.name} cadastrado com sucesso!`);
        router.push("/clients");
      } else {
        const newClient: ClientType = await Api.patch(
          `/clients/${id}`,
          bodySend
        );
        toast.success(`Cliente ${newClient.name} atualizado com sucesso!`);
        router.push("/clients");
      }
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error("🚀 ~ Erro ao cadastrar cliente:", apiError);
      toast.error(`Erro ao cadastrar: ${apiError.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const errorClass =
    "border-[1px] focus-visible:border-[red] focus-visible:shadow-[0_0_15px_-4px_#ff0000a4]";

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchClient = async () => {
      setIsLoadingUpdate(true);
      try {
        const client: ClientType = await Api.get(`/clients/${id}`);
        setValue("name", client.name || "");
        setValue("address", client.address || "");
        setValue("cpforcnpj", client.cpf || client.cnpj || "");
        setValue("phone", client.phone ? formatPhone(client.phone) : "");
        setValue("email", client.email || "");
        setValue("dateOfBirth", client.dateOfBirth ? (typeof client.dateOfBirth === 'string' ? client.dateOfBirth : new Date(client.dateOfBirth).toISOString().split('T')[0]) : "");
        setValue("rg", client.rg || "");
        setValue("maritalStatus", client.maritalStatus || "");
        setValue("birthPlace", client.birthPlace || "");
        setValue("rgIssuer", client.rgIssuer || "");
        setValue("nickname", client.nickname || "");
        setValue("nationality", client.nationality || "");
        setValue("motherName", client.motherName || "");
        setValue("occupation", client.occupation || "");
      } catch (error) {
        const apiError = error as ApiErrorResponse;
        console.log("🚀 ~ fetchClient ~ error:", error);
        toast.error(`Erro ao buscar dados do cliente: ${apiError.message}`);
      } finally {
        setIsLoadingUpdate(false);
      }
    };

    if (!isNew) {
      fetchClient();
    }
  }, [id, isNew, setValue]);

  if (isLoadingUpdate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SpinLoader />
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full min-h-[calc(100vh-70px)]">
      <Card className="w-full max-w-[75%] max-md:max-w-full shadow-none py-10 px-4 sm:px-4 max-md:px-2 border-0 gap-[10px]">
        <CardHeader className="text-[#9A9A9A] font-light text-[14px]">
          Cadastro de clientes
        </CardHeader>
        <CardContent>
          <h1 className="text-[24px] text-[#1C3552] font-medium">
            Cadastrar clientes
          </h1>
          <form
            className="space-y-4 mt-[20px]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium text-[#1C3552]">
                Nome completo do cliente
              </Label>
              <Input
                id="name"
                {...register("name")}
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.name
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                placeholder="Digite aqui..."
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="cpforcnpj" className="font-medium text-[#1C3552]">
                CPF/CNPJ
              </Label>
              <Input
                id="cpforcnpj"
                {...register("cpforcnpj")}
                onChange={(e) =>
                  setValue("cpforcnpj", Util.formatCpfCnpj(e.target.value), {
                    shouldValidate: true,
                  })
                }
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.cpforcnpj
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                placeholder="Digite aqui..."
              />
              {errors.cpforcnpj && (
                <p className="text-red-500 text-sm">
                  {errors.cpforcnpj.message}
                </p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="address" className="font-medium text-[#1C3552]">
                Endereço
              </Label>
              <Input
                id="address"
                {...register("address")}
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.address
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                placeholder="Digite aqui..."
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-[#1C3552]">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.email
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                placeholder="Digite aqui..."
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-medium text-[#1C3552]">
                Telefone
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                onChange={(e) =>
                  setValue("phone", formatPhone(e.target.value), {
                    shouldValidate: true,
                  })
                }
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.phone
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                maxLength={15}
                placeholder="Digite aqui..."
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="font-medium text-[#1C3552]">
                Data de nascimento
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.dateOfBirth
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rg" className="font-medium text-[#1C3552]">
                RG
              </Label>
              <Input
                id="rg"
                {...register("rg")}
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.rg
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                placeholder="Digite aqui..."
              />
              {errors.rg && (
                <p className="text-red-500 text-sm">{errors.rg.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rgIssuer" className="font-medium text-[#1C3552]">
                Órgão emissor do RG
              </Label>
              <Input
                id="rgIssuer"
                {...register("rgIssuer")}
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.rgIssuer
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                placeholder="Digite aqui..."
              />
              {errors.rgIssuer && (
                <p className="text-red-500 text-sm">{errors.rgIssuer.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritalStatus" className="font-medium text-[#1C3552]">
                Estado civil
              </Label>
              <Input
                id="maritalStatus"
                {...register("maritalStatus")}
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.maritalStatus
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                placeholder="Digite aqui..."
              />
              {errors.maritalStatus && (
                <p className="text-red-500 text-sm">{errors.maritalStatus.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPlace" className="font-medium text-[#1C3552]">
                Naturalidade
              </Label>
              <Input
                id="birthPlace"
                {...register("birthPlace")}
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.birthPlace
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                placeholder="Digite aqui..."
              />
              {errors.birthPlace && (
                <p className="text-red-500 text-sm">{errors.birthPlace.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality" className="font-medium text-[#1C3552]">
                Nacionalidade
              </Label>
              <Input
                id="nationality"
                {...register("nationality")}
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.nationality
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                placeholder="Digite aqui..."
              />
              {errors.nationality && (
                <p className="text-red-500 text-sm">{errors.nationality.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname" className="font-medium text-[#1C3552]">
                Apelido
              </Label>
              <Input
                id="nickname"
                {...register("nickname")}
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.nickname
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                placeholder="Digite aqui..."
              />
              {errors.nickname && (
                <p className="text-red-500 text-sm">{errors.nickname.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherName" className="font-medium text-[#1C3552]">
                Nome da mãe
              </Label>
              <Input
                id="motherName"
                {...register("motherName")}
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.motherName
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                placeholder="Digite aqui..."
              />
              {errors.motherName && (
                <p className="text-red-500 text-sm">{errors.motherName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation" className="font-medium text-[#1C3552]">
                Profissão
              </Label>
              <Input
                id="occupation"
                {...register("occupation")}
                className={` focus-visible:ring-[0px] rounded-[8px] w-full p-4 placeholder:text-[#CCCCCC] placeholder:italic ${
                  errors.occupation
                    ? errorClass
                    : " border-[1px] focus-visible:border-[#00a2ffa3] focus-visible:shadow-[0_0_15px_-4px_#0066ffa2]"
                }`}
                placeholder="Digite aqui..."
              />
              {errors.occupation && (
                <p className="text-red-500 text-sm">{errors.occupation.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-fit bg-[#529FF6] font-medium text-[16px] hover:bg-blue-700 text-white   focus-visible:ring-[0px] rounded-[8px] mt-[20px] min-w-[156px] min-h-[36px]  "
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                </>
              ) : (
                "Cadastrar cliente"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
