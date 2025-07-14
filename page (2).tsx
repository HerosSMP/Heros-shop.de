"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { db, type Product } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Mail, MessageCircle, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    discordName: "",
    paysafecardCode: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  useEffect(() => {
    const productId = params.id as string
    const foundProduct = db.getProduct(productId)
    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      router.push("/")
    }
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (product) {
      db.createOrder({
        productId: product.id,
        email: formData.email,
        discordName: formData.discordName,
        paysafecardCode: formData.paysafecardCode,
      })
      setOrderComplete(true)
    }

    setIsSubmitting(false)
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Produkt wird geladen...</div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900/50 border-neon-green/30 text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-neon-green" />
            </div>
            <CardTitle className="text-2xl font-bold text-neon-green">BESTELLUNG ERFOLGREICH!</CardTitle>
            <CardDescription className="text-white">Ihre Bestellung wurde erfolgreich aufgegeben</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white mb-4">Sie erhalten in Kürze eine Bestätigung per E-Mail und über Discord.</p>
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-neon-blue to-neon-green hover:from-neon-green hover:to-neon-blue text-white font-bold shadow-neon-green transition-all duration-300">
                Zurück zum Shop
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black mb-4 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zum Shop
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(102,179,255,0.5)]">
            CHECKOUT
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Info */}
          <Card className="bg-gray-900/50 border-neon-purple/30">
            <CardHeader>
              <CardTitle className="text-neon-cyan">Ihr Produkt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
                </div>
                <h3 className="text-xl font-bold text-white">{product.title}</h3>
                <p className="text-white">{product.description}</p>
                <div className="text-3xl font-bold text-white">€{product.price.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card className="bg-gray-900/50 border-neon-pink/30">
            <CardHeader>
              <CardTitle className="text-neon-pink">Bestellinformationen</CardTitle>
              <CardDescription className="text-white">
                Füllen Sie alle Felder aus, um Ihre Bestellung abzuschließen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neon-green flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    E-Mail-Adresse
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-gray-800 border-neon-purple/30 text-white focus:border-neon-purple"
                    placeholder="ihre@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discord" className="text-neon-green flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Discord Name
                  </Label>
                  <Input
                    id="discord"
                    value={formData.discordName}
                    onChange={(e) => setFormData({ ...formData, discordName: e.target.value })}
                    className="bg-gray-800 border-neon-purple/30 text-white focus:border-neon-purple"
                    placeholder="IhrDiscordName#1234"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paysafecard" className="text-neon-green flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Paysafecard Code
                  </Label>
                  <Input
                    id="paysafecard"
                    value={formData.paysafecardCode}
                    onChange={(e) => setFormData({ ...formData, paysafecardCode: e.target.value })}
                    className="bg-gray-800 border-neon-purple/30 text-white focus:border-neon-purple"
                    placeholder="1234-5678-9012-3456"
                    required
                  />
                  <p className="text-xs text-white">Wir akzeptieren nur Paysafecard-Zahlungen</p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-neon-blue to-neon-green hover:from-neon-green hover:to-neon-blue text-white font-bold py-3 text-lg shadow-neon-blue hover:shadow-neon-green transition-all duration-300"
                >
                  {isSubmitting ? "Verarbeitung..." : `JETZT KAUFEN - €${product.price.toFixed(2)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
