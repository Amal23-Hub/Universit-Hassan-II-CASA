"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { username, password })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Image
              src="https://nibras.univh2c.ma/nibras_stsm/uh2c_logo_oth.jpg"
              alt="UH2C Logo"
              width={200}
              height={80}
              className="mx-auto rounded-lg"
            />
          </div>

          {/* Login Card */}
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Connexion</CardTitle>
              <CardDescription className="text-gray-600">Accédez à votre espace de recherche UH2C</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Nom d'utilisateur
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Entrez votre nom d'utilisateur"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-uh2c-blue focus:ring-uh2c-blue"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-uh2c-blue focus:ring-uh2c-blue"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-uh2c-blue focus:ring-uh2c-blue border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-uh2c-blue hover:text-uh2c-blue/80">
                      Mot de passe oublié?
                    </a>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white font-medium">
                  Se connecter
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Besoin d'aide?{" "}
                  <a href="#" className="font-medium text-uh2c-blue hover:text-uh2c-blue/80">
                    Contactez le support
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Background Image */}
      <div className="hidden lg:block lg:flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://tt0uih3hjztijmjb.public.blob.vercel-storage.com/alexsys/uh2c/recherche-img.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h1 className="text-4xl font-bold mb-4">Plateforme de Recherche UH2C</h1>
              <p className="text-xl opacity-90">
                Gérez vos projets de recherche, publications et collaborations scientifiques
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
