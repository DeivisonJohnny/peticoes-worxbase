"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const procuracaoSchema = yup.object({
  grantorName: yup
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .required("Nome completo é obrigatório"),
  grantorNationality: yup
    .string()
    .min(3, "Nacionalidade deve ter ao menos 3 caracteres")
    .required("Nacionalidade é obrigatória"),
  grantorMaritalStatus: yup
    .string()
    .min(5, "Estado civil deve ter ao menos 5 caracteres")
    .required("Estado civil é obrigatório"),
  grantorIdentity: yup
    .string()
    .min(5, "Identidade deve ter ao menos 5 caracteres")
    .required("Identidade é obrigatória"),
  grantorProfession: yup
    .string()
    .min(3, "Profissão deve ter ao menos 3 caracteres")
    .required("Profissão é obrigatória"),
  grantorAddress: yup
    .string()
    .min(5, "Endereço deve ter ao menos 5 caracteres")
    .required("Endereço é obrigatório"),
  grantorNumber: yup
    .string()
    .min(1, "Número deve ter ao menos 1 caractere")
    .required("Número é obrigatório"),
  grantorComplement: yup.string(),
  grantorNeighborhood: yup
    .string()
    .min(3, "Bairro deve ter ao menos 3 caracteres")
    .required("Bairro é obrigatório"),
  grantorCity: yup
    .string()
    .min(2, "Cidade deve ter ao menos 2 caracteres")
    .required("Cidade é obrigatória"),
  grantorState: yup
    .string()
    .min(2, "Estado deve ter ao menos 2 caracteres")
    .required("Estado é obrigatório"),
  grantorZipCode: yup
    .string()
    .required("CEP é obrigatório")
    .matches(/^\d{5}-?\d{3}$/, "CEP deve estar no formato 00000-000"),

  granteeName: yup
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .required("Nome completo é obrigatório"),
  granteeNationality: yup
    .string()
    .min(3, "Nacionalidade deve ter ao menos 3 caracteres")
    .required("Nacionalidade é obrigatória"),
  granteeMaritalStatus: yup
    .string()
    .min(5, "Estado civil deve ter ao menos 5 caracteres")
    .required("Estado civil é obrigatório"),
  granteeIdentity: yup
    .string()
    .min(5, "Identidade deve ter ao menos 5 caracteres")
    .required("Identidade é obrigatória"),
  granteeProfession: yup
    .string()
    .min(3, "Profissão deve ter ao menos 3 caracteres")
    .required("Profissão é obrigatória"),
  granteeAddress: yup
    .string()
    .min(5, "Endereço deve ter ao menos 5 caracteres")
    .required("Endereço é obrigatório"),
  granteeNumber: yup
    .string()
    .min(1, "Número deve ter ao menos 1 caractere")
    .required("Número é obrigatório"),
  granteeComplement: yup.string(),
  granteeNeighborhood: yup
    .string()
    .min(3, "Bairro deve ter ao menos 3 caracteres")
    .required("Bairro é obrigatório"),
  granteeCity: yup
    .string()
    .min(2, "Cidade deve ter ao menos 2 caracteres")
    .required("Cidade é obrigatória"),
  granteeState: yup
    .string()
    .min(2, "Estado deve ter ao menos 2 caracteres")
    .required("Estado é obrigatório"),
  granteeZipCode: yup
    .string()
    .required("CEP é obrigatório")
    .matches(/^\d{5}-?\d{3}$/, "CEP deve estar no formato 00000-000"),
});

type ProcuracaoFormData = yup.InferType<typeof procuracaoSchema>;
type ProcuracaoResolver = Resolver<ProcuracaoFormData>;

export default function ProcuracaoInssForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProcuracaoFormData>({
    resolver: yupResolver(procuracaoSchema) as ProcuracaoResolver,
    mode: "onChange",
  });

  const onSubmit = (data: ProcuracaoFormData) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen p-6 md:p-0 w-[100%] ">
      <div className=" max-w-[1200px] w-full mx-auto">
        <Card className="p-0 border-none shadow-none gap-4 ">
          <CardHeader className="text-[#529FF6] font-[700] text-[24px] px-0">
            Procuração INSS{" "}
          </CardHeader>

          <CardContent className="px-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col gap-[40px] "
            >
              <div className="space-y-2">
                <div className="space-y-2">
                  <p className=" text-[#1C3552] text-[18px] font-[600] ">
                    Dados do outorgante (segurado/dependente)
                  </p>
                  <Label
                    htmlFor="grantorName"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Nome completo
                  </Label>
                  <Input
                    id="grantorName"
                    type="text"
                    {...register("grantorName")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorName ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.grantorName && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="grantorNationality"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Nacionalidade{" "}
                  </Label>
                  <Input
                    id="grantorNationality"
                    type="text"
                    {...register("grantorNationality")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorNationality ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.grantorNationality && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorNationality.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="grantorMaritalStatus"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Estado Civil
                  </Label>
                  <Input
                    id="grantorMaritalStatus"
                    type="text"
                    {...register("grantorMaritalStatus")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorMaritalStatus ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.grantorMaritalStatus && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorMaritalStatus.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="grantorIdentity"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Identidade
                  </Label>
                  <Input
                    id="grantorIdentity"
                    type="text"
                    {...register("grantorIdentity")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorIdentity ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.grantorIdentity && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorIdentity.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="grantorProfession"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Profissão
                  </Label>
                  <Input
                    id="grantorProfession"
                    type="text"
                    {...register("grantorProfession")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorProfession ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.grantorProfession && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorProfession.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="grantorAddress"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Endereço
                  </Label>
                  <Input
                    id="grantorAddress"
                    type="text"
                    {...register("grantorAddress")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.grantorAddress ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.grantorAddress && (
                    <p className="text-red-500 text-sm">
                      {errors.grantorAddress.message}
                    </p>
                  )}
                  <div className="flex  flex-row gap-[15px] items-center ">
                    <div className="space-y-2 w-[20%] ">
                      <Label
                        htmlFor="grantorNumber"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Número
                      </Label>
                      <Input
                        id="grantorNumber"
                        type="text"
                        {...register("grantorNumber")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.grantorNumber ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.grantorNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.grantorNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 w-[40%] ">
                      <Label
                        htmlFor="grantorComplement"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Complemento
                      </Label>
                      <Input
                        id="grantorComplement"
                        type="text"
                        {...register("grantorComplement")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.grantorComplement ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.grantorComplement && (
                        <p className="text-red-500 text-sm">
                          {errors.grantorComplement.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-[40%] ">
                      <Label
                        htmlFor="grantorNeighborhood"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Bairro
                      </Label>
                      <Input
                        id="grantorNeighborhood"
                        type="text"
                        {...register("grantorNeighborhood")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.grantorNeighborhood ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.grantorNeighborhood && (
                        <p className="text-red-500 text-sm">
                          {errors.grantorNeighborhood.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex  flex-row gap-[15px] items-center ">
                    <div className="space-y-2 w-[30%] ">
                      <Label
                        htmlFor="grantorCity"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Cidade
                      </Label>
                      <Input
                        id="grantorCity"
                        type="text"
                        {...register("grantorCity")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.grantorCity ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.grantorCity && (
                        <p className="text-red-500 text-sm">
                          {errors.grantorCity.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 w-[20%] ">
                      <Label
                        htmlFor="grantorState"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Estado
                      </Label>
                      <Input
                        id="grantorState"
                        type="text"
                        {...register("grantorState")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.grantorState ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.grantorState && (
                        <p className="text-red-500 text-sm">
                          {errors.grantorState.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-[50%] ">
                      <Label
                        htmlFor="grantorZipCode"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        CEP
                      </Label>
                      <Input
                        id="grantorZipCode"
                        type="text"
                        {...register("grantorZipCode")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.grantorZipCode ? "border-red-500" : ""
                        }`}
                        placeholder="00000-000"
                      />
                      {errors.grantorZipCode && (
                        <p className="text-red-500 text-sm">
                          {errors.grantorZipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-2">
                  <p className=" text-[#1C3552] text-[18px] font-[600] ">
                    Dados do outorgado (procurador){" "}
                  </p>
                  <Label
                    htmlFor="granteeName"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Nome completo
                  </Label>
                  <Input
                    id="granteeName"
                    type="text"
                    {...register("granteeName")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.granteeName ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.granteeName && (
                    <p className="text-red-500 text-sm">
                      {errors.granteeName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="granteeNationality"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Nacionalidade{" "}
                  </Label>
                  <Input
                    id="granteeNationality"
                    type="text"
                    {...register("granteeNationality")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.granteeNationality ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.granteeNationality && (
                    <p className="text-red-500 text-sm">
                      {errors.granteeNationality.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="granteeMaritalStatus"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Estado Civil
                  </Label>
                  <Input
                    id="granteeMaritalStatus"
                    type="text"
                    {...register("granteeMaritalStatus")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.granteeMaritalStatus ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.granteeMaritalStatus && (
                    <p className="text-red-500 text-sm">
                      {errors.granteeMaritalStatus.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="granteeIdentity"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Identidade
                  </Label>
                  <Input
                    id="granteeIdentity"
                    type="text"
                    {...register("granteeIdentity")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.granteeIdentity ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.granteeIdentity && (
                    <p className="text-red-500 text-sm">
                      {errors.granteeIdentity.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="granteeProfession"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Profissão
                  </Label>
                  <Input
                    id="granteeProfession"
                    type="text"
                    {...register("granteeProfession")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.granteeProfession ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.granteeProfession && (
                    <p className="text-red-500 text-sm">
                      {errors.granteeProfession.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="granteeAddress"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Endereço
                  </Label>
                  <Input
                    id="granteeAddress"
                    type="text"
                    {...register("granteeAddress")}
                    className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.granteeAddress ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.granteeAddress && (
                    <p className="text-red-500 text-sm">
                      {errors.granteeAddress.message}
                    </p>
                  )}
                  <div className="flex  flex-row gap-[15px] items-center ">
                    <div className="space-y-2 w-[20%] ">
                      <Label
                        htmlFor="granteeNumber"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Número
                      </Label>
                      <Input
                        id="granteeNumber"
                        type="text"
                        {...register("granteeNumber")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.granteeNumber ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.granteeNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.granteeNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 w-[40%] ">
                      <Label
                        htmlFor="granteeComplement"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Complemento
                      </Label>
                      <Input
                        id="granteeComplement"
                        type="text"
                        {...register("granteeComplement")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.granteeComplement ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.granteeComplement && (
                        <p className="text-red-500 text-sm">
                          {errors.granteeComplement.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-[40%] ">
                      <Label
                        htmlFor="granteeNeighborhood"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Bairro
                      </Label>
                      <Input
                        id="granteeNeighborhood"
                        type="text"
                        {...register("granteeNeighborhood")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.granteeNeighborhood ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.granteeNeighborhood && (
                        <p className="text-red-500 text-sm">
                          {errors.granteeNeighborhood.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex  flex-row gap-[15px] items-center ">
                    <div className="space-y-2 w-[30%] ">
                      <Label
                        htmlFor="granteeCity"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Cidade
                      </Label>
                      <Input
                        id="granteeCity"
                        type="text"
                        {...register("granteeCity")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.granteeCity ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.granteeCity && (
                        <p className="text-red-500 text-sm">
                          {errors.granteeCity.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 w-[20%] ">
                      <Label
                        htmlFor="granteeState"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        Estado
                      </Label>
                      <Input
                        id="granteeState"
                        type="text"
                        {...register("granteeState")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.granteeState ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.granteeState && (
                        <p className="text-red-500 text-sm">
                          {errors.granteeState.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-[50%] ">
                      <Label
                        htmlFor="granteeZipCode"
                        className="text-[16px] md:text-[15]  text-[#9A9A9A] font-[400] "
                      >
                        CEP
                      </Label>
                      <Input
                        id="granteeZipCode"
                        type="text"
                        {...register("granteeZipCode")}
                        className={`rounded-[8px] w-full p-[18px] md:p-[20px] text-[15] md:text-[18px] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.granteeZipCode ? "border-red-500" : ""
                        }`}
                        placeholder="00000-000"
                      />
                      {errors.granteeZipCode && (
                        <p className="text-red-500 text-sm">
                          {errors.granteeZipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className=" flex flex-row items-center gap-5 ">
                <Button
                  type="submit"
                  className="w-[194px] bg-[#529FF6] font-bold hover:bg-blue-700 text-white py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px]"
                >
                  Finalizar documento
                </Button>
                <Button
                  type="button"
                  className="w-[177px] bg-[#fff]   border-1 border-[#DDB100] font-bold hover:bg-[#DDB000] hover:text-white  text-[#DDB000] py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px]"
                >
                  Limpar formulário
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
