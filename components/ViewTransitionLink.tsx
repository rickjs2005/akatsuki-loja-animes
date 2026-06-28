"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Link com transição de elemento compartilhado (View Transitions API).
 * Em navegadores compatíveis (Chromium) e sem prefers-reduced-motion, envolve a
 * navegação soft do App Router em `document.startViewTransition`, fazendo o
 * browser interpolar os elementos que compartilham `view-transition-name`
 * (ex.: a imagem do card → a imagem da página de produto).
 *
 * Progressive enhancement: onde a API não existe (Firefox/Safari antigos) ou o
 * usuário pede menos movimento, cai no comportamento padrão do <Link>.
 */
type Props = React.ComponentProps<typeof Link> & { href: string };

export function ViewTransitionLink({ href, onClick, ...rest }: Props) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      // só intercepta cliques "simples" (sem modificadores / botão esquerdo)
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0
      )
        return;

      const doc = document as Document & {
        startViewTransition?: (cb: () => void | Promise<void>) => unknown;
      };
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!doc.startViewTransition || reduce) return; // <Link> cuida do resto

      e.preventDefault();
      doc.startViewTransition(() => {
        router.push(href);
        // dá um tick para o App Router commitar o novo DOM dentro da transição
        return new Promise<void>((resolve) => setTimeout(resolve, 0));
      });
    },
    [href, onClick, router]
  );

  return <Link href={href} onClick={handleClick} {...rest} />;
}
