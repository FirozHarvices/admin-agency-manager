import { WizardHeader } from "../components/layout/WizardHeader"; // We can reuse the same header!
import LoginForm from "../features/auth/components/LoginForm";
import loginLeftBg from "../assets/loginLeftBg.png"; // Path to your background image

export const LoginPage = () => {
  return (
    // Main container for the entire page
    <>
        <div className="h-screen bg-page-bg w-full flex flex-col p-4 px-8 ">

      {/* 1. The Header */}
      <WizardHeader />

      {/* 2. A container to grow and center the main login card */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-8 gap-8 overflow-hidden mb-20">
        {/* Left Side (Image Panel) */}
     <div className="relative w-full h-full hidden lg:block rounded-2xl overflow-hidden lg:col-span-5">
  <img
    src={loginLeftBg}
    alt="Abstract background"
    className="w-full h-full object-cover transform scale-75"
  />
  <div
    className="absolute inset-0"
    style={{
      background: "linear-gradient(238.93deg, rgba(240, 247, 254, 0.4) -1.05%, rgba(213, 211, 255, 0.4) 100%)",
    }}
  ></div>
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 px-8 rounded-3xl bg-white/10 backdrop-blur-xl text-white border border-white/20 shadow-lg w-10/12 max-w-md">
    <h3 className="text-xl font-bold leading-tight">
      Pick a Client, Launch a Vision 🚀
    </h3>
    <p className="mt-2 text-xs max-w-sm text-white/80">
      This is where the magic begins. Choose your client and let our AI
      craft the perfect starting point. No coding, no chaos — just
      intelligent design tools tailored for freelancers, creators, and
      growing teams.
    </p>
  </div>
</div>

        {/* Right Panel where the actual login form is rendered */}
        <div className="w-full h-full flex lg:col-span-3">
          <LoginForm />
        </div>
      </main>
        </div>
    </>
  );
};
