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

export interface Translation {
  en: string;
  es: string;
}

export interface Project {
  title: string;
  featured: boolean;
  status: Translation;
  description: Translation;
  contribution: Translation;
  tech: string[];
  image: ImageMetadata;
  github: string;
  demo: string | null;
}

export const projects: Project[] = [
  {
    title: "Chatterly",
    featured: true,
    status: { en: "COMPLETED", es: "ACABADO" },
    description: {
      en: "Web-based social platform inspired by Discord where users can add friends, customize profiles, and communicate via real-time chat and voice calls. Supports file and GIF sharing rendered directly in chat.",
      es: "Red social web inspirada en Discord donde los usuarios pueden añadir amigos, personalizar su perfil y comunicarse mediante chat y llamadas en tiempo real. Permite enviar archivos y GIFs renderizados en el chat.",
    },
    contribution: {
      en: "Developed real-time messaging system, authentication flow, and WebRTC-based voice calls.",
      es: "Desarrollé el sistema de mensajería en tiempo real, autenticación y llamadas de voz basadas en WebRTC.",
    },
    tech: ["JavaScript", "PHP", "MySQL", "jQuery", "WebRTC", "HTML", "CSS"],
    image: chatterly,
    github: "https://github.com/Jondals/Chatterly",
    demo: null,
  },

  {
    title: "Spinly",
    featured: true,
    status: { en: "COMPLETED", es: "ACABADO" },
    description: {
      en: "A fully customizable spinning wheel app with themes, presets, and a community to share them, backed by Supabase.",
      es: "Una ruleta de la fortuna totalmente personalizable con temas, presets y una comunidad para compartirlos, con Supabase de backend.",
    },
    contribution: {
      en: "Built the wheel logic, a responsive UI, a theme/preset system, and a Supabase-backed community with anonymous auth and Row Level Security.",
      es: "Desarrollé la lógica de la ruleta, una UI responsive, un sistema de temas/presets y una comunidad con Supabase, con autenticación anónima y Row Level Security.",
    },
    tech: ["React", "TypeScript", "CSS", "Supabase"],
    image: spinly,
    github: "https://github.com/Jondals/Spinly",
    demo: "https://spinly-psi.vercel.app/",
  },

  {
    title: "QuizMania",
    featured: true,
    status: { en: "COMPLETED", es: "ACABADO" },
    description: {
      en: "Interactive trivia game with a spinning wheel that selects question categories, creating a gamified learning experience.",
      es: "Juego de trivia interactivo con una ruleta que selecciona categorías de preguntas, creando una experiencia gamificada.",
    },
    contribution: {
      en: "Built game logic, spinning wheel system, and dynamic question loading using AJAX.",
      es: "Desarrollé la lógica del juego, la ruleta giratoria y la carga dinámica de preguntas mediante AJAX.",
    },
    tech: ["HTML", "CSS", "JavaScript", "AJAX", "Bootstrap"],
    image: quizMania,
    github: "https://github.com/Jondals/QuizMania",
    demo: "https://quiz-mania-plum.vercel.app/",
  },

  {
    title: "Damas Donde Sea",
    featured: true,
    status: { en: "COMPLETED", es: "ACABADO" },
    description: {
      en: "Classic checkers game developed in Java with a focus on game logic, turn system, and board interaction.",
      es: "Juego de damas clásico desarrollado en Java, centrado en la lógica del juego, sistema de turnos e interacción con el tablero.",
    },
    contribution: {
      en: "Implemented game rules, movement system, and win condition logic.",
      es: "Implementé las reglas del juego, sistema de movimientos y condiciones de victoria.",
    },
    tech: ["Java"],
    image: damasDondeSea,
    github: "https://github.com/Jondals/DamasDondeSea",
    demo: null,
  },

  {
    title: "FlavorBalance",
    featured: false,
    status: { en: "COMPLETED", es: "ACABADO" },
    description: {
      en: "Android mobile application for managing recipes with full CRUD functionality and database integration.",
      es: "Aplicación móvil Android para gestionar recetas con funcionalidades CRUD completas e integración de base de datos.",
    },
    contribution: {
      en: "Developed recipe management system (create, edit, delete) and learned Android database architecture.",
      es: "Desarrollé el sistema de gestión de recetas (crear, editar, eliminar) y aprendí arquitectura de bases de datos en Android.",
    },
    tech: ["Kotlin", "Android Studio"],
    image: flavorBalance,
    github: "https://github.com/Jondals/FlavorBalance",
    demo: null,
  },

  {
    title: "DevStarter",
    featured: false,
    status: { en: "IN DEVELOPMENT", es: "EN DESARROLLO" },
    description: {
      en: "VS Code extension that helps developers quickly set up popular frameworks and project templates.",
      es: "Extensión de VS Code que ayuda a los desarrolladores a configurar rápidamente frameworks y plantillas de proyectos.",
    },
    contribution: {
      en: "Building extension architecture and framework installation system using TypeScript.",
      es: "Desarrollando la arquitectura de la extensión y el sistema de instalación de frameworks en TypeScript.",
    },
    tech: ["TypeScript", "VS Code API"],
    image: devStarter,
    github: "https://github.com/Jondals/DevStarter",
    demo: null,
  },

  {
    title: "MyMusic",
    featured: false,
    status: { en: "IN DEVELOPMENT", es: "EN DESARROLLO" },
    description: {
      en: "Cross-platform Flutter app that migrates Spotify playlists and allows users to create and manage their own music collections.",
      es: "Aplicación Flutter multiplataforma que migra playlists de Spotify y permite crear y gestionar colecciones musicales propias.",
    },
    contribution: {
      en: "Developing playlist migration system and music management features.",
      es: "Desarrollando el sistema de migración de playlists y gestión musical.",
    },
    tech: ["Flutter", "Dart"],
    image: myMusic,
    github: "https://github.com/Jondals/MyMusic",
    demo: null,
  },

  {
    title: "MyConversor",
    featured: false,
    status: { en: "IN DEVELOPMENT", es: "EN DESARROLLO" },
    description: {
      en: "Media conversion tool that downloads and converts videos from platforms like YouTube and Twitch into different formats.",
      es: "Herramienta de conversión multimedia que descarga y convierte vídeos de plataformas como YouTube y Twitch a diferentes formatos.",
    },
    contribution: {
      en: "Implemented download and conversion pipeline using yt-dlp and ffmpeg.",
      es: "Implementé el sistema de descarga y conversión usando yt-dlp y ffmpeg.",
    },
    tech: ["Python", "FFmpeg", "yt-dlp"],
    image: myConversor,
    github: "https://github.com/Jondals/MyConversor",
    demo: null,
  },

  {
    title: "Chatterly Renewed",
    featured: false,
    status: { en: "IN DEVELOPMENT", es: "EN DESARROLLO" },
    description: {
      en: "Modern rewrite of Chatterly using Angular and TypeScript with improved architecture and local database support.",
      es: "Reescritura moderna de Chatterly usando Angular y TypeScript con mejor arquitectura y soporte de base de datos local.",
    },
    contribution: {
      en: "Redesigning full application architecture using Angular and SQLite.",
      es: "Rediseñando toda la arquitectura de la aplicación con Angular y SQLite.",
    },
    tech: ["Angular", "TypeScript", "SQLite"],
    image: chatterlyRenewed,
    github: "https://github.com/Jondals/ChatterlyRenewed",
    demo: null,
  },
];
