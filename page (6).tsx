"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db, type Order, type Product } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, Clock, X, ArrowLeft, Package, Trash2, Eye } from "lucide-react"
import Link from "next/link"

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin-logged-in")
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }

    setOrders(db.getOrders())
    setProducts(db.getProducts())
  }, [router])

  const getProductTitle = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.title : "Unbekanntes Produkt"
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    if (db.updateOrderStatus(orderId, status)) {
      setOrders(db.getOrders())
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

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setOrderDialogOpen(true)
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
        return "Fertig"
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
              <h1 className="text-2xl font-bold text-neon-cyan">BESTELLUNGEN VERWALTEN</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleDeleteLastOrder}
                variant="outline"
                className="border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-gray-900/90 backdrop-blur-sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Letzte Bestellung löschen
              </Button>
              <div className="flex items-center space-x-2">
                <Package className="h-6 w-6 text-neon-green" />
                <span className="text-lg font-bold text-neon-green">{orders.length} Bestellungen</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4">
          <Card className="bg-gray-900/95 border-2 border-neon-purple shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-neon-cyan text-xl">Alle Bestellungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-neon-purple/30">
                      <TableHead className="text-neon-blue font-bold">Bestell-ID</TableHead>
                      <TableHead className="text-neon-blue font-bold">Produkt</TableHead>
                      <TableHead className="text-neon-blue font-bold">E-Mail</TableHead>
                      <TableHead className="text-neon-blue font-bold">Discord Name</TableHead>
                      <TableHead className="text-neon-blue font-bold">Paysafecard Code</TableHead>
                      <TableHead className="text-neon-blue font-bold">Status</TableHead>
                      <TableHead className="text-neon-blue font-bold">Datum</TableHead>
                      <TableHead className="text-neon-blue font-bold">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-b border-neon-purple/20 hover:bg-neon-cyan/10">
                        <TableCell className="font-mono text-white">{order.id}</TableCell>
                        <TableCell className="font-medium text-white">{getProductTitle(order.productId)}</TableCell>
                        <TableCell className="text-white">{order.email}</TableCell>
                        <TableCell className="text-white font-medium">{order.discordName}</TableCell>
                        <TableCell className="font-mono text-white">{order.paysafecardCode}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} font-bold`}>
                            {getStatusText(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {new Date(order.createdAt).toLocaleDateString("de-DE")}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
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
        </div>

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
