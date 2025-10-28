import { useEffect, useState, type ElementType, useCallback } from "react";
import React from "react";

import AutodeclaracaoRural from "@/components/form-documents/AutodeclaracaoRural";
import DeclaracaoNaoRecebimentoForm from "@/components/form-documents/DeclaracaoNaoRecebimento";
import ProcuracaoInssForm from "@/components/form-documents/ProcuracaoInssForm";
import TermoRepresentacao from "@/components/form-documents/TermoRepresentacao";
import { Button } from "@/components/ui/button";
import { Divider } from "antd";
import { ArrowRight, CircleCheckBig, LucideProps, Play } from "lucide-react";
import styled from "styled-components";
import LoasDeficiencia from "@/components/form-documents/LoasDeficiencia";
import LoasIdoso from "@/components/form-documents/LoasIdoso";
import AuxilioDoenca from "@/components/form-documents/AuxilioDoenca";
import ProcuracaoPPP from "@/components/form-documents/ProcuracaoPPP";
import ProcuracaoDeclaracaoJudicial from "@/components/form-documents/ProcuracaoDeclaracaoJudicial";
import ContratoHonorarios from "@/components/form-documents/ContratoHonorarios";
import Api, { ApiErrorResponse } from "@/api";
import { toast } from "sonner";
import SpinLoader from "@/components/SpinLoader";
import { ClientType, Documento } from "@/pages/dashboard";
import { useRouter } from "next/router";
import Util from "@/utils/Util";

interface classNameStatusProps {
  div: string;
  text: string;
}

interface listFormsProps {
  idForm: string;
  label: string;
  completed: "preenchido" | "parcial" | "vazio";
  icon: ElementType;
  form: (
    client?: ClientType | null,
    idForm?: string,
    documents?: Documento[]
  ) => React.ReactNode;
  propsIcon: LucideProps;
  classNameStatus?: classNameStatusProps;
}

const listForms: listFormsProps[] = [
  {
    idForm: "contrato-honorarios",
    label: "Contrato de Honorarios",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: (client, idForm, documents) => (
      <ContratoHonorarios
        client={client}
        idForm={idForm}
        documents={documents}
      />
    ),
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "procuracao-declaracao-judicial",
    label: "Procuração e Declaração Judicial",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: (client, idForm, documents) => (
      <ProcuracaoDeclaracaoJudicial
        client={client}
        idForm={idForm}
        documents={documents}
      />
    ),
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "procuracao-ppp",
    label: "Procuração - PPP",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: (client, idForm, documents) => (
      <ProcuracaoPPP client={client} idForm={idForm} documents={documents} />
    ),
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "auxilio-doenca",
    label: "Auxilio Doença",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: (client, idForm, documents) => (
      <AuxilioDoenca client={client} idForm={idForm} documents={documents} />
    ),
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "loas-idoso",
    label: "Loas Idoso",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: (client, idForm, documents) => (
      <LoasIdoso client={client} idForm={idForm} documents={documents} />
    ),
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "loas-deficiencia",
    label: "Loas Deficiência",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: (client, idForm, documents) => (
      <LoasDeficiencia client={client} idForm={idForm} documents={documents} />
    ),
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "procuracao-inss",
    label: "Procuração INSS",
    completed: "preenchido",
    icon: CircleCheckBig,
    form: (client, idForm, documents) => (
      <ProcuracaoInssForm
        client={client}
        idForm={idForm}
        documents={documents}
      />
    ),
    propsIcon: {
      color: "#F5F5F5",
      fill: "#00B215",
      size: 24,
    },
    classNameStatus: {
      div: " bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] ",
      text: " text-[#00B215] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "autodeclaracao-rural",

    label: "Autodeclaração rural",
    completed: "parcial",
    icon: CircleCheckBig,
    form: (client, idForm, documents) => (
      <AutodeclaracaoRural
        client={client}
        idForm={idForm}
        documents={documents}
      />
    ),

    propsIcon: {
      color: "#00B215",
      className: " w-[18px] h-[18px] ",
    },
    classNameStatus: {
      div: "bg-[#A1A1A126] rounded-[50px] h-fit px-[10px] py-[2px] hover:bg-[#E1E1E1]",
      text: "text-[#13529C] text-[14px] font-[500] cursor-pointer ",
    },
  },
  {
    idForm: "termo-representacao",

    label: "Termo de representação",
    completed: "vazio",
    icon: Play,
    form: (client, idForm, documents) => (
      <TermoRepresentacao
        client={client}
        idForm={idForm}
        documents={documents}
      />
    ),

    propsIcon: {
      color: "#529FF6",
      className: " w-[18px] h-[18px] ",
      fill: "#529FF6",
    },
    classNameStatus: {
      div: " bg-[#529FF626] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] flex flex-row items-center gap-1",
      text: "text-[#13529C] text-[14px] font-[500] cursor-pointer",
    },
  },
  {
    idForm: "declaracao-nao-recebimento",
    label: "Declaração de não recebimento",
    completed: "vazio",
    icon: Play,
    form: (client, idForm, documents) => (
      <DeclaracaoNaoRecebimentoForm
        client={client}
        idForm={idForm}
        documents={documents}
      />
    ),
    propsIcon: {
      color: "#529FF6",
      className: " w-[18px] h-[18px] ",
      fill: "#529FF6",
    },
    classNameStatus: {
      div: " bg-[#529FF626] rounded-[50px] h-fit px-[10px] py-[2px]  hover:bg-[#77ff874f] flex flex-row items-center gap-1",
      text: "text-[#13529C] text-[14px] font-[500] cursor-pointer",
    },
  },
];

const FormContainer = styled.div`
  transition: all 0.3s ease-in-out;
  opacity: 1;
  transform: translateY(0);

  &.changing {
    opacity: 0;
    transform: translateY(10px);
  }
`;

export default function Documents() {
  const [client, setClient] = useState<ClientType | null>(null);
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const [formIsShown, setFormIsShown] = useState<{
    idForm: string;
    componentRenderer: (
      client?: ClientType | null,
      idForm?: string,
      documents?: Documento[]
    ) => React.ReactNode;
    label?: string;
  }>({
    idForm: listForms[0].idForm,
    componentRenderer: listForms[0].form,
    label: listForms[0].label,
  });

  const [isChanging, setIsChanging] = useState(false);

  const handleFormChange = (dataForm: {
    idForm: string;
    newRenderer: (
      client?: ClientType | null,
      idForm?: string,
      documents?: Documento[]
    ) => React.ReactNode;
    label: string;
  }) => {
    setIsChanging(true);
    setTimeout(() => {
      setFormIsShown({
        idForm: dataForm.idForm,
        componentRenderer: dataForm.newRenderer,
        label: dataForm.label,
      });
      setIsChanging(false);
    }, 150);
  };

  const fetchData = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const [clientData, documents] = await Promise.all([
        Api.get(`/clients/${id}`),
        Api.get(`/clients/${id}/document-status`),
      ]);
      setClient(clientData as unknown as ClientType);
      setDocuments(documents as unknown as Documento[] | []);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error("Erro capturado no componente:", apiError);
      toast.error(`Erro inesperado: ${apiError.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id && id !== "new" && typeof id === "string") {
      fetchData(id);
    }
  }, [id, fetchData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SpinLoader />
      </div>
    );
  }

  return (
    <main className=" max-w-[1200px] w-full mx-auto pb-[100px] px-5 mt-4 ">
      <div className="w-full flex flex-col justify-center items-center gap-[15px] border-1 border-[#DFDFDF] rounded-[8px] py-[8px] px-[34px] mb-[25px] ">
        <p className=" text-[14px] text-[#529FF6] ">
          {listForms.find((f) => f.idForm === formIsShown.idForm)?.label ||
            "Documento"}
        </p>
        <div className="flex flex-row items-center gap-[10px]">
          <Ball className="active" />
          <Ball />
          <Ball />
        </div>
        <p className=" text-[12px] text-[#529FF6] font-[300] ">
          Documento 1 de {listForms.length}
        </p>
      </div>

      <FormContainer className={isChanging ? "changing" : ""}>
        {formIsShown.componentRenderer(client, formIsShown.idForm, documents)}
      </FormContainer>

      <Divider />
      <div className=" flex flex-col gap-4 ">
        <p className="text-[#529FF6] font-[700] text-[24px] px-0">
          Próximos docs
        </p>

        <div className=" w-full flex flex-col gap-3 ">
          {listForms.map((item) => {
            if (Util.compararStrings(item.label, formIsShown.label)) {
              return null;
            }

            const IconDynamic = item.icon;
            const doc = documents.find((d) =>
              Util.compararStrings(item.label, d.title)
            );

            const isGenerated = doc?.status === "gerado";
            const statusText = isGenerated
              ? "Documento preenchido!"
              : "Clique para preencher este documento";

            const statusDivClass = isGenerated
              ? "bg-[#00B2151A] rounded-[50px] h-fit px-[10px] py-[2px] hover:bg-[#77ff874f]"
              : "bg-[#529FF626] rounded-[50px] h-fit px-[10px] py-[2px] hover:bg-[#77ff874f] flex flex-row items-center gap-1";

            const statusTextClass = isGenerated
              ? "text-[#00B215] text-[14px] font-[500] cursor-pointer"
              : "text-[#13529C] text-[14px] font-[500] cursor-pointer";

            return (
              <Button
                key={item.idForm}
                className=" bg-[#F5F5F5] text-[#1C3552] text-[16px] flex flex-row items-center justify-between  w-full rounded-[8px] h-[40px] cursor-pointer  hover:bg-[#E1E1E1]  "
                onClick={() =>
                  handleFormChange({
                    idForm: doc?.templateId || item.idForm,
                    newRenderer: item.form,
                    label: item.label,
                  })
                }
              >
                <div className=" flex flex-row items-center gap-2 ">
                  <IconDynamic {...item.propsIcon} />
                  <span className=" text-[#13529C]  text-[16px] font-[400]  ">
                    {item.label}
                  </span>
                </div>

                <div className={statusDivClass}>
                  <p className={statusTextClass}>{statusText}</p>
                  {!isGenerated && <ArrowRight color="#13529C" />}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

const Ball = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #d9d9d9;

  & .active {
    background-color: #529ff6 !important ;
  }
`;
