import React from 'react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Der Header wurde entfernt, um die Hauptnavigation der Seite zu verwenden. */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 