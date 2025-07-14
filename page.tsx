"use client"

import { useState, useEffect } from "react"
import { db, type Product } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Zap, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [siteTitle, setSiteTitle] = useState("")
  const [heroTitle, setHeroTitle] = useState("")
  const [heroDescription, setHeroDescription] = useState("")
  const [productsTitle, setProductsTitle] = useState("")
  const [footerText, setFooterText] = useState("")

  useEffect(() => {
    setProducts(db.getProducts())
    setSiteTitle(db.getSiteText("site_title"))
    setHeroTitle(db.getSiteText("hero_title"))
    setHeroDescription(db.getSiteText("hero_description"))
    setProductsTitle(db.getSiteText("products_title"))
    setFooterText(db.getSiteText("footer_text"))
  }, [])

  return (
    <div className="min-h-screen relative">
      {/* Background with Heros Logo */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('/images/heros-logo.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b-2 border-neon-pink bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-neon-pink" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent drop-shadow-lg">
                  {siteTitle}
                </h1>
              </div>
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-white bg-gray-900/90 font-bold backdrop-blur-sm"
                >
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 text-center relative">
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
          <div className="container mx-auto relative z-10">
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent drop-shadow-2xl">
              {heroTitle}
            </h2>
            <div className="bg-gray-900/90 backdrop-blur-md rounded-lg p-6 shadow-2xl max-w-2xl mx-auto mb-8">
              <p className="text-xl text-white font-bold">{heroDescription}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <Star className="h-8 w-8 text-neon-yellow drop-shadow-lg" />
              <Star className="h-8 w-8 text-neon-yellow drop-shadow-lg" />
              <Star className="h-8 w-8 text-neon-yellow drop-shadow-lg" />
              <Star className="h-8 w-8 text-neon-yellow drop-shadow-lg" />
              <Star className="h-8 w-8 text-neon-yellow drop-shadow-lg" />
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
          <div className="container mx-auto relative z-10">
            <div className="bg-gray-900/90 backdrop-blur-md rounded-lg p-6 shadow-2xl mb-12 inline-block">
              <h3 className="text-4xl font-bold text-white drop-shadow-lg">{productsTitle}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="bg-gray-900/95 border-2 border-neon-purple hover:border-neon-pink hover:shadow-neon-pink hover:shadow-xl transition-all duration-300 backdrop-blur-md"
                >
                  <CardHeader>
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden border-2 border-neon-cyan/50">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardTitle className="text-white text-xl">{product.title}</CardTitle>
                    <CardDescription className="text-white font-medium">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-white">€{product.price.toFixed(2)}</span>
                      <Link href={`/checkout/${product.id}`}>
                        <Button className="bg-gradient-to-r from-neon-blue to-neon-green hover:from-neon-green hover:to-neon-blue text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          KAUFEN
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900/95 border-t-2 border-neon-cyan py-8 backdrop-blur-md">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white font-medium">{footerText}</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
