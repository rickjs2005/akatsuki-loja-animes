// Loja de animes — contato WhatsApp
export const WHATSAPP_NUMBER = "5533998779375"; // 33 99877-9375
export const WHATSAPP_DISPLAY = "(33) 99877-9375";

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buyMessage(name: string, anime: string, price: string) {
  return `Olá! Tenho interesse neste produto da loja AKATSUKI:\n\n• ${name} (${anime})\n• Valor: ${price}\n\nAinda está disponível? 🔥`;
}

export function orderMessage(
  lines: { name: string; anime: string; qty: number; price: string }[],
  total: string
) {
  const body = lines
    .map((l) => `• ${l.qty}x ${l.name} (${l.anime}) — ${l.price}`)
    .join("\n");
  return `Olá! Quero finalizar meu pedido na loja AKATSUKI 🔥\n\n${body}\n\n*Total: ${total}*\n\nPode confirmar disponibilidade e o frete? 🙏`;
}
