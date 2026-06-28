/**
 * Conjunto de ícones SVG de traço (line icons, estilo Lucide) da loja AKATSUKI.
 *
 * Objetivo: substituir emojis na UI por ícones vetoriais coesos, escaláveis e
 * acessíveis. Todos herdam a cor via `currentColor` (exceto o WhatsApp, que é
 * preenchido). São componentes puros, sem estado — podem rodar no server ou client.
 *
 * Uso: <CartIcon size={24} className="text-red-600" />
 * Para leitores de tela, passe `title`: <ShieldIcon title="Compra segura" />
 */

import type { FC } from "react";

/** Props comuns a todos os ícones. */
export interface IconProps {
  /** Classes utilitárias (ex.: cor, margens). */
  className?: string;
  /** Tamanho (largura e altura) em pixels. Padrão 20. */
  size?: number;
  /** Rótulo acessível. Se presente, o ícone vira `role="img"` (sem aria-hidden). */
  title?: string;
}

/** Ícone com prop extra para alternar preenchimento (ex.: estrela cheia/vazia). */
export interface FillableIconProps extends IconProps {
  /** Quando `true`, o ícone é preenchido com a cor atual. */
  filled?: boolean;
}

/** WhatsApp — logo PREENCHIDO (única exceção: usa fill em vez de stroke). */
export const WhatsAppIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.748-.985zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

/** Carrinho de compras. */
export const CartIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

/** Caminhão de entrega (frete). */
export const ShippingIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path d="M1 4h13v11H1z" />
    <path d="M14 8h4l3 3v4h-7z" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="17.5" cy="18" r="2" />
  </svg>
);

/** Escudo com check (compra segura). */
export const ShieldIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

/** Cartão de crédito (parcelamento). */
export const CardIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
    <path d="M6 15h4" />
  </svg>
);

/** Balão de conversa (atendimento). */
export const ChatIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path d="M21 11.5a8.38 8.38 0 0 1-9 8.3 9 9 0 0 1-4-.9L3 21l1.1-4a8.38 8.38 0 0 1-.9-4 8.5 8.5 0 0 1 9-8.3 8.38 8.38 0 0 1 8.8 7.8z" />
    <path d="M8 11h.01M12 11h.01M16 11h.01" />
  </svg>
);

/** Caveira (marcação de vilão). */
export const SkullIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path d="M12 2a8 8 0 0 0-8 8c0 2.6 1.2 4.4 3 5.6V19a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3.4c1.8-1.2 3-3 3-5.6a8 8 0 0 0-8-8z" />
    <circle cx="9" cy="10" r="1.4" />
    <circle cx="15" cy="10" r="1.4" />
    <path d="M10 20v-2M14 20v-2M12 14v2" />
  </svg>
);

/** Check (confirmação). Traço um pouco mais grosso para destaque. */
export const CheckIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/** Estrela. Use `filled` para alternar entre cheia e vazia. */
export const StarIcon: FC<FillableIconProps> = ({
  className,
  size = 20,
  title,
  filled = false,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path d="M12 2.5l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.9l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95z" />
  </svg>
);

/** Brilho / sparkle (colecionável premium). */
export const SparkleIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path d="M12 3c.5 3.5 1.5 4.5 5 5-3.5.5-4.5 1.5-5 5-.5-3.5-1.5-4.5-5-5 3.5-.5 4.5-1.5 5-5z" />
    <path d="M19 14c.25 1.5.5 1.75 2 2-1.5.25-1.75.5-2 2-.25-1.5-.5-1.75-2-2 1.5-.25 1.75-.5 2-2z" />
    <path d="M5 13c.2 1.2.4 1.4 1.6 1.6C5.4 14.8 5.2 15 5 16.2 4.8 15 4.6 14.8 3.4 14.6 4.6 14.4 4.8 14.2 5 13z" />
  </svg>
);

/** Fechar (X). */
export const CloseIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

/** Chama (promoções, substitui 🔥). */
export const FlameIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path d="M12 2c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1 .3-1.8 1-2.5C8 9 7 11 7 13a5 5 0 0 0 10 0c0-4-3-6.5-5-11z" />
  </svg>
);

/** Caixa / pacote (substitui 📦). */
export const BoxIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
    <path d="M3 8l9 5 9-5" />
    <path d="M12 13v8" />
    <path d="M7.5 5.5 16.5 10.5" />
  </svg>
);

/** Engrenagem (configurações). */
export const GearIcon: FC<IconProps> = ({ className, size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    className={className}
  >
    {title ? <title>{title}</title> : null}
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
