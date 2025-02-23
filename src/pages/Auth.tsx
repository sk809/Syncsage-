
import { AuthForm } from "@/components/AuthForm";
import { Zap } from "lucide-react";

const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-purple-800 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-2 mb-8">
        <Zap className="w-8 h-8 text-white" />
        <span className="text-xl font-semibold text-white">SyncSage</span>
      </div>
      <AuthForm />
    </div>
  );
};

export default Auth;
