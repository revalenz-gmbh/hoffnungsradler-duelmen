import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const Impressum = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold mb-6">Impressum</h1>
          
          <h2 className="text-xl font-semibold mt-4 mb-2">Angaben gemäß § 5 TMG</h2>
          <p>Hoffnungsradler Dülmen e.V. i.G.</p>
          <p>Königsberger Str. 26</p>
          <p>48249 Dülmen</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Vertreten durch</h2>
          <p>Martin Stolz (1. Vorsitzender)</p>
          <p>Gregor Horstmann (2. Vorsitzender)</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Kontakt</h2>
          <p>E-Mail: hoffnungsradlerinfo@gmail.com</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Vereinsregistereintrag</h2>
          <p>Der Verein befindet sich in Gründung.</p>
          <p>Eintragung in das Vereinsregister beim Amtsgericht [zuständiges Amtsgericht] ist beantragt.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>Martin Stolz   </p>
          <p>Königsberger Str. 26</p>
          <p>48249 Dülmen</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Impressum; 