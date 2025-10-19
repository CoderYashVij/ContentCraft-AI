import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import Logo from "@/app/dashboard/_components/Logo";
import Link from "next/link";
const Header: React.FC = () => {
  const user = useUser();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md py-2">
      <div className="mx-auto flex h-20 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link className="block text-mainColor scale-110" href="/">
        
          <Logo/>
         
  
        </Link>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          {/* Desktop Navigation */}
          <nav
            aria-label="Global"
            className={`hidden md:block ${
              isMobileMenuOpen ? "block" : "hidden"
            }`}
          >
            <ul className="flex items-center gap-8 text-base font-medium">
              <li>
                <a
                  className="text-gray-700 transition hover:text-mainColor"
                  href="/dashboard"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  className="text-gray-700 transition hover:text-mainColor"
                  href="/dashboard/history"
                >
                  History
                </a>
              </li>
              <li>
                <a
                  className="text-gray-700 transition hover:text-mainColor"
                  href="/dashboard/pricing"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  className="text-gray-700 transition hover:text-mainColor"
                  href="/dashboard/profile"
                >
                  Settings
                </a>
              </li>
            </ul>
          </nav>

          {/* Desktop & Mobile Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <UserButton appearance={{
                elements: {
                  avatarBox: "w-12 h-12" // Make user avatar bigger
                }
              }} />
            ) : (
              <div className="sm:flex sm:gap-4">
                <button
                  onClick={handleSignIn}
                  className="block rounded-md bg-mainColor px-6 py-3 text-base font-bold text-white transition hover:bg-mainColor/90 shadow-md"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignUp}
                  className="hidden rounded-md bg-gray-100 px-6 py-3 text-base font-bold text-mainColor transition hover:bg-gray-200 shadow-sm sm:block"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="block rounded bg-gray-100 p-3 text-gray-700 transition hover:text-mainColor md:hidden"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav aria-label="Mobile Global" className="md:hidden">
          <ul className="flex flex-col gap-4 p-4 text-sm">
            <li>
              <a
                className="text-gray-500 transition hover:text-gray-500/75"
                href="#"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                className="text-gray-500 transition hover:text-gray-500/75"
                href="#"
              >
                History
              </a>
            </li>
            <li>
              <a
                className="text-gray-500 transition hover:text-gray-500/75"
                href="#"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                className="text-gray-500 transition hover:text-gray-500/75"
                href="#"
              >
                Settings
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
