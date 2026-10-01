/**
 * games.ts
 * Data for the game development section (Unity prototypes).
 * Same shape as a project, but games have no live site and are never "featured".
 */
import type { Project } from "./projects.ts";

import parkourBeans from "../assets/images/parkourbeans.webp";
import nextbotScapeBeans from "../assets/images/nextbotscapebeans.webp";

export const games: Omit<Project, "featured" | "demo">[] = [
  {
    title: "Parkour Beans",
    status: { en: "Prototype", es: "Prototipo" },
    description: {
      en: "A first-person parkour prototype focused on fast movement and fluid traversal across platforming levels.",
      es: "Un prototipo de parkour en primera persona centrado en el movimiento rápido y el desplazamiento fluido por niveles de plataformas.",
    },
    contribution: {
      en: "Designed a modular player controller with wall-running, sliding, jumping, air control, a grappling hook and moving or bouncing platforms.",
      es: "Diseñé un controlador de jugador modular con wall-running, deslizamiento, salto, control aéreo, gancho y plataformas móviles o de salto.",
    },
    learned: {
      en: "Game feel, physics-based character movement and structuring gameplay code into small reusable components.",
      es: "Game feel, movimiento de personaje basado en físicas y cómo estructurar el código de gameplay en componentes pequeños y reutilizables.",
    },
    tech: ["Unity", "C#"],
    image: parkourBeans,
    github: "https://github.com/Jondals/Parkour-Bean",
  },

  {
    title: "NextbotScape Beans",
    status: { en: "Prototype", es: "Prototipo" },
    description: {
      en: "A Backrooms-style multiplayer horror game built around cooperative exploration and real-time interaction.",
      es: "Un juego de terror multijugador estilo Backrooms basado en la exploración cooperativa y la interacción en tiempo real.",
    },
    contribution: {
      en: "Built the multiplayer architecture with Netcode for GameObjects: lobbies with join codes, player and animation sync, flashlights and interactive doors, plus basic AI with pathfinding.",
      es: "Desarrollé la arquitectura multijugador con Netcode for GameObjects: lobbies con códigos de acceso, sincronización de jugadores y animaciones, linternas y puertas interactivas, además de IA básica con pathfinding.",
    },
    learned: {
      en: "Client-server synchronization, authority and latency in multiplayer games, and navigation meshes for AI.",
      es: "Sincronización cliente-servidor, autoridad y latencia en juegos multijugador, y mallas de navegación para la IA.",
    },
    tech: ["Unity", "C#", "Netcode for GameObjects"],
    image: nextbotScapeBeans,
    github: "https://github.com/Jondals/NextBotEscapeBeans",
  },
];
