
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notification";

const AuthoritiesDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#CD5D45] flex items-center justify-center">
              <span className="text-white font-bold">RC</span>
            </div>
            <h1 className="text-xl font-semibold">Authorities Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Sarpanch</span>
            <Button 
              variant="outline"
              onClick={() => {
                navigate("/");
                notify("Logged out successfully", "success");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="py-6">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#CD5D45] flex items-center justify-center">
                <span className="text-white text-xl">!</span>
              </div>
              <h2 className="text-xl font-semibold text-[#CD5D45]">Pending Issues</h2>
            </div>
            <p className="text-gray-600">Review and respond to newly submitted issues from citizens.</p>
            <div className="mt-4 text-gray-500">No pending issues at this time.</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthoritiesDashboard;
