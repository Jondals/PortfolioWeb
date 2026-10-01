/**
 * projects.ts
 * Data for every project shown in the portfolio (carousel + "More projects").
 * Add an entry here (and its screenshot in src/assets/images) to publish a new project.
 * Every text is bilingual: { en, es }.
 */
import type { ImageMetadata } from "astro";

import chatterly from "../assets/images/chatterly.webp";
import spinly from "../assets/images/spinly.webp";
import damasDondeSea from "../assets/images/damasdondesea.webp";
import quizMania from "../assets/images/quizmania.webp";
import flavorBalance from "../assets/images/flavorbalance.webp";
import devStarter from "../assets/images/devstarter.webp";
import myMusic from "../assets/images/mymusic.webp";
import myConversor from "../assets/images/myconversor.webp";
import chatterlyRenewed from "../assets/images/chatterlyrenewed.webp";
import kairos from "../assets/images/kairos.webp";

/** A text available in both languages. */
export interface Translation {
  en: string;
  es: string;
}

export interface Project {
  title: string;
  /** Featured projects go to the carousel; the rest go to "More projects". */
  featured: boolean;
  status: Translation;
  description: Translation;
  /** What I built / my part of the project. */
  contribution: Translation;
  /** What I learned building it. */
  learned: Translation;
  /** Technology names; each one must exist in icons.ts and tech.ts. */
  tech: string[];
  image: ImageMetadata;
  github: string;
  /** Live website, if the project is published. */
  demo: string | null;
}

const COMPLETED: Translation = { en: "COMPLETED", es: "ACABADO" };
const IN_DEVELOPMENT: Translation = { en: "IN DEVELOPMENT", es: "EN DESARROLLO" };

export const projects: Project[] = [
  {
    title: "Spinly",
    featured: true,
    status: COMPLETED,
    description: {
      en: "A prize wheel for giveaways, raffles and everyday decisions: custom themes and presets, your own music, knockout tournaments and accounts that sync across devices.",
      es: "Una ruleta para sorteos y decisiones del día a día: temas y presets propios, tu música, torneos por eliminatorias y cuentas que se sincronizan entre dispositivos.",
    },
    contribution: {
      en: "Designed and built the whole app: a pure-CSS wheel, Web Audio sound effects, beat-synced lights and a Supabase backend with anonymous accounts and Row Level Security.",
      es: "Diseñé y desarrollé toda la app: ruleta solo con CSS, efectos de sonido con Web Audio, luces sincronizadas con el ritmo y backend en Supabase con cuentas anónimas y Row Level Security.",
    },
    learned: {
      en: "Audio synthesis and analysis in the browser, Web Workers, and syncing local-first data with Supabase.",
      es: "Síntesis y análisis de audio en el navegador, Web Workers y sincronización de datos local-first con Supabase.",
    },
    tech: ["React", "TypeScript", "Supabase", "PostgreSQL", "Vercel"],
    image: spinly,
    github: "https://github.com/Jondals/Spinly",
    demo: "https://spinly-psi.vercel.app/",
  },

  {
    title: "QuizMania",
    featured: true,
    status: COMPLETED,
    description: {
      en: "A trivia game played on a slot machine: spin for a topic, pick one of five modes, challenge friends in Versus duels and climb the leagues and rankings.",
      es: "Un juego de trivia con tragaperras: gira para elegir tema, escoge entre cinco modos, reta a tus amigos en duelos Versus y sube en las ligas y rankings.",
    },
    contribution: {
      en: "Built the game in TypeScript with a custom build script, synthesized sounds, 30 topics and a Supabase backend: accounts, friends, rankings and server-side score validation.",
      es: "Desarrollé el juego en TypeScript con un script de build propio, sonidos sintetizados, 30 temas y un backend en Supabase: cuentas, amigos, rankings y validación de puntuaciones en el servidor.",
    },
    learned: {
      en: "PostgreSQL functions and Row Level Security, designing a fair scoring system and shipping a typed codebase without a framework.",
      es: "Funciones de PostgreSQL y Row Level Security, diseñar un sistema de puntos justo y mantener una base de código tipada sin framework.",
    },
    tech: ["TypeScript", "Supabase", "PostgreSQL", "HTML", "CSS", "Vercel"],
    image: quizMania,
    github: "https://github.com/Jondals/QuizMania",
    demo: "https://quiz-mania-blond.vercel.app/",
  },

  {
    title: "MyConversor",
    featured: true,
    status: COMPLETED,
    description: {
      en: "A single-page tool to download, trim and convert video and audio from YouTube, TikTok, Twitch and more, with a library, accounts and a built-in music player.",
      es: "Una herramienta de una sola página para descargar, recortar y convertir vídeo y audio de YouTube, TikTok, Twitch y más, con biblioteca, cuentas y reproductor de música.",
    },
    contribution: {
      en: "Built the Angular front end with Tailwind and a Node.js + Express server that drives yt-dlp and FFmpeg, then deployed it with Docker on Oracle Cloud.",
      es: "Desarrollé el front en Angular con Tailwind y un servidor Node.js + Express que maneja yt-dlp y FFmpeg, y lo desplegué con Docker en Oracle Cloud.",
    },
    learned: {
      en: "Server-side rendering with Angular, running and streaming child processes safely, Docker deployments and scoring 100 on Lighthouse.",
      es: "Renderizado en servidor con Angular, ejecutar y transmitir procesos hijo de forma segura, despliegues con Docker y conseguir 100 en Lighthouse.",
    },
    tech: ["Angular", "TypeScript", "Tailwind CSS", "Node.js", "Express", "FFmpeg", "yt-dlp", "Docker"],
    image: myConversor,
    github: "https://github.com/Jondals/MyConversor",
    demo: "https://myconversor.duckdns.org",
  },

  {
    title: "Chatterly",
    featured: true,
    status: COMPLETED,
    description: {
      en: "A web social platform inspired by Discord: add friends, customize your profile and talk through real-time chat and voice calls, sharing files and GIFs right in the conversation.",
      es: "Una red social web inspirada en Discord: añade amigos, personaliza tu perfil y habla por chat y llamadas de voz en tiempo real, compartiendo archivos y GIFs en la conversación.",
    },
    contribution: {
      en: "Developed the real-time messaging, the authentication flow and the voice calls on WebRTC, with a PHP and MySQL backend.",
      es: "Desarrollé la mensajería en tiempo real, la autenticación y las llamadas de voz con WebRTC, con un backend en PHP y MySQL.",
    },
    learned: {
      en: "How WebRTC connections are negotiated, relational database design and how a back end and a front end talk to each other.",
      es: "Cómo se negocian las conexiones WebRTC, diseño de bases de datos relacionales y cómo se comunican un back end y un front end.",
    },
    tech: ["JavaScript", "PHP", "MySQL", "jQuery", "WebRTC", "HTML", "CSS"],
    image: chatterly,
    github: "https://github.com/Jondals/Chatterly",
    demo: null,
  },

  {
    title: "Kairos",
    featured: false,
    status: IN_DEVELOPMENT,
    description: {
      en: "A personal operating system in one local-first app: tasks, finances, training, calendar and notes, with end-to-end encryption and optional bank and calendar sync.",
      es: "Un sistema operativo personal en una sola app local-first: tareas, finanzas, entrenamiento, calendario y notas, con cifrado de extremo a extremo y sincronización opcional con banco y calendarios.",
    },
    contribution: {
      en: "Building a configurable dashboard, a PWA that works offline, AES-256-GCM encryption and a Cloudflare Worker for bank (PSD2) and CalDAV integrations.",
      es: "Desarrollo un dashboard configurable, una PWA que funciona offline, cifrado AES-256-GCM y un Cloudflare Worker para las integraciones con banco (PSD2) y CalDAV.",
    },
    learned: {
      en: "Local-first architecture with IndexedDB, browser cryptography and testing complex parsers.",
      es: "Arquitectura local-first con IndexedDB, criptografía en el navegador y testeo de parsers complejos.",
    },
    tech: ["React", "Vite", "Tailwind CSS", "JavaScript", "Cloudflare"],
    image: kairos,
    github: "https://github.com/Jondals/Kairos",
    demo: null,
  },

  {
    title: "Chatterly Renewed",
    featured: false,
    status: IN_DEVELOPMENT,
    description: {
      en: "A modern rewrite of Chatterly with an Angular front end and a real-time Fastify and WebSocket back end.",
      es: "Reescritura moderna de Chatterly con un front en Angular y un back end en tiempo real con Fastify y WebSocket.",
    },
    contribution: {
      en: "Redesigning the architecture: Angular with Tailwind, a Fastify API with JWT authentication and an SQLite database.",
      es: "Rediseño la arquitectura: Angular con Tailwind, una API con Fastify y autenticación JWT, y una base de datos SQLite.",
    },
    learned: {
      en: "Token-based authentication and keeping a real-time connection in sync with the UI.",
      es: "Autenticación con tokens y cómo mantener una conexión en tiempo real sincronizada con la interfaz.",
    },
    tech: ["Angular", "TypeScript", "Tailwind CSS", "Node.js", "Fastify", "SQLite"],
    image: chatterlyRenewed,
    github: "https://github.com/Jondals/ChatterlyRenewed",
    demo: null,
  },

  {
    title: "DevStarter",
    featured: false,
    status: IN_DEVELOPMENT,
    description: {
      en: "A VS Code extension that sets up popular frameworks and project templates in a few clicks.",
      es: "Una extensión de VS Code que configura frameworks y plantillas de proyecto populares en unos pocos clics.",
    },
    contribution: {
      en: "Building the extension architecture and the framework installation flow in TypeScript, bundled with esbuild.",
      es: "Desarrollo la arquitectura de la extensión y el flujo de instalación de frameworks en TypeScript, empaquetado con esbuild.",
    },
    learned: {
      en: "The VS Code extension API and building command-line style interactive flows.",
      es: "La API de extensiones de VS Code y cómo crear flujos interactivos al estilo de la línea de comandos.",
    },
    tech: ["TypeScript", "VS Code API"],
    image: devStarter,
    github: "https://github.com/Jondals/DevStarter",
    demo: null,
  },

  {
    title: "MyMusic",
    featured: false,
    status: IN_DEVELOPMENT,
    description: {
      en: "A cross-platform Flutter app that migrates Spotify playlists and lets you manage your own music collections.",
      es: "Una app Flutter multiplataforma que migra playlists de Spotify y permite gestionar tus propias colecciones musicales.",
    },
    contribution: {
      en: "Developing the playlist migration system and the music management features.",
      es: "Desarrollo el sistema de migración de playlists y la gestión musical.",
    },
    learned: {
      en: "Cross-platform development with Flutter and working with third-party music APIs.",
      es: "Desarrollo multiplataforma con Flutter y trabajo con APIs de música de terceros.",
    },
    tech: ["Flutter", "Dart"],
    image: myMusic,
    github: "https://github.com/Jondals/MyMusic",
    demo: null,
  },

  {
    title: "Damas Donde Sea",
    featured: false,
    status: COMPLETED,
    description: {
      en: "A classic checkers game in Java with a JavaFX interface, turn system and full board interaction.",
      es: "Un juego de damas clásico en Java con interfaz JavaFX, sistema de turnos e interacción completa con el tablero.",
    },
    contribution: {
      en: "Implemented the game rules, piece movement and win conditions.",
      es: "Implementé las reglas del juego, el movimiento de las piezas y las condiciones de victoria.",
    },
    learned: {
      en: "Object-oriented design and building desktop interfaces with JavaFX.",
      es: "Diseño orientado a objetos y creación de interfaces de escritorio con JavaFX.",
    },
    tech: ["Java"],
    image: damasDondeSea,
    github: "https://github.com/Jondals/DamasDondeSea",
    demo: null,
  },

  {
    title: "FlavorBalance",
    featured: false,
    status: COMPLETED,
    description: {
      en: "An Android app to manage recipes, with full create, edit and delete and a local database.",
      es: "Una app Android para gestionar recetas, con crear, editar y borrar, y base de datos local.",
    },
    contribution: {
      en: "Built the recipe management system on top of a Room (SQLite) database.",
      es: "Desarrollé el sistema de gestión de recetas sobre una base de datos Room (SQLite).",
    },
    learned: {
      en: "Android app architecture and local persistence with Room.",
      es: "Arquitectura de apps Android y persistencia local con Room.",
    },
    tech: ["Kotlin", "Android Studio", "SQLite"],
    image: flavorBalance,
    github: "https://github.com/Jondals/FlavorBalance",
    demo: null,
  },
];
