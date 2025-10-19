 
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0">
          Developed by{" "}
          <Link 
            href="https://github.com/CoderYashVij" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-mainColor transition-colors"
          >
            Yash Vij
          </Link>
        </p>
      </div>
    </footer>
  );
}
