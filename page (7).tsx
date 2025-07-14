"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db, type Product, type Order } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus,
  Trash2,
  Package,
  ShoppingCart,
  LogOut,
  FileText,
  Edit,
  Check,
  Clock,
  X,
  Eye,
  Upload,
  Users,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  })
  const [editProduct, setEditProduct] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin-logged-in")
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }

    setProducts(db.getProducts())
    setOrders(db.getOrders())
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin-logged-in")
    router.push("/admin")
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    let imageUrl = newProduct.image

    if (imageFile) {
      imageUrl = await handleImageUpload(imageFile)
    }

    db.addProduct({
      title: newProduct.title,
      description: newProduct.description,
      price: Number.parseFloat(newProduct.price),
      image: imageUrl || "/placeholder.svg?height=300&width=300",
    })
    setProducts(db.getProducts())
    setNewProduct({ title: "", description: "", price: "", image: "" })
    setImageFile(null)
    setShowAddProduct(false)
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    let imageUrl = editProduct.image

    if (editImageFile) {
      imageUrl = await handleImageUpload(editImageFile)
    }

    db.updateProduct(editingProduct.id, {
      title: editProduct.title,
      description: editProduct.description,
      price: Number.parseFloat(editProduct.price),
      image: imageUrl,
    })
    setProducts(db.getProducts())
    setEditingProduct(null)
    setEditImageFile(null)
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Sind Sie sicher, dass Sie dieses Produkt löschen möchten?")) {
      db.deleteProduct(id)
      setProducts(db.getProducts())
    }
  }

  const handleDeleteOrder = (id: string) => {
    if (confirm("Sind Sie sicher, dass Sie diese Bestellung löschen möchten?")) {
      db.deleteOrder(id)
      setOrders(db.getOrders())
    }
  }

  const handleDeleteLastOrder = () => {
    if (confirm("Sind Sie sicher, dass Sie die letzte Bestellung löschen möchten?")) {
      if (db.deleteLastOrder()) {
        setOrders(db.getOrders())
        alert("Letzte Bestellung erfolgreich gelöscht!")
      } else {
        alert("Keine Bestellungen zum Löschen vorhanden.")
      }
    }
  }

  const startEditProduct = (product: Product) => {
    setEditingProduct(product)
    setEditProduct({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
    })
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    if (db.updateOrderStatus(orderId, status)) {
      setOrders(db.getOrders())
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setOrderDialogOpen(true)
  }

  const getProductTitle = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.title : "Unbekanntes Produkt"
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "bg-neon-green text-white"
      case "processing":
        return "bg-neon-orange text-white"
      case "rejected":
        return "bg-red-500 text-white"
      default:
        return "bg-neon-yellow text-white"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "Erledigt"
      case "processing":
        return "In Bearbeitung"
      case "rejected":
        return "Abgelehnt"
      default:
        return "Wartend"
    }
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
            <h1 className="text-2xl font-bold text-neon-cyan">ADMIN DASHBOARD</h1>
            <div className="flex items-center space-x-4">
              <Link href="/admin/texts">
                <Button className="bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-pink hover:to-neon-purple text-white font-bold">
                  <FileText className="h-4 w-4 mr-2" />
                  Texte
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-blue hover:to-neon-cyan text-white font-bold">
                  <Users className="h-4 w-4 mr-2" />
                  Benutzer
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-gray-900/90 backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4">
          <Tabs defaultValue="products" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900/95 border-2 border-neon-purple backdrop-blur-md">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-neon-purple data-[state=active]:text-white text-white"
              >
                <Package className="h-4 w-4 mr-2" />
                Produkte ({products.length})
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-neon-blue data-[state=active]:text-white text-white"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Bestellungen ({orders.length})
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card className="bg-gray-900/95 border-2 border-neon-purple shadow-xl backdrop-blur-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-neon-cyan">Produkte verwalten</CardTitle>
                    <Button
                      onClick={() => setShowAddProduct(!showAddProduct)}
                      className="bg-gradient-to-r from-neon-blue to-neon-green hover:from-neon-green hover:to-neon-blue text-white font-bold shadow-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Produkt hinzufügen
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showAddProduct && (
                    <form
                      onSubmit={handleAddProduct}
                      className="mb-6 p-4 border-2 border-neon-green/50 rounded-lg space-y-4 bg-gray-800/90 backdrop-blur-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title" className="text-neon-green font-bold">
                            Titel
                          </Label>
                          <Input
                            id="title"
                            value={newProduct.title}
                            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                            className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="price" className="text-neon-green font-bold">
                            Preis (€)
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-neon-green font-bold">
                          Beschreibung
                        </Label>
                        <Textarea
                          id="description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="image-upload" className="text-neon-green font-bold">
                          Bild hochladen
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="image-url" className="text-neon-green font-bold">
                          Oder Bild URL
                        </Label>
                        <Input
                          id="image-url"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                          className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-neon-blue to-neon-green hover:from-neon-green hover:to-neon-blue text-white shadow-lg"
                        >
                          Hinzufügen
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setShowAddProduct(false)}
                          variant="outline"
                          className="border-2 border-gray-500 text-white bg-gray-800/90"
                        >
                          Abbrechen
                        </Button>
                      </div>
                    </form>
                  )}

                  <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b-2 border-neon-purple/30">
                          <TableHead className="text-neon-cyan font-bold">Bild</TableHead>
                          <TableHead className="text-neon-cyan font-bold">Titel</TableHead>
                          <TableHead className="text-neon-cyan font-bold">Preis</TableHead>
                          <TableHead className="text-neon-cyan font-bold">Aktionen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id} className="border-b border-neon-purple/20 hover:bg-neon-cyan/10">
                            <TableCell>
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.title}
                                width={50}
                                height={50}
                                className="rounded-lg object-cover border border-neon-cyan/50"
                              />
                            </TableCell>
                            <TableCell className="text-white font-medium">{product.title}</TableCell>
                            <TableCell className="text-white font-bold">€{product.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => startEditProduct(product)}
                                  size="sm"
                                  className="bg-neon-blue hover:bg-neon-blue/80 text-white"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  variant="outline"
                                  size="sm"
                                  className="border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-gray-800/90"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="bg-gray-900/95 border-2 border-neon-blue shadow-xl backdrop-blur-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-neon-cyan">Bestellungen verwalten</CardTitle>
                    <Button
                      onClick={handleDeleteLastOrder}
                      variant="outline"
                      className="border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-gray-900/90 backdrop-blur-sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Letzte Bestellung löschen
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b-2 border-neon-blue/30">
                          <TableHead className="text-neon-purple font-bold">Bestell-ID</TableHead>
                          <TableHead className="text-neon-purple font-bold">Produkt</TableHead>
                          <TableHead className="text-neon-purple font-bold">Discord</TableHead>
                          <TableHead className="text-neon-purple font-bold">Status</TableHead>
                          <TableHead className="text-neon-purple font-bold">Datum</TableHead>
                          <TableHead className="text-neon-purple font-bold">Aktionen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id} className="border-b border-neon-blue/20 hover:bg-neon-blue/10">
                            <TableCell className="font-mono text-white">{order.id.slice(-6)}</TableCell>
                            <TableCell className="font-medium text-white">{getProductTitle(order.productId)}</TableCell>
                            <TableCell className="text-white font-medium">{order.discordName}</TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(order.status)} font-bold`}>
                                {getStatusText(order.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white">
                              {new Date(order.createdAt).toLocaleDateString("de-DE")}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button
                                  onClick={() => updateOrderStatus(order.id, "processing")}
                                  size="sm"
                                  className="bg-neon-orange hover:bg-neon-orange/80 text-white"
                                  disabled={order.status === "processing"}
                                  title="In Bearbeitung setzen"
                                >
                                  <Clock className="h-3 w-3" />
                                </Button>
                                <Button
                                  onClick={() => updateOrderStatus(order.id, "completed")}
                                  size="sm"
                                  className="bg-neon-green hover:bg-neon-green/80 text-white"
                                  disabled={order.status === "completed"}
                                  title="Als erledigt markieren"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                  onClick={() => updateOrderStatus(order.id, "rejected")}
                                  size="sm"
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  disabled={order.status === "rejected"}
                                  title="Ablehnen"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  title="Bestellung löschen"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  onClick={() => handleViewOrder(order)}
                                  size="sm"
                                  className="bg-neon-purple hover:bg-neon-purple/80 text-white"
                                  title="Details anzeigen"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {orders.length === 0 && (
                    <div className="text-center py-8 text-white bg-gray-800/90 backdrop-blur-sm rounded-lg">
                      Noch keine Bestellungen vorhanden.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="bg-gray-900/95 border-2 border-neon-purple max-w-2xl backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-neon-cyan">Produkt bearbeiten</DialogTitle>
              <DialogDescription className="text-white">Ändern Sie die Produktinformationen</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title" className="text-neon-green font-bold">
                    Titel
                  </Label>
                  <Input
                    id="edit-title"
                    value={editProduct.title}
                    onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
                    className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price" className="text-neon-green font-bold">
                    Preis (€)
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                    className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description" className="text-neon-green font-bold">
                  Beschreibung
                </Label>
                <Textarea
                  id="edit-description"
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-image-upload" className="text-neon-green font-bold">
                  Neues Bild hochladen
                </Label>
                <Input
                  id="edit-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                  className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-image-url" className="text-neon-green font-bold">
                  Oder Bild URL
                </Label>
                <Input
                  id="edit-image-url"
                  value={editProduct.image}
                  onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                  className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-neon-blue to-neon-green hover:from-neon-green hover:to-neon-blue text-white shadow-lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Speichern
                </Button>
                <Button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  variant="outline"
                  className="border-2 border-gray-500 text-white bg-gray-800/90"
                >
                  Abbrechen
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Order Details Dialog */}
        <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
          <DialogContent className="bg-gray-900/95 border-2 border-neon-purple backdrop-blur-md max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-neon-cyan">Bestelldetails</DialogTitle>
              <DialogDescription className="text-white">Vollständige Informationen zur Bestellung</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-neon-green font-bold">Bestell-ID:</Label>
                    <p className="text-white font-mono">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <Label className="text-neon-green font-bold">Produkt:</Label>
                    <p className="text-white">{getProductTitle(selectedOrder.productId)}</p>
                  </div>
                  <div>
                    <Label className="text-neon-green font-bold">E-Mail:</Label>
                    <p className="text-white">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <Label className="text-neon-green font-bold">Discord Name:</Label>
                    <p className="text-white font-medium">{selectedOrder.discordName}</p>
                  </div>
                  <div>
                    <Label className="text-neon-green font-bold">Paysafecard Code:</Label>
                    <p className="text-white font-mono bg-gray-800 p-2 rounded">{selectedOrder.paysafecardCode}</p>
                  </div>
                  <div>
                    <Label className="text-neon-green font-bold">Status:</Label>
                    <Badge className={`${getStatusColor(selectedOrder.status)} font-bold`}>
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-neon-green font-bold">Bestelldatum:</Label>
                    <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleString("de-DE")}</p>
                  </div>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "completed")
                      setOrderDialogOpen(false)
                    }}
                    className="bg-neon-green hover:bg-neon-green/80 text-white"
                    disabled={selectedOrder.status === "completed"}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Akzeptieren
                  </Button>
                  <Button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "rejected")
                      setOrderDialogOpen(false)
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    disabled={selectedOrder.status === "rejected"}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Ablehnen
                  </Button>
                  <Button
                    onClick={() => setOrderDialogOpen(false)}
                    variant="outline"
                    className="border-2 border-gray-500 text-white bg-gray-800/90"
                  >
                    Schließen
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
