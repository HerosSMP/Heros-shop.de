"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Zap } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const user = db.validateAdmin(username, password)
    if (user) {
      localStorage.setItem("admin-logged-in", "true")
      localStorage.setItem("admin-user", JSON.stringify(user))
      router.push("/admin/dashboard")
    } else {
      setError("Ungültige Anmeldedaten")
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background with Heros Staff Logo */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('/images/heros-staff-logo.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <Card className="w-full max-w-md bg-gray-900/95 border-2 border-neon-blue backdrop-blur-md shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-neon-blue drop-shadow-lg" />
          </div>
          <CardTitle className="text-2xl font-bold text-neon-cyan">ADMIN LOGIN</CardTitle>
          <CardDescription className="text-white font-medium">
            Melden Sie sich im Administrator-Panel an
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-neon-green font-bold">
                Benutzername
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 border-2 border-neon-purple/30 text-white focus:border-neon-purple"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-neon-green font-bold">
                Passwort
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-2 border-neon-purple/30 text-white focus:border-neon-purple"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-neon-blue to-neon-green hover:from-neon-green hover:to-neon-blue text-white font-bold shadow-lg transition-all duration-300"
            >
              <Zap className="h-4 w-4 mr-2" />
              ANMELDEN
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-white font-medium">Standard: admin / admin123</div>
        </CardContent>
      </Card>
    </div>
  )
}
