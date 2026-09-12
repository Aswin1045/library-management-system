import React from "react";

const FolioLogo = ({ size = 28, color = "var(--accent)" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Folio logo"
  >
    <path d="M16 7 C16 7 13 6 8 7 L8 25 C13 24 16 25 16 25" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 7 C16 7 19 6 24 7 L24 25 C19 24 16 25 16 25" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="7" x2="16" y2="25" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="10" y1="12" x2="14" y2="11.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="10" y1="15.5" x2="14" y2="15" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="10" y1="19" x2="14" y2="18.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="18" y1="11.5" x2="22" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="18" y1="15" x2="22" y2="15.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="18" y1="18.5" x2="22" y2="19" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

export default FolioLogo;