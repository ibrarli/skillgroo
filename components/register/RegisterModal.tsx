"use client"

import { useState } from "react"
import { X, User, Mail, Lock, AtSign, Loader2, ArrowRight } from "lucide-react"

export default function RegisterModal() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
      } else {
        setSuccess("Account created successfully!")
        setFormData({ name: "", username: "", email: "", password: "" })
        // Optional: Redirect after success
        // setTimeout(() => setOpen(false), 2000)
      }
    } catch (err) {
      setError("Server connection failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-2.5 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/20"
      >
        Get Started
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-[200] p-4">
          <div className="bg-neutral-950 border border-white/10 rounded-[2.5rem] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-300">
            
            {/* Left Section: Image/Visual */}
            <div className="md:w-1/2 relative hidden md:block">
              <img 
                src="/trade-worker.jpg" 
                alt="Landscape" 
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/20 to-transparent flex flex-col justify-end p-12">
               
                <h3 className="text-3xl font-black text-white italic tracking-tighter leading-none">
                  JOIN THE <br /> SKILLGROO ELITE.
                </h3>
                <p className="text-neutral-400 text-xs font-bold mt-4 uppercase tracking-[0.2em]">Craft your professional future</p>
              </div>
            </div>

            {/* Right Section: Form */}
            <div className="flex-1 p-8 md:p-12 relative">
              <button 
                onClick={() => setOpen(false)}
                className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-10">
                <h2 className="text-4xl font-black text-white tracking-tighter">Sign Up</h2>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                      type="text"
                      placeholder="Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-neutral-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-primary text-white font-bold text-sm transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                      type="text"
                      placeholder="Username"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full bg-neutral-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-primary text-white font-bold text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-neutral-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-primary text-white font-bold text-sm transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-neutral-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-primary text-white font-bold text-sm transition-colors"
                  />
                </div>

                {error && (
                   <p className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 p-2 rounded-lg">{error}</p>
                )}
                {success && (
                   <p className="text-green-500 text-[10px] font-black uppercase tracking-widest bg-green-500/10 p-2 rounded-lg">{success}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-6 shadow-xl shadow-primary/10"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Create Account"}
                </button>
              </form>

              <p className="text-center text-neutral-600 text-[10px] font-black uppercase tracking-[0.2em] mt-8">
                By signing up, you agree to our <span className="text-neutral-400">Terms</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}