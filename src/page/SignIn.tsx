import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Label from "../components/Label";
import Input from "../components/InputField";
import Button from "../components/Button";
import { useAuth } from "../store/Auth";
import axios from "axios";
import { Eye, EyeOff, Smartphone } from "lucide-react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  // ใช้ zustand store
  const setUser = useAuth((state) => state.setUser);
  const setIsLoggedIn = useAuth((state) => state.setIsLoggedIn);
  const logout = useAuth((state) => state.logout);

  useEffect(() => {
    logout();
  }, [logout]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!username || !password) {
      setLoginError("Username and password are required.");
      return;
    }

    try {
      const response = await axios.post(
        "https://api-admin.trantech.co.th/login/check",
        { username, password }
      );
      const data = response.data;

      if (data.ok && data.rows) {
        setUser(data.rows);
        setIsLoggedIn(true);

        navigate("/camera", { replace: true });
      } else {
        setLoginError("Username or password incorrect");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setLoginError(
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      } else {
        setLoginError("An unknown error occurred.");
      }
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 sm:hidden bg-brand-950  bg-no-repeat"
        style={{
          backgroundImage: "url('https://img2.pic.in.th/pic/grid-01.png')",
        }}
      >
        <img
          width={180}
          height={36}
          src="https://img2.pic.in.th/pic/logotrachtechwhite.png"
          alt="Logo"
          className="mb-8"
        />

        <div className="w-full max-w-xs">
          <h1 className="text-xl font-semibold text-gray-300 mb-2">Sign In</h1>
          <p className="text-gray-500 text-sm mb-6">
            Enter your username and password to sign in!
          </p>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label>
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <Label>
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </span>
              </div>
            </div>

            {loginError && (
              <div className="text-red-500 text-sm">{loginError}</div>
            )}

            <Button className="w-full py-3 bg-brand-600 text-white font-medium rounded-lg">
              Sign In
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden sm:flex min-h-screen items-center justify-center bg-gray-100 flex-col">
        <Smartphone className="w-20 h-20 text-gray-500 mb-4" />
        <p className="text-gray-600 text-lg font-medium font-thai text-center px-6">
          หน้านี้รองรับเฉพาะการใช้งานบนมือถือ
        </p>
      </div>
    </>
  );
}
