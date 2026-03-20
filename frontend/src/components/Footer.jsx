import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-green text-beige py-8 mt-16">
      <div className="container mx-auto px-6 text-center">
        <p className="mb-2">© {currentYear} SCSS Research Archive. All rights reserved.</p>
        <p className="text-sm opacity-75">
          A platform for accessing research papers published by faculty.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
