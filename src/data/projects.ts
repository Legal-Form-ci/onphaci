export interface Project {
  slug: string;
  title: string;
  status: "En cours" | "Terminé";
  partner: string;
  years: string;
  countries: string[];
  short: string;
  description: string;
  cover?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "defisens-ao",
    title: "DéfiSens'AO",
    status: "Terminé",
    partner: "AFD (Agence Française de Développement)",
    years: "2022 – 2024",
    countries: ["Côte d'Ivoire","Bénin","Burkina Faso","Mali","Niger","Sénégal","Togo"],
    short: "Accès des personnes déficientes sensorielles aux services de prévention, de détection et d'accompagnement dans 7 pays d'Afrique de l'Ouest.",
    description: "Projet phare porté en consortium sur 7 pays d'Afrique de l'Ouest, financé par l'Agence Française de Développement. DéfiSens'AO renforce l'accès aux soins, à la détection précoce des déficiences sensorielles et à l'accompagnement des familles, en partenariat avec VYV3 Pays de la Loire et Mutualistes Sans Frontières Solidarité.",
  },
  {
    slug: "handicap-vie-solidarite",
    title: "Handicap-Vie-Solidarité",
    status: "En cours",
    partner: "Ambassade de France en Côte d'Ivoire",
    years: "Octobre 2024 – en cours",
    countries: ["Côte d'Ivoire"],
    short: "Promotion du droit à la santé des personnes en situation de handicap auditif et de leurs familles.",
    description: "Le projet Handicap-Vie-Solidarité agit pour que les personnes sourdes et malentendantes accèdent à des services de santé adaptés, à l'information préventive (VIH, santé sexuelle) et à un accompagnement digne dans les structures de soins.",
  },
  {
    slug: "sport-inclusion-scolaire",
    title: "Sport & Inclusion scolaire",
    status: "En cours",
    partner: "Ambassade de France en Côte d'Ivoire",
    years: "2024",
    countries: ["Côte d'Ivoire"],
    short: "Le sport comme levier d'inclusion des enfants déficients auditifs en milieu scolaire.",
    description: "Activités sportives mixtes entre élèves entendants et malentendants, formation des enseignants à la langue des signes, équipement des établissements partenaires.",
  },
  {
    slug: "vih-handicap-auditif",
    title: "Prévention VIH – personnes sourdes",
    status: "Terminé",
    partner: "Consortium santé inclusive",
    years: "2022 – 2023",
    countries: ["Côte d'Ivoire"],
    short: "Information, dépistage et accompagnement des personnes handicapées auditives sur la prévention du VIH.",
    description: "Programme d'information et de dépistage adapté en langue des signes, formation des pairs éducateurs sourds, distribution de supports visuels.",
  },
  {
    slug: "education-inclusive",
    title: "Forum Éducation Inclusive",
    status: "En cours",
    partner: "RIP-EPT, MENA",
    years: "Annuel",
    countries: ["Côte d'Ivoire"],
    short: "Plaidoyer national pour la scolarisation des enfants handicapés auditifs.",
    description: "Organisation de forums réunissant ministères, ONG, parents et enseignants autour des innovations pédagogiques pour l'éducation inclusive en Côte d'Ivoire.",
  },
];