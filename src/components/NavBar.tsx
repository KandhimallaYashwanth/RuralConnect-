
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, FileText, Calendar, DollarSign, BookOpen, FolderOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notification";
import { Toggle } from "@/components/ui/toggle";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Report Issue", icon: MessageSquare, href: "/report-issue" },
    { name: "Events", icon: Calendar, href: "/events" },
    { name: "Budget", icon: DollarSign, href: "/budget" },
    { name: "History", icon: BookOpen, href: "/history" },
    { name: "Resources", icon: FolderOpen, href: "/resources" },
    { name: "Announcements", icon: FileText, href: "/announcements" },
  ];

  const handleLogin = () => {
    notify("Login functionality initiated!", "info");
    // Simulating login modal or redirect
    setTimeout(() => {
      notify("Login successful! Welcome back.", "success");
    }, 2000);
  };

  const handleNavItemClick = (item) => {
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
              className="bg-rural-terracotta hover:bg-rural-terracotta/90 transition-all duration-300 transform hover:scale-105"
              onClick={handleLogin}
            >
              Login
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
                className="bg-rural-terracotta hover:bg-rural-terracotta/90 mt-4 w-full transition-all duration-300"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
