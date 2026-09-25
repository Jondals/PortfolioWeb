import type { Project } from "./projects.ts";

import parkourBeans from "../assets/images/parkourbeans.webp";
import nextbotScapeBeans from "../assets/images/nextbotscapebeans.webp";

export const games: Omit<Project, "featured" | "demo">[] = [
  {
    title: "Parkour Beans",
    status: {
      en: "Prototype",
      es: "Prototipo",
    },
    description: {
      en: "First-person parkour prototype focused on fast movement and fluid traversal in platforming environments.",
      es: "Prototipo de parkour en primera persona centrado en movimiento rápido y desplazamiento fluido en entornos de plataformas.",
    },
    contribution: {
      en: "Designed and implemented a modular player controller featuring wall-running, sliding, jumping, air control, swinging hook mechanic, and moving/jump platforms.",
      es: "Diseñé e implementé un controlador de jugador modular con wall-running, deslizamiento, salto, control aéreo, gancho y plataformas móviles/de salto.",
    },
    tech: ["Unity", "C#"],
    image: parkourBeans,
    github: "https://github.com/Jondals/Parkour-Bean",
  },

  {
    title: "NextbotScape Beans",
    status: {
      en: "Prototype",
      es: "Prototipo",
    },
    description: {
      en: "Multiplayer Backrooms-style horror experience built around cooperative exploration and real-time interaction.",
      es: "Experiencia de terror multijugador estilo Backrooms basada en exploración cooperativa e interacción en tiempo real.",
    },
    contribution: {
      en: "Developed multiplayer architecture using Netcode for GameObjects, including lobby system with join codes, player synchronization, animated character syncing, flashlight mechanics, and interactive doors. Also explored basic AI behavior using navigation and pathfinding systems.",
      es: "Desarrollé la arquitectura multijugador usando Netcode for GameObjects, incluyendo sistema de lobby con códigos de acceso, sincronización de jugadores, animaciones, mecánica de linterna y puertas interactivas. También exploré IA básica con navegación y pathfinding.",
    },
    tech: ["Unity", "C#", "Netcode for GameObjects"],
    image: nextbotScapeBeans,
    github: "https://github.com/Jondals/NextBotEscapeBeans",
  },
];
