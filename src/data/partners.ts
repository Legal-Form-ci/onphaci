export interface Partner {
  name: string;
  type: "Financier" | "Technique" | "Institutionnel";
  country?: string;
  logo?: string;
  url?: string;
}

import mffeLogo from "@/assets/partner-mffe.png.asset.json";
import afdLogo from "@/assets/partner-afd.png.asset.json";
import ambassadeLogo from "@/assets/partner-ambassade-france.png.asset.json";

export const PARTNERS: Partner[] = [
  { name: "Ministère de la Famille, de la Femme et de l'Enfant (MFFE)", type: "Institutionnel", country: "Côte d'Ivoire", logo: mffeLogo.url },
  { name: "AFD — Agence Française de Développement", type: "Financier", country: "France", logo: afdLogo.url, url: "https://www.afd.fr" },
  { name: "Ambassade de France en Côte d'Ivoire", type: "Financier", country: "France / CI", logo: ambassadeLogo.url, url: "https://ci.ambafrance.org" },
  { name: "Fondation Orange Côte d'Ivoire", type: "Financier", country: "Côte d'Ivoire" },
  { name: "MTN via AIPA", type: "Financier", country: "Côte d'Ivoire" },
  { name: "VYV3 Pays de la Loire", type: "Technique", country: "France" },
  { name: "Mutualistes Sans Frontières Solidarité", type: "Technique", country: "France" },
  { name: "RIP-EPT", type: "Technique", country: "Côte d'Ivoire" },
  { name: "SNEP", type: "Institutionnel", country: "Côte d'Ivoire", logo: "https://onphaci.org/wp-content/uploads/2022/12/snep-390x205.jpeg" },
  { name: "UNOPAH-CI", type: "Institutionnel", country: "Côte d'Ivoire" },
  { name: "FAMACI", type: "Institutionnel", country: "Côte d'Ivoire" },
  { name: "FAHCI", type: "Institutionnel", country: "Côte d'Ivoire" },
  { name: "COPHCI", type: "Institutionnel", country: "Côte d'Ivoire" },
  { name: "FASOCI", type: "Institutionnel", country: "Côte d'Ivoire" },
  { name: "ANASOCI", type: "Institutionnel", country: "Côte d'Ivoire" },
  { name: "OILSCI", type: "Institutionnel", country: "Côte d'Ivoire" },
];