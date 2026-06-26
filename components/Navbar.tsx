"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { CartButton } from "./CartButton";

const links = [
  { label: "Início", href: "#mundo" },
  { label: "Coleção", href: "#coleção" },
  { label: "Domínio", href: "#domínio" },
  { label: "Contato", href: "#ritual" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className={`fixed inset-x-0 top-8 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${
          scrolled ? "glass mx-4 md:mx-auto" : "bg-transparent"
        }`}
      >
        <motion.a
          href="#top"
          className="font-display text-xl font-bold tracking-[0.3em] text-glow"
          whileHover={{ letterSpacing: "0.42em" }}
          transition={{ duration: 0.4 }}
        >
          暁
          <span className="ml-2 align-middle text-sm tracking-[0.4em] opacity-80">
            AKATSUKI
          </span>
        </motion.a>

        <ul className="hidden items-center gap-9 text-xs font-medium uppercase tracking-[0.18em] md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="nav-link opacity-80 hover:opacity-100">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <CartButton />
        </div>
      </nav>
    </motion.header>
  );
}
