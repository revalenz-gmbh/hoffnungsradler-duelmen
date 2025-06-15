import React from 'react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Der Header wurde entfernt, um die Hauptnavigation der Seite zu verwenden. */}
      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; {new Date().getFullYear()} Hoffnungsradler Dülmen. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 