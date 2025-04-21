
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notification";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path if any
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirectTo') || '/';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!phoneNumber || !password) {
      notify("Please fill in all fields", "error");
      return;
    }
    
    // For demo purposes, simple authentication
    // In a real app, this would be an API call
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userType", "public");
    localStorage.setItem("userPhone", phoneNumber);
    
    notify("Login successful!", "success");
    
    // Redirect back to where they came from, or home
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg p-8 shadow">
            <h1 className="text-2xl font-bold text-center text-rural-terracotta mb-6">
              Login to Your Account
            </h1>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone-number" className="text-sm font-medium">
                  Phone Number
                </label>
                <input
                  id="phone-number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="bg-rural-terracotta hover:bg-rural-terracotta/90 w-full py-2"
              >
                Login
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p>Don't have an account? <Link to="/register" className="text-rural-terracotta hover:underline">Register</Link></p>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h2 className="text-center font-medium mb-3">Authority Login</h2>
              <Link to="/authority-login">
                <Button 
                  variant="outline" 
                  className="w-full border-rural-leaf text-rural-leaf hover:bg-rural-leaf/10"
                >
                  Login as Authority
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
