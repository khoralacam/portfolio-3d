"use client"; // Yeh zaroori hai agar clicks ya state use ho rahi hai

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="...existing styles...">
      <Link href="/">Home</Link>
      <Link href="/#games">Games</Link>
      {/* Baaki links */}
    </nav>
  );
}