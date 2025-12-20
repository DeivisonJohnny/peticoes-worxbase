"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/router";

type MenuItem = { label: string; page: string };

const menuItems: MenuItem[] = [
  { label: "Home", page: "/dashboard" },
  { label: "Cadastrar Cliente", page: "/clients/new" },
  { label: "Meus Clientes", page: "/clients" },
  { label: "Cadastrar Usuário", page: "/users/new" },
  { label: "Usuários", page: "/users" },
  { label: "Sair", page: "/" },
];

export default function Header() {
  const router = useRouter()
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname != '/') {
      setMenuList(menuItems);
    } else {
      setMenuList([]);
    }
  }, [pathname]);


  const handleLogout = async () => {
    try {
      // Chamar endpoint de logout no backend para limpar o cookie httpOnly
      const Api = (await import("@/api")).default;
      await Api.post("/logout").catch(() => {
        // Ignorar erros de logout
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      // Redirecionar para a página de login
      router.replace('/');
    }
  }
  return (
    <header className="flex items-center justify-between bg-[#1C3552] h-[70px] px-[140px] max-md:px-5 relative">
      <Image
        src="/images/logoHeader.png"
        width={1000}
        height={1000}
        alt="Logo do header"
        className="w-[100px]"
      />

      {menuList.length > 0 && (
        <>
          <nav className="hidden md:flex items-center gap-8">
            {menuList.map((item) => (
              item.label === "Sair" ? (
                <button
                  key={item.label}
                  onClick={handleLogout}
                  className="text-white hover:underline"
                >
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.page}
                  className="text-white hover:underline"
                >
                  {item.label}
                </a>
              )
            ))}
          </nav>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </>
      )}
    </header>
  );
}
