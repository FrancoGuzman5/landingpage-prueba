import Image from "next/image";
import Link from "next/link";

type TourCardProps = {
  title: string;
  image: string;
  price: string;
  slug: string;
};

export default function TourCard({ title, image, price, slug }: TourCardProps) {
  return (
    <Link href={`/tours/${slug}`} className="block">
      <article className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition">
        {/* Contenedor de imagen con alto fijo */}
        <div className="relative w-full h-48 sm:h-56">
          {/* fill = ocupa todo el contenedor  */}
          <Image
            src={image}
            alt={title}
            fill          /* ocupa 100% */
            className="object-cover"
            sizes="(min-width: 640px) 33vw, 100vw"
          />
        </div>

        {/* Contenido */}
        <div className="p-4 bg-white">
          <h3 className="font-poppins font-semibold text-lg text-kumelenDark">
            {title}
          </h3>
          <p className="mt-1 text-kumelenGold font-bold">{price}</p>
        </div>
      </article>
    </Link>
  );
}
