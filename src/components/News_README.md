# Hinweise zur News-Komponente

## Anzeige-Logik für News-Einträge

- **type: "internal"**
  - Bild wird als Vorschau angezeigt
  - Beim Klick auf das Bild öffnet sich ein Dialog mit dem Bild

- **type: "press"**
  - **mit `link`:**
    - Es wird ein Link "Artikel lesen" angezeigt (kein Bild)
  - **mit `images` (ohne `link`):**
    - Es wird ein Button "Artikel lesen" angezeigt
    - Beim Klick öffnet sich das Bild im Dialog (aber keine Vorschau im News-Feed)

## Beispiel für einen Eintrag mit Bild (ohne Link)
```js
{
  date: "17.05.2025",
  source: "Dülmenplus",
  title: "Hoffnungsradler auch am 24. Mai unterwegs",
  excerpt: "...",
  images: ["/lovable-uploads/Duelmenplus17Mai25.png"],
  type: "press"
}
```

## Beispiel für einen Eintrag mit Link (ohne Bild)
```js
{
  date: "22.04.2025",
  source: "Dülmener Zeitung",
  title: "Traditioneller Start am Marktplatz",
  excerpt: "...",
  link: "https://zeitung.de/artikel",
  type: "press"
}
```

## Beispiel für einen internen Eintrag mit Bild
```js
{
  date: "11.05.2025",
  title: "'Große Scheibe Lette' überreicht Spende ...",
  excerpt: "...",
  images: ["/lovable-uploads/3ac1df73-721c-4114-a502-09eed0e8d4d5~1.jpg"],
  type: "internal"
}
``` 