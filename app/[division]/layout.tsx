import { ReactNode } from "react";

function DivisionLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bg-primary text-primary-foreground border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">STUDENT'S GALA</h1>
        </div>
      </header>
      {children}
    </>
  );
}

export default DivisionLayout;
