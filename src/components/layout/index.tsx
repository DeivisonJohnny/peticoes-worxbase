import { ReactNode } from "react";
import Header from "./Header";
import { Roboto } from "next/font/google";
import { DynamicBreadcrumb } from "../BreadcrumbDynamic";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={roboto.className}>
      <Header />
      <DynamicBreadcrumb />

      {children}
    </div>
  );
}
