
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Home, FileText, Calendar, DollarSign, BookOpen, FolderOpen, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { notify } from "@/lib/notification";
import { useAuth } from "@/contexts/AuthContext";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, login, logout, currentUser } = useAuth();

  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Report Issue", icon: MessageSquare, href: "/report-issue" },
    { name: "Events", icon: Calendar, href: "/events" },
    { name: "Budget", icon: DollarSign, href: "/budget" },
    { name: "History", icon: BookOpen, href: "/history" },
    { name: "Resources", icon: FolderOpen, href: "/resources" },
    { name: "Announcements", icon: FileText, href: "/announcements" },
  ];

  useEffect(() => {
    // Set active item based on current path
    const path = location.pathname;
    const currentItem = navItems.find(item => item.href === path);
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [location.pathname]);

  const handleLogin = () => {
    if (isLoggedIn) {
      logout();
    } else {
      login();
    }
  };

  const handleNavItemClick = (item) => {
    if (item.name === "Report Issue" && !isLoggedIn) {
      notify("Please login to report an issue", "warning");
      
      // Save the intended destination
      localStorage.setItem("redirectAfterLogin", item.href);
      return;
    }
    
    setActiveItem(item.name);
    navigate(item.href);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2" onClick={() => setActiveItem("Home")}>
              <div className="w-10 h-10 rounded-full bg-rural-terracotta flex items-center justify-center">
                <span className="text-white font-bold">RC</span>
              </div>
              <span className="text-xl font-bold text-rural-terracotta">RuralConnect</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Toggle 
                key={item.name}
                pressed={activeItem === item.name}
                onPressedChange={() => handleNavItemClick(item)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium animated-border ${
                  activeItem === item.name ? "text-rural-terracotta after:w-full" : ""
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Toggle>
            ))}
            <Button 
              className="bg-rural-terracotta hover:bg-rural-terracotta/90 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              onClick={handleLogin}
            >
              <User className="h-4 w-4" />
              {isLoggedIn ? "Logout" : "Login"} 
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="h-6 w-6 text-rural-terracotta" />
              ) : (
                <Menu className="h-6 w-6 text-rural-terracotta" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted text-left ${
                    activeItem === item.name ? "bg-muted text-rural-terracotta" : ""
                  }`}
                  onClick={() => handleNavItemClick(item)}
                >
                  <item.icon className="h-5 w-5 text-rural-terracotta" />
                  <span>{item.name}</span>
                </button>
              ))}
              <Button 
                className="bg-rural-terracotta hover:bg-rural-terracotta/90 mt-4 w-full transition-all duration-300 flex items-center justify-center gap-2"
                onClick={handleLogin}
              >
                <User className="h-4 w-4" />
                {isLoggedIn ? "Logout" : "Login"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
