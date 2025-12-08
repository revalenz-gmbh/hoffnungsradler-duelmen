import { useEffect } from 'react';

interface SchemaScriptProps {
  schema: object;
}

/**
 * React 19 kompatible Komponente für JSON-LD Schema Markup
 * Ersetzt react-helmet für Schema-Komponenten
 */
const SchemaScript = ({ schema }: SchemaScriptProps) => {
  useEffect(() => {
    // Erstelle ein eindeutiges ID basierend auf dem Schema-Typ
    const schemaType = (schema as any)['@type'] || 'schema';
    const scriptId = `schema-${schemaType.toLowerCase()}`;

    // Entferne vorherige Scripts mit derselben ID
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Erstelle neues Script Element
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    // Cleanup
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [schema]);

  return null; // Diese Komponente rendert nichts
};

export default SchemaScript;
