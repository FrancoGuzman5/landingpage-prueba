// src/components/LogoKumelen.tsx
// Isologo + wordmark. Lo usan el navbar de desktop y la barra móvil.
//
// El wordmark se acorta con clases responsive, NO con window.innerWidth:
// medir el ancho en JS provoca parpadeo, porque en el render del servidor
// ese valor no existe y el primer pintado sale con el texto equivocado.

import Image from "next/image";

export default function LogoKumelen() {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/Isologo.png"
        alt=""
        width={40}
        height={40}
        className="h-9 w-auto"
        priority
      />
      <span className="font-poppins text-lg font-semibold leading-none tracking-tight text-white">
        {/* <768px: solo "Kumelen". Desde md: nombre completo. */}
        <span className="md:hidden">Kumelen</span>
        <span className="hidden md:inline">Kumelen Endémico</span>
      </span>
      {/* El alt del isologo va vacío porque el wordmark ya nombra la marca:
          si no, un lector de pantalla diría "Kumelen" dos veces. */}
    </span>
  );
}
