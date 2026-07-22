-- Renombra las columnas de contacto (preserva los datos existentes)
ALTER TABLE "Booking" RENAME COLUMN "guestName" TO "contactName";
ALTER TABLE "Booking" RENAME COLUMN "guestEmail" TO "contactEmail";
ALTER TABLE "Booking" RENAME COLUMN "guestPhone" TO "contactPhone";
