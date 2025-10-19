"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

type MappedPagesType = {
  path: string;
  name: string;
};

const MAPPED_PAGES: MappedPagesType[] = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/documents", name: "Documentos" },
  { path: "/clients", name: "Lista de clientes" },
  { path: "/history", name: "Histórico" },
];

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/public")
  ) {
    return null;
  }

  const segments = pathname
    ? pathname.split("/").filter((segment) => segment !== "")
    : [];

  const breadcrumbItems = segments.map((segment, index) => {
    const currentPath = `/${segments.slice(0, index + 1).join("/")}`;

    const mappedPage = MAPPED_PAGES.find((item) => {
      if (currentPath === item.path) return true;
      if (currentPath.startsWith(item.path + "/")) return true;
      return false;
    });

    const label = (() => {
      if (mappedPage?.name && currentPath === mappedPage.path) {
        return mappedPage.name;
      }

      const isId = /^[a-zA-Z0-9_-]{6,}$/.test(segment);
      if (isId) return "Editar";

      switch (segment.toLowerCase()) {
        case "new":
          return "Novo Cadastro";
        default:
          return (
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, " ")
          );
      }
    })();

    return {
      path: currentPath,
      label: label,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <div className="max-w-[70%] m-auto mt-[20px]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="text-[#9A9A9A] font-light text-[14px]">
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>

          {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}

          {breadcrumbItems.map((item) => (
            <Fragment key={item.path}>
              <BreadcrumbItem
                className={`font-light text-[14px] ${
                  item.isLast ? "text-gray-700" : "text-[#9A9A9A]"
                }`}
              >
                {item.isLast ? (
                  <BreadcrumbLink>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbLink href={item.path}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!item.isLast && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
