import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center">
        <a
          href="https://yammservices.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <img
            src="/yamm-logo.png"
            alt="YAMM Services"
            className="h-10 w-auto"
          />
        </a>
      </div>
    </header>
  );
};

export default Header;
