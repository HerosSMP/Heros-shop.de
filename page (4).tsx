"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db, type User } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ArrowLeft, Users, Edit, Shield, Mail, Calendar, Clock } from "lucide-react"
import Link from "next/link"

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "admin" as "admin" | "user",
  })
  const [editUser, setEditUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "admin" as "admin" | "user",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin-logged-in")
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }

    setUsers(db.getUsers())
  }, [router])

  const validateForm = (userData: typeof newUser, isEdit = false, userId?: string) => {
    const newErrors: { [key: string]: string } = {}

    if (!userData.username.trim()) {
      newErrors.username = "Benutzername ist erforderlich"
    } else if (userData.username.length < 3) {
      newErrors.username = "Benutzername muss mindestens 3 Zeichen lang sein"
    } else if (db.checkUsernameExists(userData.username, isEdit ? userId : undefined)) {
      newErrors.username = "Benutzername bereits vergeben"
    }

    if (!userData.email.trim()) {
      newErrors.email = "E-Mail ist erforderlich"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = "Ungültige E-Mail-Adresse"
    } else if (db.checkEmailExists(userData.email, isEdit ? userId : undefined)) {
      newErrors.email = "E-Mail bereits vergeben"
    }

    if (!userData.password.trim()) {
      newErrors.password = "Passwort ist erforderlich"
    } else if (userData.password.length < 6) {
      newErrors.password = "Passwort muss mindestens 6 Zeichen lang sein"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm(newUser)) {
      return
    }

    db.addUser({
      username: newUser.username,
      password: newUser.password,
      email: newUser.email,
      role: newUser.role,
    })

    setUsers(db.getUsers())
    setNewUser({ username: "", password: "", email: "", role: "admin" })
    setErrors({})
    setShowAddUser(false)
    alert("Benutzer erfolgreich hinzugefügt!")
  }

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    if (!validateForm(editUser, true, editingUser.id)) {
      return
    }

    db.updateUser(editingUser.id, {
      username: editUser.username,
      password: editUser.password,
      email: editUser.email,
      role: editUser.role,
    })

    setUsers(db.getUsers())
    setEditingUser(null)
    setErrors({})
    alert("Benutzer erfolgreich aktualisiert!")
  }

  const handleDeleteUser = (id: string) => {
    const user = users.find((u) => u.id === id)
    if (!user) return

    // Prevent deleting the last admin
    const adminCount = users.filter((u) => u.role === "admin").length
    if (user.role === "admin" && adminCount <= 1) {
      alert("Der letzte Administrator kann nicht gelöscht werden!")
      return
    }

    if (confirm(`Sind Sie sicher, dass Sie den Benutzer "${user.username}" löschen möchten?`)) {
      db.deleteUser(id)
      setUsers(db.getUsers())
      alert("Benutzer erfolgreich gelöscht!")
    }
  }

  const startEditUser = (user: User) => {
    setEditingUser(user)
    setEditUser({
      username: user.username,
      password: user.password,
      email: user.email,
      role: user.role,
    })
    setErrors({})
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setUserDialogOpen(true)
  }

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-neon-purple text-white"
      default:
        return "bg-neon-blue text-white"
    }
  }

  const getRoleText = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "Administrator"
      default:
        return "Benutzer"
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
              <h1 className="text-2xl font-bold text-neon-cyan">BENUTZER VERWALTEN</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowAddUser(!showAddUser)}
                className="bg-gradient-to-r from-neon-green to-neon-blue hover:from-neon-blue hover:to-neon-green text-white font-bold shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Benutzer hinzufügen
              </Button>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-neon-green" />
                <span className="text-lg font-bold text-neon-green">{users.length} Benutzer</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4">
          <Card className="bg-gray-900/95 border-2 border-neon-purple shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-neon-cyan text-xl flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                Alle Benutzer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showAddUser && (
                <form
                  onSubmit={handleAddUser}
                  className="mb-6 p-4 border-2 border-neon-green/50 rounded-lg space-y-4 bg-gray-800/90 backdrop-blur-sm"
                >
                  <h3 className="text-neon-green font-bold text-lg">Neuen Benutzer hinzufügen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username" className="text-neon-green font-bold">
                        Benutzername *
                      </Label>
                      <Input
                        id="username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                        placeholder="admin2"
                      />
                      {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-neon-green font-bold">
                        E-Mail *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                        placeholder="admin@example.com"
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-neon-green font-bold">
                        Passwort *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                        placeholder="Mindestens 6 Zeichen"
                      />
                      {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div>
                      <Label htmlFor="role" className="text-neon-green font-bold">
                        Rolle
                      </Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: "admin" | "user") => setNewUser({ ...newUser, role: value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-2 border-neon-purple/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-neon-purple text-white">
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="user">Benutzer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-neon-blue to-neon-green hover:from-neon-green hover:to-neon-blue text-white shadow-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Hinzufügen
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowAddUser(false)
                        setErrors({})
                        setNewUser({ username: "", password: "", email: "", role: "admin" })
                      }}
                      variant="outline"
                      className="border-2 border-gray-500 text-white bg-gray-800/90"
                    >
                      Abbrechen
                    </Button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-neon-purple/30">
                      <TableHead className="text-neon-blue font-bold">Benutzername</TableHead>
                      <TableHead className="text-neon-blue font-bold">E-Mail</TableHead>
                      <TableHead className="text-neon-blue font-bold">Rolle</TableHead>
                      <TableHead className="text-neon-blue font-bold">Erstellt</TableHead>
                      <TableHead className="text-neon-blue font-bold">Letzter Login</TableHead>
                      <TableHead className="text-neon-blue font-bold">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-b border-neon-purple/20 hover:bg-neon-cyan/10">
                        <TableCell className="font-medium text-white">{user.username}</TableCell>
                        <TableCell className="text-white">{user.email}</TableCell>
                        <TableCell>
                          <Badge className={`${getRoleColor(user.role)} font-bold`}>{getRoleText(user.role)}</Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {new Date(user.createdAt).toLocaleDateString("de-DE")}
                        </TableCell>
                        <TableCell className="text-white">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("de-DE") : "Nie"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleViewUser(user)}
                              size="sm"
                              className="bg-neon-purple hover:bg-neon-purple/80 text-white"
                              title="Details anzeigen"
                            >
                              <Shield className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => startEditUser(user)}
                              size="sm"
                              className="bg-neon-blue hover:bg-neon-blue/80 text-white"
                              title="Bearbeiten"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteUser(user.id)}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              title="Löschen"
                              disabled={user.role === "admin" && users.filter((u) => u.role === "admin").length <= 1}
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
              {users.length === 0 && (
                <div className="text-center py-8 text-white bg-gray-800/90 backdrop-blur-sm rounded-lg">
                  Noch keine Benutzer vorhanden.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="bg-gray-900/95 border-2 border-neon-purple max-w-2xl backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-neon-cyan">Benutzer bearbeiten</DialogTitle>
              <DialogDescription className="text-white">Ändern Sie die Benutzerinformationen</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-username" className="text-neon-green font-bold">
                    Benutzername *
                  </Label>
                  <Input
                    id="edit-username"
                    value={editUser.username}
                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                    className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                  />
                  {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-email" className="text-neon-green font-bold">
                    E-Mail *
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-password" className="text-neon-green font-bold">
                    Neues Passwort *
                  </Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={editUser.password}
                    onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                    className="bg-gray-700 border-2 border-neon-purple/30 text-white"
                  />
                  {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-role" className="text-neon-green font-bold">
                    Rolle
                  </Label>
                  <Select
                    value={editUser.role}
                    onValueChange={(value: "admin" | "user") => setEditUser({ ...editUser, role: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-2 border-neon-purple/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-neon-purple text-white">
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="user">Benutzer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-neon-blue to-neon-green hover:from-neon-green hover:to-neon-blue text-white shadow-lg"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Speichern
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setEditingUser(null)
                    setErrors({})
                  }}
                  variant="outline"
                  className="border-2 border-gray-500 text-white bg-gray-800/90"
                >
                  Abbrechen
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* User Details Dialog */}
        <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
          <DialogContent className="bg-gray-900/95 border-2 border-neon-purple backdrop-blur-md max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-neon-cyan">Benutzerdetails</DialogTitle>
              <DialogDescription className="text-white">Vollständige Informationen zum Benutzer</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-neon-green font-bold flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Benutzername:
                    </Label>
                    <p className="text-white font-medium">{selectedUser.username}</p>
                  </div>
                  <div>
                    <Label className="text-neon-green font-bold flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      E-Mail:
                    </Label>
                    <p className="text-white">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-neon-green font-bold">Rolle:</Label>
                    <Badge className={`${getRoleColor(selectedUser.role)} font-bold`}>
                      {getRoleText(selectedUser.role)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-neon-green font-bold">Benutzer-ID:</Label>
                    <p className="text-white font-mono">{selectedUser.id}</p>
                  </div>
                  <div>
                    <Label className="text-neon-green font-bold flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Erstellt am:
                    </Label>
                    <p className="text-white">{new Date(selectedUser.createdAt).toLocaleString("de-DE")}</p>
                  </div>
                  <div>
                    <Label className="text-neon-green font-bold flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Letzter Login:
                    </Label>
                    <p className="text-white">
                      {selectedUser.lastLogin
                        ? new Date(selectedUser.lastLogin).toLocaleString("de-DE")
                        : "Noch nie angemeldet"}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={() => {
                      setUserDialogOpen(false)
                      startEditUser(selectedUser)
                    }}
                    className="bg-neon-blue hover:bg-neon-blue/80 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                  <Button
                    onClick={() => setUserDialogOpen(false)}
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
