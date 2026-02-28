"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const contactEmail = "ekehchukwuemeka375@gmail.com";
  const contactSubject = encodeURIComponent("Update or Delete Event Request");
  const contactBody = encodeURIComponent(
    "Hello,\n\nI would like to request an update or deletion for an event.\n\nEvent Name:\nEvent Date:\nReason for Update/Deletion:\n\nThank you."
  );
  const mailtoLink = `mailto:${contactEmail}?subject=${contactSubject}&body=${contactBody}`;

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>DevEvent</p>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex flex-row items-center gap-6">
          <Link href="/">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/events/create">Create Event</Link>
          <a href={mailtoLink}>Contact</a>
        </ul>

        {/* Mobile Menu Toggle */}
        <button className="sm:hidden text-white flex items-center justify-center p-2 cursor-pointer" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 right-0 w-full glass bg-background/95 sm:hidden flex flex-col items-end gap-6 py-8 px-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <Link href="/" onClick={toggleMenu}>Home</Link>
            <Link href="/events" onClick={toggleMenu}>Events</Link>
            <Link href="/events/create" onClick={toggleMenu}>Create Event</Link>
            <a href={mailtoLink} onClick={toggleMenu}>Contact</a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;