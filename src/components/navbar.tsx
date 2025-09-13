import React from "react";

type NavbarProps = {
  currentLang: "en" | "mr";
  onLogout: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ currentLang, onLogout }) => {
  return (
    <nav className="navbar">
    
      
    </nav>
  );
};

export default Navbar;
