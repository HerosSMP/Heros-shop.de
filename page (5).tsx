"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db, type SiteText } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, FileText } from "lucide-react"
import Link from "next/link"

export default function AdminTexts() {
  const [siteTexts, setSiteTexts] = useState<SiteText[]>([])
  const [editingTexts, setEditingTexts] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin-logged-in")
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }

    const texts = db.getSiteTexts()
    setSiteTexts(texts)

    // Initialize editing texts
    const initialTexts: { [key: string]: string } = {}
    texts.forEach((text) => {
      initialTexts[text.key] = text.value
    })
    setEditingTexts(initialTexts)
  }, [router])

  const handleSave = () => {
    Object.keys(editingTexts).forEach((key) => {
      db.updateSiteText(key, editingTexts[key])
    })

    // Refresh the texts
    const texts = db.getSiteTexts()
    setSiteTexts(texts)

    alert("Texte erfolgreich gespeichert!")
  }

  const handleTextChange = (key: string, value: string) => {
    setEditingTexts((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="min-h-screen relative">
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
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b-2 border-neon-pink bg-gray-900/95 backdrop-blur-md p-4 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button
                  variant="outline"
                  className="border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-white bg-gray-900/90 backdrop-blur-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-neon-cyan">TEXTE VERWALTEN</h1>
            </div>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-neon-green to-neon-blue hover:from-neon-blue hover:to-neon-green text-white font-bold shadow-lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Alle Speichern
            </Button>
          </div>
        </header>

        <div className="container mx-auto p-4">
          <Card className="bg-gray-900/95 border-2 border-neon-purple shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-neon-cyan text-xl flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Website-Texte bearbeiten
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {siteTexts.map((text) => (
                <div
                  key={text.id}
                  className="p-4 border-2 border-neon-cyan/30 rounded-lg bg-gray-800/90 backdrop-blur-sm"
                >
                  <Label htmlFor={text.key} className="text-neon-green font-bold text-lg">
                    {text.description}
                  </Label>
                  <p className="text-sm text-white mb-2">Schlüssel: {text.key}</p>
                  {text.key.includes("description") || text.key.includes("text") ? (
                    <Textarea
                      id={text.key}
                      value={editingTexts[text.key] || ""}
                      onChange={(e) => handleTextChange(text.key, e.target.value)}
                      className="bg-gray-700 border-2 border-neon-purple/30 text-white min-h-[100px]"
                      placeholder={text.value}
                    />
                  ) : (
                    <Input
                      id={text.key}
                      value={editingTexts[text.key] || ""}
                      onChange={(e) => handleTextChange(text.key, e.target.value)}
                      className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                      placeholder={text.value}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
