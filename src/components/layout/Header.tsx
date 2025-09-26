"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

type MenuItem = { label: string; page: string };

const menuItems: MenuItem[] = [
  { label: "Home", page: "/dashboard" },
  { label: "Cadastrar clientes", page: "/dashboard" },
  { label: "Meus clientes", page: "/dashboard" },
  { label: "Cadastrar", page: "/auth/signup" },
  { label: "Login", page: "/auth/login" },
  { label: "Sair", page: "/auth/login" },
];

export default function Header() {
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    console.log("🚀 ~ Header ~ pathname:", pathname);

    let filteredMenu: MenuItem[] = [];

    if (pathname === "/auth/login" || pathname === "/") {
      filteredMenu = menuItems.filter((item) => item.label === "Cadastrar");
    } else if (pathname === "/auth/signup") {
      filteredMenu = menuItems.filter((item) => item.label === "Login");
    } else if (pathname.startsWith("/dashboard")) {
      filteredMenu = menuItems.filter(
        (item) =>
          item.label === "Home" ||
          item.label === "Cadastrar clientes" ||
          item.label === "Meus clientes"
      );
    } else {
      filteredMenu = menuItems.filter(
        (item) => item.label != "Login" && item.label != "Cadastrar"
      );
    }

    setMenuList(filteredMenu);
  }, [pathname]);

  return (
    <header className="flex items-center justify-between bg-[#1C3552] h-[70px] px-[140px] max-md:px-[20px] relative">
      {/* Logo */}
      <Image
        src="/images/logoHeader.png"
        width={1000}
        height={1000}
        alt="Logo do header"
        className="w-[100px]"
      />

      {mounted && menuList.length > 0 && (
        <>
          <nav className="hidden md:flex items-center gap-8">
            {menuList.map((item) => (
              <a
                key={item.label}
                href={item.page}
                className="text-white hover:underline"
              >
                {item.label}
              </a>
            ))}

            {pathname && pathname.startsWith("/dashboard") && (
              <button className="text-white">Sair</button>
            )}
          </nav>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {isOpen && (
            <div className="absolute top-[70px] left-0 w-full bg-[#1C3552] flex flex-col items-center gap-4 py-6 md:hidden z-50 shadow-lg">
              {menuList.map((item) => (
                <a
                  key={item.label}
                  href={item.page}
                  className="text-white text-lg hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              {pathname && pathname.startsWith("/dashboard") && (
                <button
                  className="text-white text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Sair
                </button>
              )}
            </div>
          )}
        </>
      )}
    </header>
  );
}
