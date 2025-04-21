
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notification";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("isLoggedIn") === "true"
      : false
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Listen for changes in localStorage to update login/logout button
  useEffect(() => {
    function syncLoginStatus() {
      const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedInStatus);
    }

    // Sync on mount and on route
    syncLoginStatus();

    // Listen for "storage" events (another tab or login page)
    function handleStorage(e: StorageEvent) {
      if (e.key === "isLoggedIn") {
        syncLoginStatus();
      }
    }
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [location]);

  const handleLogin = () => {
    notify("Redirecting to login page", "info");
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("authorityRole");
    setIsLoggedIn(false);
    notify("Logged out successfully", "success");
    navigate("/");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
            <img src="/images/rural-pattern.svg" alt="Logo" className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold text-rural-terracotta">GramSeva</span>
          </Link>
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-gray-700 hover:text-rural-terracotta transition-colors">
              Home
            </Link>
            <Link to="/report-issue" className="text-gray-700 hover:text-rural-terracotta transition-colors">
              Report Issue
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-rural-terracotta transition-colors">
              Events
            </Link>
            <Link to="/resources" className="text-gray-700 hover:text-rural-terracotta transition-colors">
              Resources
            </Link>
            <Link to="/budget" className="text-gray-700 hover:text-rural-terracotta transition-colors">
              Budget
            </Link>
            <Link to="/gallery" className="text-gray-700 hover:text-rural-terracotta transition-colors">
              Gallery
            </Link>

            {isLoggedIn ? (
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="border-rural-terracotta text-rural-terracotta hover:bg-rural-terracotta/10"
              >
                Logout
              </Button>
            ) : (
              <Button 
                onClick={handleLogin}
                className="bg-rural-terracotta hover:bg-rural-terracotta/90"
              >
                Login
              </Button>
            )}
          </nav>
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-rural-terracotta focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-rural-terracotta transition-colors"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/report-issue"
              className="block py-2 text-gray-700 hover:text-rural-terracotta transition-colors"
              onClick={closeMobileMenu}
            >
              Report Issue
            </Link>
            <Link
              to="/events"
              className="block py-2 text-gray-700 hover:text-rural-terracotta transition-colors"
              onClick={closeMobileMenu}
            >
              Events
            </Link>
            <Link
              to="/resources"
              className="block py-2 text-gray-700 hover:text-rural-terracotta transition-colors"
              onClick={closeMobileMenu}
            >
              Resources
            </Link>
            <Link
              to="/budget"
              className="block py-2 text-gray-700 hover:text-rural-terracotta transition-colors"
              onClick={closeMobileMenu}
            >
              Budget
            </Link>
            <Link
              to="/gallery"
              className="block py-2 text-gray-700 hover:text-rural-terracotta transition-colors"
              onClick={closeMobileMenu}
            >
              Gallery
            </Link>
            {isLoggedIn ? (
              <Button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                variant="outline"
                className="border-rural-terracotta text-rural-terracotta hover:bg-rural-terracotta/10 w-full"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => {
                  handleLogin();
                  closeMobileMenu();
                }}
                className="bg-rural-terracotta hover:bg-rural-terracotta/90 w-full"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
