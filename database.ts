export interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  createdAt: string
}

export interface Order {
  id: string
  productId: string
  email: string
  discordName: string
  paysafecardCode: string
  status: "pending" | "processing" | "completed" | "rejected"
  createdAt: string
}

export interface SiteText {
  id: string
  key: string
  value: string
  description: string
}

// Add User interface after the SiteText interface
export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "user"
  email: string
  createdAt: string
  lastLogin?: string
}

class Database {
  private products: Product[] = []
  private orders: Order[] = []
  private siteTexts: SiteText[] = []
  // In the Database class, add users array after siteTexts
  private users: User[] = []
  private adminCredentials = { username: "admin", password: "admin123" }

  constructor() {
    this.loadFromStorage()
    this.initializeDefaultProducts()
    this.initializeDefaultTexts()
    // In the constructor, add user initialization
    this.initializeDefaultUsers()
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const products = localStorage.getItem("minecraft-shop-products")
      const orders = localStorage.getItem("minecraft-shop-orders")
      const siteTexts = localStorage.getItem("minecraft-shop-texts")
      // In loadFromStorage method, add users loading
      const users = localStorage.getItem("minecraft-shop-users")

      if (products) this.products = JSON.parse(products)
      if (orders) this.orders = JSON.parse(orders)
      if (siteTexts) this.siteTexts = JSON.parse(siteTexts)
      if (users) this.users = JSON.parse(users)
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("minecraft-shop-products", JSON.stringify(this.products))
      localStorage.setItem("minecraft-shop-orders", JSON.stringify(this.orders))
      localStorage.setItem("minecraft-shop-texts", JSON.stringify(this.siteTexts))
      // In saveToStorage method, add users saving
      localStorage.setItem("minecraft-shop-users", JSON.stringify(this.users))
    }
  }

  private initializeDefaultProducts() {
    if (this.products.length === 0) {
      this.products = [
        {
          id: "1",
          title: "VIP Rang",
          description: "Erhalte VIP-Status auf unserem Minecraft Server mit exklusiven Vorteilen",
          price: 9.99,
          image: "/placeholder.svg?height=300&width=300",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Premium Kit",
          description: "Starter-Kit mit wertvollen Items für deinen Minecraft-Start",
          price: 4.99,
          image: "/placeholder.svg?height=300&width=300",
          createdAt: new Date().toISOString(),
        },
      ]
      this.saveToStorage()
    }
  }

  private initializeDefaultTexts() {
    if (this.siteTexts.length === 0) {
      this.siteTexts = [
        {
          id: "1",
          key: "site_title",
          value: "MINECRAFT SHOP",
          description: "Haupttitel der Website",
        },
        {
          id: "2",
          key: "hero_title",
          value: "MINECRAFT SERVER SHOP",
          description: "Hero-Bereich Titel",
        },
        {
          id: "3",
          key: "hero_description",
          value: "Entdecke exklusive Minecraft Server Items und Ränge. Bezahlung nur mit Paysafecard!",
          description: "Hero-Bereich Beschreibung",
        },
        {
          id: "4",
          key: "products_title",
          value: "UNSERE ARTIKEL",
          description: "Produkte-Bereich Titel",
        },
        {
          id: "5",
          key: "footer_text",
          value: "© 2024 Minecraft Shop. Alle Rechte vorbehalten. Nur Paysafecard-Zahlungen akzeptiert.",
          description: "Footer Text",
        },
      ]
      this.saveToStorage()
    }
  }

  // Add initializeDefaultUsers method after initializeDefaultTexts
  private initializeDefaultUsers() {
    if (this.users.length === 0) {
      this.users = [
        {
          id: "1",
          username: "admin",
          password: "admin123", // In production, this should be hashed
          role: "admin",
          email: "admin@example.com",
          createdAt: new Date().toISOString(),
        },
      ]
      this.saveToStorage()
    }
  }

  // Product methods
  getProducts(): Product[] {
    return this.products
  }

  getProduct(id: string): Product | undefined {
    return this.products.find((p) => p.id === id)
  }

  addProduct(product: Omit<Product, "id" | "createdAt">): Product {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    this.products.push(newProduct)
    this.saveToStorage()
    return newProduct
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex((p) => p.id === id)
    if (index > -1) {
      this.products.splice(index, 1)
      this.saveToStorage()
      return true
    }
    return false
  }

  updateProduct(id: string, product: Omit<Product, "id" | "createdAt">): boolean {
    const index = this.products.findIndex((p) => p.id === id)
    if (index > -1) {
      this.products[index] = {
        ...this.products[index],
        ...product,
      }
      this.saveToStorage()
      return true
    }
    return false
  }

  // Order methods
  createOrder(order: Omit<Order, "id" | "createdAt" | "status">): Order {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    this.orders.push(newOrder)
    this.saveToStorage()
    return newOrder
  }

  getOrders(): Order[] {
    return this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  updateOrderStatus(id: string, status: Order["status"]): boolean {
    const order = this.orders.find((o) => o.id === id)
    if (order) {
      order.status = status
      this.saveToStorage()
      return true
    }
    return false
  }

  deleteOrder(id: string): boolean {
    const index = this.orders.findIndex((o) => o.id === id)
    if (index > -1) {
      this.orders.splice(index, 1)
      this.saveToStorage()
      return true
    }
    return false
  }

  deleteLastOrder(): boolean {
    if (this.orders.length > 0) {
      // Sort orders by creation date (newest first) and remove the first one
      const sortedOrders = this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      const lastOrderId = sortedOrders[0].id
      return this.deleteOrder(lastOrderId)
    }
    return false
  }

  // Text methods
  getSiteTexts(): SiteText[] {
    return this.siteTexts
  }

  getSiteText(key: string): string {
    const text = this.siteTexts.find((t) => t.key === key)
    return text ? text.value : key
  }

  updateSiteText(key: string, value: string): boolean {
    const text = this.siteTexts.find((t) => t.key === key)
    if (text) {
      text.value = value
      this.saveToStorage()
      return true
    }
    return false
  }

  // Replace the validateAdmin method
  validateAdmin(username: string, password: string): User | null {
    const user = this.users.find((u) => u.username === username && u.password === password && u.role === "admin")
    if (user) {
      user.lastLogin = new Date().toISOString()
      this.saveToStorage()
      return user
    }
    return null
  }

  convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Add user management methods at the end of the class
  getUsers(): User[] {
    return this.users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getUser(id: string): User | undefined {
    return this.users.find((u) => u.id === id)
  }

  addUser(user: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    this.users.push(newUser)
    this.saveToStorage()
    return newUser
  }

  updateUser(id: string, user: Partial<Omit<User, "id" | "createdAt">>): boolean {
    const index = this.users.findIndex((u) => u.id === id)
    if (index > -1) {
      this.users[index] = {
        ...this.users[index],
        ...user,
      }
      this.saveToStorage()
      return true
    }
    return false
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id)
    if (index > -1) {
      this.users.splice(index, 1)
      this.saveToStorage()
      return true
    }
    return false
  }

  checkUsernameExists(username: string, excludeId?: string): boolean {
    return this.users.some((u) => u.username === username && u.id !== excludeId)
  }

  checkEmailExists(email: string, excludeId?: string): boolean {
    return this.users.some((u) => u.email === email && u.id !== excludeId)
  }
}

export const db = new Database()
