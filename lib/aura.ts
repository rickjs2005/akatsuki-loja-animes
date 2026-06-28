import type { Product } from "./products";

/**
 * Aura ("lore") de cada personagem — a cor predominante da energia/chakra/
 * cursed energy quando o poder é liberado. Usada no efeito ao adicionar ao
 * carrinho. Quando o personagem não está no mapa, cai na cor-tema do produto.
 */
const AURAS: Record<string, string> = {
  // ===== Heróis =====
  naruto: "#ff3b1e", // Manto da Kurama (9 caudas) — vermelho-alaranjado
  luffy: "#ff4a3a", // Haki / Gear (vapor) — vermelho
  goku: "#bfe6ff", // Instinto Superior — prateado-azulado
  gojo: "#3aa0ff", // Limitless / "Azul" — azul
  eren: "#ff5a2a", // vapor do Titã de Ataque — laranja-fogo
  light: "#d11f2f", // Kira — carmesim
  gon: "#27c46b", // Nen / Jajanken — verde
  jinwoo: "#8a5cff", // Monarca das Sombras — violeta
  sasuke: "#6a3df0", // Chidori / Susanoo — índigo
  itachi: "#c81a1a", // Susanoo / Sharingan — vermelho
  zoro: "#2ec27e", // Haki / espadas — verde
  vegeta: "#ffd23b", // Super Saiyajin — dourado
  tanjiro: "#29c2e0", // Respiração da Água — azul
  nezuko: "#ff5a8a", // Arte Demoníaca de Sangue — rosa
  levi: "#5fb0a8", // Tropa de Exploração — verde-aço
  erwin: "#e0b84a", // Asas da Liberdade / comando — dourado
  saitama: "#f5c518", // Soco sério — amarelo
  killua: "#7fdfff", // Godspeed / raio — azul elétrico

  // ===== Vilões =====
  madara: "#b23bff", // Susanoo Perfeito — roxo
  pain: "#b06ad0", // Rinnegan — púrpura
  orochimaru: "#9a6ad0", // serpente — roxo
  frieza: "#ffcf3b", // forma dourada — dourado
  aizen: "#9b6cff", // Hogyoku — violeta
  muzan: "#d1206f", // sangue — magenta
  dio: "#ffd23b", // The World — dourado

  // ===== Akatsuki 暁 =====
  konan: "#7fb0ff", // Dança de Papel — azul
  kisame: "#2fbfe0", // Suiton / Samehada — azul-água
  deidara: "#ffb03b", // argila explosiva — laranja-ouro
  sasori: "#d2452f", // Areia Vermelha / marionetes — vermelho
  hidan: "#b23a5e", // ritual de Jashin — carmesim-magenta
  kakuzu: "#2fc4a6", // fios de Doton / corações — verde-água
  zetsu: "#4fbf63", // planta / clones — verde
  obito: "#b23bff", // Kamui / Sharingan — roxo
};

export function auraFor(product: Product): string {
  return AURAS[product.id] ?? product.hue;
}
