
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notify } from "@/lib/notification";

const AUTHORITY_CREDENTIALS = {
  sarpanch: { email: "sarpanch@gmail.com", password: "sarpanch" },
  "wise-sarpanch": { email: "wisesarpanch@gmail.com", password: "wisesarpanch" },
  "ward-member": { email: "wardmember@gmail.com", password: "wardmember" },
};

const AuthorityLogin = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (value: string) => {
    setRole(value);
    const credentials = AUTHORITY_CREDENTIALS[value as keyof typeof AUTHORITY_CREDENTIALS];
    if (credentials) {
      setEmail(credentials.email);
      setPassword(credentials.password);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const credentials = AUTHORITY_CREDENTIALS[role as keyof typeof AUTHORITY_CREDENTIALS];
    if (credentials && credentials.email === email && credentials.password === password) {
      setTimeout(() => {
        notify("Authority login successful!", "success");
        navigate("/authority-dashboard");
        setLoading(false);
      }, 1000);
    } else {
      notify("Invalid credentials", "error");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Authority Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Role</label>
          <Select onValueChange={handleRoleChange} value={role}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sarpanch">Sarpanch</SelectItem>
              <SelectItem value="wise-sarpanch">Wise-Sarpanch</SelectItem>
              <SelectItem value="ward-member">Ward Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default AuthorityLogin;
