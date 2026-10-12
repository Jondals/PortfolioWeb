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
import chatterlyRenewedLogin from "../assets/images/chatterlyrenewed-login.webp";
import chatterlyRenewedCall from "../assets/images/chatterlyrenewed-call.webp";
import chatterlyRenewedTournament from "../assets/images/chatterlyrenewed-tournament.webp";
import chatterlyRenewedWheel from "../assets/images/chatterlyrenewed-wheel.webp";
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
  /** Why I made it (optional). */
  motivation?: Translation;
  /** What it is for: the goal of the project (optional). */
  purpose?: Translation;
  /** Technology names; each one must exist in icons.ts and tech.ts. */
  tech: string[];
  image: ImageMetadata;
  /** More screenshots (optional): the carousel shows them in the same frame, one at a time. */
  gallery?: { image: ImageMetadata; alt: Translation }[];
  github: string;
  /** Live website, if the project is published. */
  demo: string | null;
  /** Other places where the project lives (an extension store, for example). */
  links?: { label: string; url: string; icon: string }[];
}

const COMPLETED: Translation = { en: "COMPLETED", es: "FINALIZADO" };
const IN_DEVELOPMENT: Translation = { en: "IN DEVELOPMENT", es: "EN DESARROLLO" };
/** Live on the web. */
const DEPLOYED: Translation = { en: "DEPLOYED", es: "DESPLEGADO" };
/** Released on a store or marketplace. */
const PUBLISHED: Translation = { en: "PUBLISHED", es: "PUBLICADO" };

export const projects: Project[] = [
  {
    title: "Spinly",
    featured: true,
    status: DEPLOYED,
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
    status: DEPLOYED,
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
    status: DEPLOYED,
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
    title: "Chatterly Renewed",
    featured: true,
    status: IN_DEVELOPMENT,
    description: {
      en: "An end-to-end encrypted chat that I host myself: messages, groups, voice and video calls, wheels and a Windows app. The server only stores ciphertext and cannot read or listen to anything.",
      es: "Un chat cifrado de extremo a extremo que alojo yo mismo: mensajes, grupos, llamadas de voz y vídeo, ruletas y app para Windows. El servidor solo guarda texto cifrado y no puede leer ni escuchar nada.",
    },
    motivation: {
      en: "Understand how private messengers work and have a chat that nobody can read.",
      es: "Entender cómo funcionan los mensajeros privados y tener un chat que nadie pueda leer.",
    },
    purpose: {
      en: "A free, self-hosted, Discord-style app where privacy is part of the design.",
      es: "Una app gratuita, autoalojada y al estilo Discord donde la privacidad es parte del diseño.",
    },
    contribution: {
      en: "Built it all: Angular and Tailwind front end, Fastify and SQLite back end, WebCrypto encryption, WebRTC calls with a TURN relay, an Electron app and Docker deployment with automated tests.",
      es: "Lo desarrollé todo: front en Angular y Tailwind, back en Fastify y SQLite, cifrado con WebCrypto, llamadas WebRTC con relay TURN, app Electron y despliegue con Docker con tests automáticos.",
    },
    learned: {
      en: "Encryption in practice (keys, signatures, group-key rotation), security testing like a hostile account, WebRTC, performance on weak phones and shipping with Docker and Electron.",
      es: "Cifrado en la práctica (claves, firmas, rotación de claves de grupo), probar la seguridad como una cuenta hostil, WebRTC, rendimiento en móviles flojos y publicar con Docker y Electron.",
    },
    tech: ["Angular", "TypeScript", "Tailwind CSS", "Node.js", "Fastify", "SQLite", "WebRTC", "Electron", "Docker", "GitHub Actions"],
    image: chatterlyRenewed,
    gallery: [
      {
        image: chatterlyRenewedLogin,
        alt: { en: "The sign-in screen of Chatterly Renewed", es: "La pantalla de entrada de Chatterly Renewed" },
      },
      {
        image: chatterlyRenewedCall,
        alt: { en: "An end-to-end encrypted voice call", es: "Una llamada de voz cifrada de extremo a extremo" },
      },
      {
        image: chatterlyRenewedWheel,
        alt: { en: "A prize wheel and a tournament champion in a chat", es: "Una ruleta y el campeón de un torneo en un chat" },
      },
      {
        image: chatterlyRenewedTournament,
        alt: { en: "A knockout tournament played with wheels", es: "Un torneo por eliminatorias jugado con ruletas" },
      },
    ],
    github: "https://github.com/Jondals/ChatterlyRenewed",
    demo: "https://chatterlyrenewed.duckdns.org",
  },

  {
    title: "DevStarter",
    featured: false,
    status: PUBLISHED,
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
    links: [
      { label: "Marketplace", url: "https://marketplace.visualstudio.com/items?itemName=Jondals.devstarter", icon: "VS Code" },
      { label: "Open VSX", url: "https://open-vsx.org/extension/Jondals/devstarter", icon: "external" },
    ],
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
    title: "Chatterly",
    featured: false,
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
