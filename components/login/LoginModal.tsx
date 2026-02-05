"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { X, Lock, UserCircle, Loader2, ArrowRight } from "lucide-react"

export default function LoginModal() {
  const [open, setOpen] = useState(false)
  const [identifier, setIdentifier] = useState("") // Holds either email or username
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await signIn("credentials", {
      redirect: false,
      identifier, // Passing this to your NextAuth authorize function
      password,
    })

    if (res?.error) {
      setError("Invalid identifier or password")
      setLoading(false)
    } else {
      window.location.reload()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-2.5 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-all shadow-lg"
      >
        Sign In
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-[200] p-4">
          <div className="bg-neutral-950 border border-white/10 rounded-[2.5rem] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-300">
            
            {/* Left Section: Image (Matching Register Modal) */}
            <div className="md:w-1/2 relative hidden md:block">
              <img 
                src="/trade-worker.jpg" 
                alt="Landscape" 
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.4]"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/20 to-transparent flex flex-col justify-end p-12">
              
                <h3 className="text-3xl font-black text-white italic tracking-tighter leading-none">
                  WELCOME BACK <br /> TO SKILLGROO.
                </h3>
                <p className="text-neutral-400 text-xs font-bold mt-4 uppercase tracking-[0.2em]">The grind never stops</p>
              </div>
            </div>

            {/* Right Section: Form */}
            <div className="flex-1 p-8 md:p-12 relative flex flex-col justify-center">
              <button 
                onClick={() => setOpen(false)}
                className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-10">
                <h2 className="text-4xl font-black text-white tracking-tighter">Login</h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input
                    type="text"
                    placeholder="Email or Username"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-white text-white font-bold text-sm transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-white text-white font-bold text-sm transition-colors"
                  />
                </div>

                {error && (
                   <p className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 p-3 rounded-xl">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-6 shadow-xl shadow-white/5"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Enter Dashboard"}
                </button>
              </form>

              <div className="mt-8 flex justify-between items-center px-2">
                 <p className="text-neutral-600 text-[10px] font-black uppercase tracking-widest">
                  Need an account? <span className="text-white cursor-pointer hover:underline ml-1">Join</span>
                </p>
                <p className="text-neutral-600 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                  Forgot Password?
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}