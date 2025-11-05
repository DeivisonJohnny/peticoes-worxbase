"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import Util from "@/utils/Util";
import { useEffect, useState } from "react";
import { ClientType, Documento } from "@/pages/dashboard";
import Api, { ApiErrorResponse } from "@/api";
import { toast } from "sonner";
import { useGenerateDocument } from "@/contexts/GenerateContext";
import { Loader2 } from "lucide-react";

const statementSchema = yup.object({
  fullName: yup
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .required("Nome completo é obrigatório"),
  cpf: yup
    .string()
    .required("CPF é obrigatório")
    .test("cpf-valid", "CPF inválido", (value) =>
      Util.validateCpfOrCnpj(value || "")
    ),
  rg: yup
    .string()
    .min(5, "RG deve ter ao menos 5 caracteres")
    .required("RG é obrigatório"),

  receivesRetirementPension: yup.string().required("Esta opção é obrigatória"),
  benefitType: yup.string().when("receivesRetirementPension", {
    is: "sim",
    then: (schema) => schema.required("Tipo de benefício é obrigatório"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  relationshipWithProvider: yup.string().when("benefitType", {
    is: "pensao",
    then: (schema) => schema.required("Relação com instituidor é obrigatória"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  originatingEntity: yup.array(yup.string()).when("receivesRetirementPension", {
    is: "sim",
    then: (schema) =>
      schema
        .min(1, "Selecione ao menos um ente de origem")
        .required("Ente de origem é obrigatório"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  serverType: yup.string().when("receivesRetirementPension", {
    is: "sim",
    then: (schema) => schema.required("Tipo de servidor é obrigatório"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  benefitStartDate: yup.string().when("receivesRetirementPension", {
    is: "sim",
    then: (schema) => schema.required("Data de início é obrigatória"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  benefitAgencyName: yup.string().when("receivesRetirementPension", {
    is: "sim",
    then: (schema) =>
      schema
        .min(3, "Nome do órgão deve ter ao menos 3 caracteres")
        .required("Órgão é obrigatório"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  lastGrossSalary: yup.string().when("receivesRetirementPension", {
    is: "sim",
    then: (schema) => schema.required("Última remuneração é obrigatória"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  monthYearSalary: yup.string().when("receivesRetirementPension", {
    is: "sim",
    then: (schema) => schema.required("Mês/ano é obrigatório"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  location: yup.string().required("Local é obrigatório"),
  statementDate: yup.string().required("Data da declaração é obrigatória"),
});

type StatementFormData = yup.InferType<typeof statementSchema>;
type StatementResolver = Resolver<StatementFormData>;

interface DeclaracaoNaoRecebimentoFormProps {
  client?: ClientType | null;
  idForm?: string;
  documents?: Documento[];
}

export default function DeclaracaoNaoRecebimentoForm({
  client,
  idForm,
}: DeclaracaoNaoRecebimentoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { generatedDocument } = useGenerateDocument();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    resetField,
    formState: { errors },
  } = useForm<StatementFormData>({
    resolver: yupResolver(statementSchema) as StatementResolver,
    mode: "onChange",
    defaultValues: {
      originatingEntity: [],
    },
  });

  const receivesRetirementPension = watch("receivesRetirementPension");
  const benefitType = watch("benefitType");
  const originatingEntity = watch("originatingEntity") || [];

  useEffect(() => {
    if (receivesRetirementPension === "nao") {
      const fieldsToReset: (keyof StatementFormData)[] = [
        "benefitType",
        "relationshipWithProvider",
        "originatingEntity",
        "serverType",
        "benefitStartDate",
        "benefitAgencyName",
        "lastGrossSalary",
        "monthYearSalary",
      ];
      fieldsToReset.forEach((field) => resetField(field));
      setValue("originatingEntity", []);
    }
  }, [receivesRetirementPension, resetField, setValue]);

  useEffect(() => {
    if (benefitType !== "pensao") {
      resetField("relationshipWithProvider");
    }
  }, [benefitType, resetField]);

  const onSubmit = async (data: StatementFormData) => {
    setIsSubmitting(true);
    const body = {
      clientId: client?.id,
      templateId: idForm,
      extraData: data,
    };

    try {
      const response: { documentId?: string } = await Api.post(
        "/documents/generate",
        body
      );
      if (response?.documentId) {
        generatedDocument(response.documentId);
      }
      toast.success("Documento gerado com sucesso!");
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      toast.error(`${apiError.message}`);
      console.error("Erro capturado no componente:", apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = Util.formatCpfCnpj(e.target.value);
    setValue("cpf", formattedCpf, { shouldValidate: true });
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue) {
      setValue("lastGrossSalary", "", { shouldValidate: true });
      return;
    }
    const numberValue = parseFloat(rawValue) / 100;
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
    }).format(numberValue);
    setValue("lastGrossSalary", formattedValue, { shouldValidate: true });
  };

  const handleMultiCheckboxChange = (value: string) => {
    const currentValues = getValues("originatingEntity") || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    setValue("originatingEntity", newValues, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen p-6 md:p-0 w-[100%] ">
      <div className=" max-w-[1200px] w-full mx-auto">
        <Card className="p-0 border-none shadow-none gap-4 ">
          <CardHeader className="text-[#529FF6] font-[700] text-[24px] px-0">
            Declaração de não recebimento
          </CardHeader>

          <CardContent className="px-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col gap-[40px] "
            >
              <div className="space-y-2 flex flex-col gap-[20px] ">
                <div className="space-y-2">
                  <p className=" text-[#1C3552] text-[18px] font-[600] ">
                    Dados do outorgante (segurado/dependente)
                  </p>
                  <Label
                    htmlFor="fullName"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    Nome completo
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    {...register("fullName")}
                    className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.fullName ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="cpf"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    type="text"
                    {...register("cpf")}
                    onChange={handleCpfChange}
                    className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.cpf ? "border-red-500" : ""
                    }`}
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && (
                    <p className="text-red-500 text-sm">{errors.cpf.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="rg"
                    className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                  >
                    RG
                  </Label>
                  <Input
                    id="rg"
                    type="text"
                    {...register("rg")}
                    className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                      errors.rg ? "border-red-500" : ""
                    }`}
                    placeholder="Digite aqui..."
                  />
                  {errors.rg && (
                    <p className="text-red-500 text-sm">{errors.rg.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] ">
                    Você recebe aposentadoria/pensão de outro regime de
                    previdência?
                  </p>
                  <div className=" flex flex-row items-center gap-2 ">
                    <Checkbox
                      id="receivesRetirementPensionYes"
                      checked={receivesRetirementPension === "sim"}
                      onCheckedChange={() =>
                        setValue("receivesRetirementPension", "sim", {
                          shouldValidate: true,
                        })
                      }
                      className=" border-1 border-[#A7A7A7] rounded-[0px] "
                    />
                    <Label
                      htmlFor="receivesRetirementPensionYes"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Sim
                    </Label>
                  </div>
                  <div className=" flex flex-row items-center gap-2 ">
                    <Checkbox
                      id="receivesRetirementPensionNo"
                      checked={receivesRetirementPension === "nao"}
                      onCheckedChange={() =>
                        setValue("receivesRetirementPension", "nao", {
                          shouldValidate: true,
                        })
                      }
                      className=" border-1 border-[#A7A7A7] rounded-[0px] "
                    />
                    <Label
                      htmlFor="receivesRetirementPensionNo"
                      className="text-[14px]   text-[#1C3552] font-[300] "
                    >
                      Não
                    </Label>
                  </div>
                  {errors.receivesRetirementPension && (
                    <p className="text-red-500 text-sm">
                      {errors.receivesRetirementPension.message}
                    </p>
                  )}
                </div>

                {receivesRetirementPension === "sim" && (
                  <>
                    <div className="space-y-2">
                      <p className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] ">
                        Caso receba aposentadoria ou pensão de outro regime de
                        previdência, deverá declarar:
                      </p>
                      <p className="text-[14px] md:text-[15]  text-[#9A9A9A] font-[400]">
                        Tipo do benefício:
                      </p>
                      <div className=" flex flex-row items-center gap-2 ">
                        <Checkbox
                          id="typePension"
                          checked={benefitType === "pensao"}
                          onCheckedChange={() =>
                            setValue("benefitType", "pensao", {
                              shouldValidate: true,
                            })
                          }
                          className=" border-1 border-[#A7A7A7] rounded-[0px] "
                        />
                        <Label
                          htmlFor="typePension"
                          className="text-[14px]   text-[#1C3552] font-[300] "
                        >
                          Pensão
                        </Label>
                      </div>
                      <div className=" flex flex-row items-center gap-2 ">
                        <Checkbox
                          id="typeRetirement"
                          checked={benefitType === "aposentadoria"}
                          onCheckedChange={() =>
                            setValue("benefitType", "aposentadoria", {
                              shouldValidate: true,
                            })
                          }
                          className=" border-1 border-[#A7A7A7] rounded-[0px] "
                        />
                        <Label
                          htmlFor="typeRetirement"
                          className="text-[14px]   text-[#1C3552] font-[300] "
                        >
                          Aposentadoria
                        </Label>
                      </div>
                      {errors.benefitType && (
                        <p className="text-red-500 text-sm">
                          {errors.benefitType.message}
                        </p>
                      )}
                    </div>

                    {benefitType === "pensao" && (
                      <div className="space-y-2">
                        <p className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] ">
                          Caso opção seja Pensão, informar se a relação com o
                          instituidor era como cônjuge ou companheiro (a).
                        </p>
                        <div className=" flex flex-row items-center gap-2 ">
                          <Checkbox
                            id="relationSpouse"
                            checked={
                              watch("relationshipWithProvider") === "conjuge"
                            }
                            onCheckedChange={() =>
                              setValue("relationshipWithProvider", "conjuge", {
                                shouldValidate: true,
                              })
                            }
                            className=" border-1 border-[#A7A7A7] rounded-[0px] "
                          />
                          <Label
                            htmlFor="relationSpouse"
                            className="text-[14px]   text-[#1C3552] font-[300] "
                          >
                            Cônjuge
                          </Label>
                        </div>
                        <div className=" flex flex-row items-center gap-2 ">
                          <Checkbox
                            id="relationPartner"
                            checked={
                              watch("relationshipWithProvider") ===
                              "companheiro"
                            }
                            onCheckedChange={() =>
                              setValue(
                                "relationshipWithProvider",
                                "companheiro",
                                { shouldValidate: true }
                              )
                            }
                            className=" border-1 border-[#A7A7A7] rounded-[0px] "
                          />
                          <Label
                            htmlFor="relationPartner"
                            className="text-[14px]   text-[#1C3552] font-[300] "
                          >
                            Companheiro (a)
                          </Label>
                        </div>
                        {errors.relationshipWithProvider && (
                          <p className="text-red-500 text-sm">
                            {errors.relationshipWithProvider.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] ">
                        Ente de origem:
                      </p>
                      <div className=" flex flex-row items-center gap-2 ">
                        <Checkbox
                          id="entityState"
                          checked={originatingEntity.includes("estadual")}
                          onCheckedChange={() =>
                            handleMultiCheckboxChange("estadual")
                          }
                          className=" border-1 border-[#A7A7A7] rounded-[0px] "
                        />
                        <Label
                          htmlFor="entityState"
                          className="text-[14px]   text-[#1C3552] font-[300] "
                        >
                          Estadual
                        </Label>
                      </div>
                      <div className=" flex flex-row items-center gap-2 ">
                        <Checkbox
                          id="entityMunicipal"
                          checked={originatingEntity.includes("municipal")}
                          onCheckedChange={() =>
                            handleMultiCheckboxChange("municipal")
                          }
                          className=" border-1 border-[#A7A7A7] rounded-[0px] "
                        />
                        <Label
                          htmlFor="entityMunicipal"
                          className="text-[14px]   text-[#1C3552] font-[300] "
                        >
                          Municipal
                        </Label>
                      </div>
                      <div className=" flex flex-row items-center gap-2 ">
                        <Checkbox
                          id="entityFederal"
                          checked={originatingEntity.includes("federal")}
                          onCheckedChange={() =>
                            handleMultiCheckboxChange("federal")
                          }
                          className=" border-1 border-[#A7A7A7] rounded-[0px] "
                        />
                        <Label
                          htmlFor="entityFederal"
                          className="text-[14px]   text-[#1C3552] font-[300] "
                        >
                          Federal
                        </Label>
                      </div>
                      {errors.originatingEntity && (
                        <p className="text-red-500 text-sm">
                          {errors.originatingEntity.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] ">
                        Tipo de servidor:
                      </p>
                      <div className=" flex flex-row items-center gap-2 ">
                        <Checkbox
                          id="serverCivil"
                          checked={watch("serverType") === "civil"}
                          onCheckedChange={() =>
                            setValue("serverType", "civil", {
                              shouldValidate: true,
                            })
                          }
                          className=" border-1 border-[#A7A7A7] rounded-[0px] "
                        />
                        <Label
                          htmlFor="serverCivil"
                          className="text-[14px]   text-[#1C3552] font-[300] "
                        >
                          Civil
                        </Label>
                      </div>
                      <div className=" flex flex-row items-center gap-2 ">
                        <Checkbox
                          id="serverMilitary"
                          checked={watch("serverType") === "militar"}
                          onCheckedChange={() =>
                            setValue("serverType", "militar", {
                              shouldValidate: true,
                            })
                          }
                          className=" border-1 border-[#A7A7A7] rounded-[0px] "
                        />
                        <Label
                          htmlFor="serverMilitary"
                          className="text-[14px]   text-[#1C3552] font-[300] "
                        >
                          Militar
                        </Label>
                      </div>
                      {errors.serverType && (
                        <p className="text-red-500 text-sm">
                          {errors.serverType.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="benefitStartDate"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Data de início do benefício no outro regime:
                      </Label>
                      <Input
                        id="benefitStartDate"
                        type="date"
                        {...register("benefitStartDate")}
                        className={`rounded-[8px] w-fit h-[35px] px-[18px]  text-[15px] text-[#1C3552] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.benefitStartDate ? "border-red-500" : ""
                        }`}
                      />
                      {errors.benefitStartDate && (
                        <p className="text-red-500 text-sm">
                          {errors.benefitStartDate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="benefitAgencyName"
                        className="text-[16px] md:text-[15]  text-[#1C3552] font-[400] "
                      >
                        Nome do órgão da pensão/aposentadoria:
                      </Label>
                      <Input
                        id="benefitAgencyName"
                        type="text"
                        {...register("benefitAgencyName")}
                        className={`rounded-[8px] w-full h-[35px] px-[18px]  text-[15] placeholder:text-[#CCCCCC] placeholder:italic ${
                          errors.benefitAgencyName ? "border-red-500" : ""
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.benefitAgencyName && (
                        <p className="text-red-500 text-sm">
                          {errors.benefitAgencyName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-row gap-[15px]">
                        <div className="flex flex-col gap-[5px]">
                          <Label className="text-[16px] md:text-[15] text-[#1C3552] font-[400]">
                            Última remuneração bruta:
                          </Label>
                          <div className="flex items-center rounded-md border px-3">
                            <span className="text-[16px] mr-2 text-[#1C3552] italic">
                              R$
                            </span>
                            <Input
                              type="text"
                              {...register("lastGrossSalary")}
                              onChange={handleSalaryChange}
                              className={`rounded-[8px] w-full p-[16px] pl-0 text-[16px] placeholder:text-[#CCCCCC] placeholder:italic placeholder:font-[300] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                                errors.lastGrossSalary ? "border-red-500" : ""
                              }`}
                              placeholder="0,00"
                            />
                          </div>
                          {errors.lastGrossSalary && (
                            <p className="text-red-500 text-sm">
                              {errors.lastGrossSalary.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-[5px]">
                          <Label
                            htmlFor="monthYearSalary"
                            className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                          >
                            Mês/ano:
                          </Label>
                          <Input
                            id="monthYearSalary"
                            type="month"
                            {...register("monthYearSalary")}
                            className={`rounded-[8px] w-full p-[16px] text-[16px] text-[#1C3552] placeholder:text-[#CCCCCC] placeholder:italic placeholder:font-[300] border ${
                              errors.monthYearSalary
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus-visible:ring-0 focus-visible:ring-offset-0`}
                          />
                          {errors.monthYearSalary && (
                            <p className="text-red-500 text-sm">
                              {errors.monthYearSalary.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <div className="flex flex-row gap-[15px]">
                    <div className="flex flex-col gap-[5px] w-[40%]">
                      <Label className="text-[16px] md:text-[15] text-[#1C3552] font-[400]">
                        Local:
                      </Label>
                      <Input
                        id="location"
                        type="text"
                        {...register("location")}
                        className={`rounded-[0px] w-full h-[35px] px-[18px] text-[15] placeholder:text-[#CCCCCC] shadow-none placeholder:italic border-0 border-b ${
                          errors.location ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Digite aqui..."
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm">
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-[5px] w-[30%]">
                      <Label
                        htmlFor="statementDate"
                        className="text-[16px] md:text-[15] text-[#1C3552] font-[400]"
                      >
                        Data
                      </Label>
                      <Input
                        id="statementDate"
                        type="date"
                        {...register("statementDate")}
                        className={`rounded-[0px] w-fit h-[35px] px-[18px] text-[15px] text-[#1C3552] placeholder:text-[#CCCCCC] shadow-none border-0 border-b placeholder:italic ${
                          errors.statementDate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.statementDate && (
                        <p className="text-red-500 text-sm">
                          {errors.statementDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className=" flex flex-row items-center gap-5 ">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[194px] bg-[#529FF6] font-bold hover:bg-blue-700 text-white py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "Finalizar documento"
                  )}
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    const defaultVals: Record<
                      string,
                      string | string[] | undefined
                    > = {
                      fullName: "",
                      cpf: "",
                      rg: "",
                      receivesRetirementPension: undefined,
                      location: "",
                      statementDate: "",
                      originatingEntity: [],
                    };

                    Object.keys(getValues()).forEach((key) => {
                      resetField(key as keyof StatementFormData, {
                        defaultValue: defaultVals[key],
                      });
                    });
                  }}
                  className="w-[177px] bg-[#fff] border-1 border-[#DDB100] font-bold hover:bg-[#DDB000] hover:text-white text-[#DDB000] py-5 md:py-6 text-[15px] md:text-[15] rounded-[8px]"
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
