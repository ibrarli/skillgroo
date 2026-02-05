"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { X, Lock, UserCircle, Loader2, ArrowRight, AtSign, Mail, User, LogIn } from "lucide-react"

export default function AuthModal() {
  const [open, setOpen] = useState(false)
  const [isLogin, setIsLogin] = useState(true) // Toggle state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    identifier: "", // For Login (Email or Username)
    password: "",
  })

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (isLogin) {
      // Login Logic
      const res = await signIn("credentials", {
        redirect: false,
        identifier: formData.identifier,
        password: formData.password,
      })

      if (res?.error) {
        setError("Invalid credentials")
        setLoading(false)
      } else {
        window.location.reload()
      }
    } else {
      // Register Logic
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            username: formData.username,
            email: formData.email,
            password: formData.password
          }),
        })
        const data = await res.json()
        if (!res.ok) setError(data.error)
        else setIsLogin(true) // Switch to login after success
      } catch (err) {
        setError("Registration failed")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <>
      {/* IconButton Trigger */}
      <button
        onClick={() => { setOpen(true); setIsLogin(true); }}
        className="p-2.5 bg-neutral-900 border border-white/10 text-white rounded-xl hover:bg-neutral-800 transition-all group shadow-xl"
        title="Login"
      >
        <LogIn size={20} className="group-hover:text-primary transition-colors" />
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-[200] p-4">
          <div className="bg-neutral-950 border border-white/10 rounded-[2.5rem] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-300">
            
            {/* Left Section: Visual */}
            <div className="md:w-1/2 relative hidden md:block">
              <img 
                src="/trade-worker.jpg" 
                alt="Landscape" 
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.4]"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/20 to-transparent flex flex-col justify-end p-12">
              
                <h3 className="text-3xl font-black text-white italic tracking-tighter leading-none">
                  {isLogin ? "WELCOME BACK TO SKILLGROO." : "START YOUR JOURNEY TODAY."}
                </h3>
              </div>
            </div>

            {/* Right Section: Form */}
            <div className="flex-1 p-8 md:p-12 relative flex flex-col justify-center">
              <button onClick={() => setOpen(false)} className="absolute top-8 right-8 text-neutral-500 hover:text-white">
                <X size={20} />
              </button>

              <div className="mb-10">
                <h2 className="text-4xl font-black text-white tracking-tighter">
                  {isLogin ? "Login" : "Sign Up"}
                </h2>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="w-full bg-neutral-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-white font-bold text-sm"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                      <input
                        type="text"
                        placeholder="Username"
                        required
                        className="w-full bg-neutral-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-white font-bold text-sm"
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        className="w-full bg-neutral-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-white font-bold text-sm"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </>
                )}

                {isLogin && (
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                      type="text"
                      placeholder="Email or Username"
                      required
                      className="w-full bg-neutral-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-white font-bold text-sm"
                      onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                    />
                  </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full bg-neutral-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-white font-bold text-sm"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>

                {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 p-3 rounded-xl">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 mt-6 ${isLogin ? 'bg-white text-black hover:bg-neutral-200' : 'bg-primary text-black hover:brightness-110'}`}
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : isLogin ? "Login" : "Create Account"}
                </button>
              </form>

              <p className="text-center text-neutral-600 text-[10px] font-black uppercase tracking-widest mt-8">
                {isLogin ? "Need an account?" : "Already have an account?"}
                <span 
                  onClick={() => { setIsLogin(!isLogin); setError(""); }}
                  className="text-white cursor-pointer hover:underline ml-2 transition-all"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}