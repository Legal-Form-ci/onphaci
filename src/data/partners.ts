export interface Partner {
  name: string;
  type: "Financier" | "Technique" | "Institutionnel";
  country?: string;
}

export const PARTNERS: Partner[] = [
  { name: "AFD — Agence Française de Développement", type: "Financier", country: "France" },
  { name: "Ambassade de France en Côte d'Ivoire", type: "Financier", country: "France / CI" },
  { name: "Fondation Orange Côte d'Ivoire", type: "Financier", country: "Côte d'Ivoire" },
  { name: "MTN via AIPA", type: "Financier", country: "Côte d'Ivoire" },
  { name: "VYV3 Pays de la Loire", type: "Technique", country: "France" },
  { name: "Mutualistes Sans Frontières Solidarité", type: "Technique", country: "France" },
  { name: "RIP-EPT", type: "Technique", country: "Côte d'Ivoire" },
  { name: "UNOPAH-CI", type: "Institutionnel", country: "Côte d'Ivoire" },
  { name: "FAMACI", type: "Institutionnel", country: "Côte d'Ivoire" },
  { name: "FAHCI", type: "Institutionnel", country: "Côte d'Ivoire" },
  { name: "COPHCI", type: "Institutionnel", country: "Côte d'Ivoire" },
  { name: "FASOCI", type: "Institutionnel", country: "Côte d'Ivoire" },
  { name: "ANASOCI", type: "Institutionnel", country: "Côte d'Ivoire" },
  { name: "OILSCI", type: "Institutionnel", country: "Côte d'Ivoire" },
];