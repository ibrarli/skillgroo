"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes"; // Import useTheme
import UserProfile from "./UserProfile";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";
import { Search, MessageSquare, Heart, Clock, TrendingUp, X } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, resolvedTheme } = useTheme(); // Get theme state
  const [mounted, setMounted] = useState(false);
  const [activeRole, setActiveRole] = useState<"customer" | "worker">("customer");
  
  // Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch by only rendering theme-specific logic after mount
  useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.FormEvent | React.KeyboardEvent) => {
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    setActiveRole(pathname.startsWith("/worker") ? "worker" : "customer");
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleChange = (role: "customer" | "worker") => {
    router.push(role === "customer" ? "/" : "/worker");
  };

  // Determine logo source based on the theme
  // We use resolvedTheme to handle "system" settings correctly
  const logoSrc = mounted && resolvedTheme === "light" 
    ? "/logo-skillgroo-white.svg" 
    : "/logo-skillgroo-dark.svg";

  return (
    <header className="fixed top-0 left-0 h-16 z-[100] w-full backdrop-blur-md bg-background/60 border-b border-foreground/5 transition-colors duration-300">
      <div className="mx-auto px-4 flex items-center justify-between h-full gap-8">
        
        {/* LEFT: Logo */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center">
            <img 
              src={logoSrc} 
              alt="Skillgroo Logo" 
              className="w-30 h-auto transition-all duration-300" 
            />
          </Link>
          {session ? (
            activeRole === "customer" && (
              <Link
                href="/orders"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/orders" ? "text-primary" : "text-foreground hover:text-primary/70"
                }`}
              >
                My Orders
              </Link>
            )
          ) : (
            <Link
              href="/explore"
              className={`text-sm font-medium transition-colors ${
                pathname === "/explore" ? "text-primary" : "text-foreground hover:text-primary/70"
              }`}
            >
              Explore
            </Link>
          )}
        </div>

        {/* MIDDLE: Expanded Search Bar */}
        {activeRole === "customer" && (
          <div className="flex-1 max-w-2xl hidden md:block relative" ref={searchRef}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className={`${isSearchOpen ? 'text-primary' : 'text-neutral-500'} transition-colors`} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                placeholder="Search for skilled craft..."
                className={`w-full bg-foreground/[0.03] border ${isSearchOpen ? 'border-primary/50 bg-background shadow-lg shadow-primary/5' : 'border-foreground/10'} text-foreground text-sm rounded-full py-2.5 pl-11 pr-4 focus:outline-none transition-all placeholder:text-neutral-500`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-4 flex items-center text-neutral-500 hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* SEARCH DROPDOWN */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-background border border-foreground/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4">
                  {!searchQuery ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-2 mb-2">Recommended</p>
                        <div className="flex flex-wrap gap-2 px-2">
                          {['Electrician', 'Carpenter', 'Plumbing', 'HVAC'].map((tag) => (
                            <button key={tag} className="px-3 py-1.5 bg-foreground/5 hover:bg-primary hover:text-white text-xs text-neutral-500 dark:text-neutral-300 rounded-full transition-colors">
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-2 mb-1">Recent Searches</p>
                        <div className="flex items-center gap-3 px-3 py-2 hover:bg-foreground/5 rounded-xl cursor-pointer group">
                          <Clock size={14} className="text-neutral-400 group-hover:text-primary" />
                          <span className="text-sm text-neutral-500">Custom cabinetry near London</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-2 mb-2">Searching for "{searchQuery}"</p>
                      {['View all results for ', 'Highly rated workers in '].map((text, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-3 hover:bg-foreground/5 rounded-xl cursor-pointer">
                          <TrendingUp size={14} className="text-primary" />
                          <span className="text-sm text-foreground">{text} <span className="font-bold">{searchQuery}</span></span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-foreground/[0.02] px-4 py-2 border-t border-foreground/5 flex justify-between items-center">
                  <span className="text-[10px] text-neutral-400">Press Enter to search</span>
                  <Link href="/explore" className="text-[10px] text-primary hover:underline" onClick={() => setIsSearchOpen(false)}>Advanced Search</Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {session && (
            <>
              <div className="flex items-center gap-1 mr-2">
                <button className="p-2 text-neutral-500 hover:text-foreground hover:bg-foreground/5 rounded-full transition-all">
                  <Heart size={20} />
                </button>
                <button className="p-2 text-neutral-500 hover:text-foreground hover:bg-foreground/5 rounded-full transition-all">
                  <MessageSquare size={20} />
                </button>
                <NotificationDropdown />
              </div>

              <div className="hidden lg:flex items-center bg-foreground/[0.05] border border-foreground/10 rounded-full p-1 mr-2">
                {["customer", "worker"].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role as any)}
                    className={`px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer duration-300 ${
                      activeRole === role ? "bg-primary text-white" : "text-neutral-500 hover:text-foreground"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </>
          )}
          <UserProfile />
        </div>
      </div>
    </header>
  );
}