import Image from "next/image";
import Link from "next/link";
import { formatCLP } from "@/lib/tours";

type TourCardProps = {
  title: string;
  image: string | null;
  price: number;
  priceOriginal?: number | null;
  slug: string;
};

export default function TourCard({
  title,
  image,
  price,
  priceOriginal,
  slug,
}: TourCardProps) {
  return (
    <Link href={`/tours/${slug}`} className="block">
      <article className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition">
        {/* Contenedor de imagen con alto fijo */}
        <div className="relative w-full h-48 sm:h-56 bg-kumelenBrown">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(min-width: 640px) 33vw, 100vw"
            />
          )}
        </div>

        {/* Contenido */}
        <div className="p-4 bg-white">
          <h3 className="font-poppins font-semibold text-lg text-kumelenDark">
            {title}
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-kumelenGold font-bold">{formatCLP(price)}</span>
            {priceOriginal && priceOriginal > price && (
              <span className="text-sm text-kumelenDark/40 line-through">
                {formatCLP(priceOriginal)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
