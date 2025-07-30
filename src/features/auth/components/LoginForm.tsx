import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import { Input } from "../../../components/ui/input";
import { useState } from "react";
import { useLoginWithPassword } from "../hooks/useLoginWithPassword";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Added password state

  const loginMutation = useLoginWithPassword(); // Changed to password login hook

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password }); // Pass email and password
  };

  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 8; // Example validation for password

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm w-full flex flex-col min-h-[400px]">
      <div className="text-center lg:text-left mb-8">
        <h2 className="text-base font-bold text-gray-900">Log In</h2>
        <p className="text-sm text-gray-500 mt-1">
          Access your account to continue.
        </p>
      </div>

      <form
        onSubmit={handleLoginSubmit}
        className="flex flex-col flex-grow"
      >
        {/* Form Fields Section */}
        <div className="space-y-6 flex-grow">
          {/* Email Input Section */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Enter your username or email*
            </label>
            <Input
              label=""
              type="email"
              placeholder="Ex. johnwille@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input Section */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Enter your password*
            </label>
            <Input
              label=""
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit Button - Now at the bottom */}
        <div className="mt-8">
          <Button
            type="submit"
            className={cn(
              'w-full transition-colors rounded-full py-3 text-base',
              (!isEmailValid || !isPasswordValid) && 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
            disabled={
              !isEmailValid ||
              !isPasswordValid ||
              loginMutation.isPending
            }
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;