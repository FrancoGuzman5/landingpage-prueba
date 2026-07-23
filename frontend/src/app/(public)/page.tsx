//import { Menu } from "lucide-react";
"use client"
import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import Carousel from "@/components/Carousel";
import Filosofia from "@/components/Filosofia";
import MetodologiaVuelo from "@/components/MetodologiaVuelo";
import Equipo from "@/components/Equipo";
import Image from "next/image";
import Link from "next/link";
import {motion, AnimatePresence} from "framer-motion"
import { useState, useEffect } from "react";

const videos2 = [
  "/videos/IMG_1188.mp4",
  "/videos/IMG_1210.mp4",
  "/videos/IMG_1364.mp4"
]

export default function Home() {
  const [current, setCurrent] = useState(0)

  useEffect(() =>{
    const interval = setInterval(() =>{
      setCurrent((prev) => (prev + 1) % videos2.length)
    }, 10000) //cambia cada 10 seg
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Hero />
      {/* Sección de contenido pequeña */}
      <section className="bg-kumelenDark py-16">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
          <h1 className="font-poppins font-bold text-[50px]">¡Bienvenido a Kumelen Endémico!</h1>
           <p className="max-w-3xl mx-auto leading-relaxed text-kumelenSand/90 font-poppins text-[40px] mb-0">
             ¿A QUIENES <span className="font-bold">NOS DIRIGIMOS?</span>
          </p>
          <p className="max-w-3xl mx-auto text-white font-artifact text-[60px] mb-[20px]">si buscas</p>
          <Carousel />
          <p className="max-w-3xl mx-auto leading-relaxed text-kumelenSand/90 font-poppins font-extrabold text-[40px]">ENTONCES, KUMELEN ES PARA TI.</p>
        </div>
      </section>

      {/* Filosofía #ESTARKUMELEN (texto del Brochure) */}
      <Filosofia />

      {/* Segunda sección de vídeo */}
      <section className="relative h-[70vh] w-full overflow-hidden z-10">
        <AnimatePresence mode="wait"> 
          <motion.video
            key={videos2[current]}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
            src={videos2[current]}
            autoPlay
            preload="auto"
            muted
            loop
            playsInline
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 1.5, ease: "easeInOut"}}
          >  
            <source src={videos2[current]} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-20 flex h-full items-center justify-center px-6">
          <h2 className="text-4xl text-white font-poppins text-center">Descubre nuevas experiencias</h2>
        </div>  
      </section> 
      
      {/* Metodología: los 4 pilares con vuelo scrollytelling (estática en móvil) */}
      <MetodologiaVuelo />

      {/* Video con CTA que lleva a la página de Tours (movido arriba del equipo) */}
      <VideoSection src="/videos/IMG_1188.mp4" id="video-3">
        <Link
          href="/tours"
          className="px-6 py-3 bg-kumelenGold text-kumelenDark font-semibold rounded hover:opacity-90"
        >
          Reserva ahora
        </Link>
      </VideoSection>


      {/* Equipo (datos del Brochure; fotos pendientes) */}
      <Equipo />
      <section id="poster" className="bg-kumelenSand text-kumelenDark">
        <img src="images/street_poster_kumelen.png" className="w-full"/>
      </section>
      <section id="contacto" className="min-h-[30vh] bg-white text-kumelenDark flex flex-wrap items-center justify-center gap-4 p-8">
       <img src="images/rrss_kumelen.png" alt="Foto 1 descripción" className="w-full sm:w-1/2 object-cover rounded-lg shadow-lg"/>
      </section>
    </>
  );
}