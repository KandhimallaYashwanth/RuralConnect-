
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-rural-terracotta text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">RuralConnect</h3>
            <p className="text-white/80 mb-4">
              Connecting rural communities with digital tools for better governance, 
              transparency, and citizen participation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-rural-mustard transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-rural-mustard transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-rural-mustard transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/report-issue" className="text-white/80 hover:text-white transition-colors">Report Issue</Link>
              </li>
              <li>
                <Link to="/events" className="text-white/80 hover:text-white transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/budget" className="text-white/80 hover:text-white transition-colors">Budget</Link>
              </li>
              <li>
                <Link to="/history" className="text-white/80 hover:text-white transition-colors">History</Link>
              </li>
              <li>
                <Link to="/resources" className="text-white/80 hover:text-white transition-colors">Resources</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span className="text-white/80">Panchayat Office, Village Area, District, State - Pincode</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <span className="text-white/80">+91 9876543210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <span className="text-white/80">contact@ruralconnect.gov.in</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Language</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-white text-rural-terracotta rounded-md">English</button>
              <button className="px-3 py-1 bg-transparent border border-white text-white rounded-md">हिंदी</button>
              <button className="px-3 py-1 bg-transparent border border-white text-white rounded-md">தமிழ்</button>
              <button className="px-3 py-1 bg-transparent border border-white text-white rounded-md">తెలుగు</button>
            </div>
            
            <h3 className="text-lg font-semibold mb-4 mt-6 text-white">Download App</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-white text-rural-terracotta rounded-md flex items-center gap-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.9,17.39A8.08,8.08,0,0,1,12,20.5a8.59,8.59,0,0,1-6.8-3.1A9.12,9.12,0,0,1,2.5,10.5,8.55,8.55,0,0,1,12,2a8.74,8.74,0,0,1,6.19,2.58l-2.85,2.85A5.14,5.14,0,0,0,12,5.9a5.59,5.59,0,0,0-5.5,5.85A5.49,5.49,0,0,0,12,17.15a5.18,5.18,0,0,0,3.7-1.56Z"></path>
                </svg>
                <span>Play Store</span>
              </button>
              <button className="px-3 py-1 bg-white text-rural-terracotta rounded-md flex items-center gap-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.06,12.11L14.73,11l0.33-0.2A5.28,5.28,0,0,0,18,7.11a5.36,5.36,0,0,0-2.4-7.12A5.18,5.18,0,0,0,12.41,0a5.4,5.4,0,0,0-3.16,1.03,5.12,5.12,0,0,0,.95,8.93l0.33,0.2L7.9,11a1.31,1.31,0,0,0-.67,1.15v9.5a1.31,1.31,0,0,0,1.3,1.33l8.12,0a1.32,1.32,0,0,0,1.31-1.33v-9.5a1.32,1.32,0,0,0-.9-1.04Z"></path>
                </svg>
                <span>App Store</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-6 text-center text-white/70">
          <p>© 2023 RuralConnect. All rights reserved. | Developed for Digital India Initiative</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
