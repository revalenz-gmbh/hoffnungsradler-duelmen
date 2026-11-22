/**
 * Bilder fuer die Website verkleinern (an Ort und Stelle, Dateinamen bleiben gleich).
 *
 *   npm run bilder:optimieren            -> alle von git erfassten Bilder
 *   npm run bilder:optimieren -- datei…  -> nur die angegebenen Dateien (z. B. neue Fotos)
 *
 * - Fotos (JPG): max. 1920 px Kantenlaenge, JPEG-Qualitaet 78 (mozjpeg)
 * - PNG: max. 1920 px (Logos max. 400 px), verlustfrei komprimiert; nur
 *   Zeitungsausschnitte bekommen eine Farbpalette (bei Logos verfaelscht sie Farben)
 * - Drehung aus den Kameradaten wird angewendet, danach werden alle Metadaten
 *   entfernt (auch GPS-Koordinaten aus Handyfotos)
 * - Eine Datei wird nur ueberschrieben, wenn das Ergebnis kleiner ist.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const ORDNER = ['public/photos', 'public/zeitungsartikel', 'public/logos'];
const MAX_FOTO = 1920;
const MAX_LOGO = 400;

const args = process.argv.slice(2);
const dateien = args.length
  ? args
  : execFileSync('git', ['ls-files', '-z', ...ORDNER], { encoding: 'utf8' })
      .split('\0')
      .filter((f) => /\.(jpe?g|png)$/i.test(f));

let vorher = 0;
let nachher = 0;
for (const datei of dateien) {
  const original = readFileSync(datei);
  const istPng = /\.png$/i.test(datei);
  const max = datei.includes('/logos/') ? MAX_LOGO : MAX_FOTO;
  let bild = sharp(original).rotate().resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true });
  bild = istPng
    ? bild.png(
        datei.includes('/zeitungsartikel/')
          ? { compressionLevel: 9, palette: true, quality: 90, effort: 10 }
          : { compressionLevel: 9, adaptiveFiltering: true }
      )
    : bild.jpeg({ quality: 78, mozjpeg: true });
  const neu = await bild.toBuffer();
  vorher += original.length;
  if (neu.length < original.length * 0.95) {
    writeFileSync(datei, neu);
    nachher += neu.length;
    console.log(`${(original.length / 1024).toFixed(0).padStart(6)} kB -> ${(neu.length / 1024).toFixed(0).padStart(5)} kB  ${datei}`);
  } else {
    nachher += original.length;
  }
}
console.log(`\nGesamt: ${(vorher / 1048576).toFixed(1)} MB -> ${(nachher / 1048576).toFixed(1)} MB`);
