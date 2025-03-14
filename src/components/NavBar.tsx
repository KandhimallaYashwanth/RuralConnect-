
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, FileText, Calendar, DollarSign, BookOpen, FolderOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Report Issue", icon: MessageSquare, href: "/report-issue" },
    { name: "Events", icon: Calendar, href: "/events" },
    { name: "Budget", icon: DollarSign, href: "/budget" },
    { name: "History", icon: BookOpen, href: "/history" },
    { name: "Resources", icon: FolderOpen, href: "/resources" },
    { name: "Announcements", icon: FileText, href: "/announcements" },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-rural-terracotta flex items-center justify-center">
                <span className="text-white font-bold">RC</span>
              </div>
              <span className="text-xl font-bold text-rural-terracotta">RuralConnect</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.href}
                className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium animated-border"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            <Button className="bg-rural-terracotta hover:bg-rural-terracotta/90">Login</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
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
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5 text-rural-terracotta" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <Button className="bg-rural-terracotta hover:bg-rural-terracotta/90 mt-4">Login</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
