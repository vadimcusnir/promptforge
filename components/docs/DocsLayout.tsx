"use client";

import { useState, useEffect } from "react";
import { DocsSidebar } from "./DocsSidebar";
import { DocsContent } from "./DocsContent";
import { SearchBar } from "./SearchBar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocsLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[#5a5a5a]/30 bg-[#0e0e0e]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#d1a954] rounded" />
          <span className="font-mono font-bold text-[#d1a954]">Docs</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white hover:bg-[#1a1a1a]"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Search Bar - Mobile */}
      <div className="md:hidden p-4 border-b border-[#5a5a5a]/30">
        <SearchBar />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <DocsSidebar
          isOpen={isSidebarOpen}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <DocsContent
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
