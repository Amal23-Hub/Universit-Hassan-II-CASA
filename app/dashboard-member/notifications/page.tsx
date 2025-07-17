"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { 
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Filter,
  Search,
  Download
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Notification {
  id: string
  projectId: string
  projectTitle: string
  action: "approved" | "rejected" | "under_review" | "pending"
  date: string
  comments?: string
  status: string
  read: boolean
  priority: "high" | "medium" | "low"
}

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  // Données des notifications (simulation)
  const [notifications] = useState<Notification[]>([
    {
      id: "notif_001",
      projectId: "PR001",
      projectTitle: "Développement d'algorithmes d'IA pour l'éducation",
      action: "approved",
      date: "2024-01-15T10:30:00Z",
      comments: "Excellent projet, approuvé avec quelques modifications mineures. Veuillez contacter l'administration pour les prochaines étapes.",
      status: "APPROUVÉ",
      read: false,
      priority: "high"
    },
    {
      id: "notif_002",
      projectId: "PR002",
      projectTitle: "Systèmes d'IA pour la santé préventive",
      action: "rejected",
      date: "2024-01-14T14:20:00Z",
      comments: "Le projet nécessite des clarifications sur la méthodologie et le budget. Veuillez soumettre une version révisée.",
      status: "REJETÉ",
      read: true,
      priority: "high"
    },
    {
      id: "notif_003",
      projectId: "PR003",
      projectTitle: "IA pour l'optimisation énergétique",
      action: "under_review",
      date: "2024-01-13T09:15:00Z",
      comments: "Votre projet est en cours d'évaluation par le comité scientifique.",
      status: "EN RÉVISION",
      read: false,
      priority: "medium"
    },
    {
      id: "notif_004",
      projectId: "PR004",
      projectTitle: "Intelligence artificielle pour la cybersécurité",
      action: "pending",
      date: "2024-01-12T16:45:00Z",
      comments: "Votre projet a été reçu et sera évalué dans les prochains jours.",
      status: "EN ATTENTE",
      read: true,
      priority: "low"
    },
    {
      id: "notif_005",
      projectId: "PR005",
      projectTitle: "IA pour l'agriculture intelligente",
      action: "approved",
      date: "2024-01-11T11:30:00Z",
      comments: "Projet approuvé. Félicitations !",
      status: "APPROUVÉ",
      read: true,
      priority: "medium"
    }
  ])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (action: Notification["action"]) => {
    const statusConfig = {
      approved: { label: "Approuvé", color: "bg-green-100 text-green-800 border-green-200" },
      rejected: { label: "Rejeté", color: "bg-red-100 text-red-800 border-red-200" },
      under_review: { label: "En révision", color: "bg-blue-100 text-blue-800 border-blue-200" },
      pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
    }
    const config = statusConfig[action]
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: Notification["priority"]) => {
    const priorityConfig = {
      high: { label: "Haute", color: "bg-red-100 text-red-800 border-red-200" },
      medium: { label: "Moyenne", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      low: { label: "Basse", color: "bg-green-100 text-green-800 border-green-200" }
    }
    const config = priorityConfig[priority]
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getActionIcon = (action: Notification["action"]) => {
    switch (action) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "under_review":
        return <Eye className="h-5 w-5 text-blue-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.projectId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || notification.action === statusFilter
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const approvedCount = notifications.filter(n => n.action === "approved").length
  const rejectedCount = notifications.filter(n => n.action === "rejected").length
  const pendingCount = notifications.filter(n => n.action === "pending" || n.action === "under_review").length

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Suivez les mises à jour de vos projets de recherche</p>
            </div>

            {/* Statistiques des notifications */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Non lues</p>
                      <p className="text-lg font-bold text-gray-900">{unreadCount}</p>
                    </div>
                    <Bell className="h-6 w-6 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Approuvés</p>
                      <p className="text-lg font-bold text-gray-900">{approvedCount}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Rejetés</p>
                      <p className="text-lg font-bold text-gray-900">{rejectedCount}</p>
                    </div>
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">En cours</p>
                      <p className="text-lg font-bold text-gray-900">{pendingCount}</p>
                    </div>
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtres */}
            <Card className="mb-6 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher par titre ou ID de projet..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="approved">Approuvés</SelectItem>
                        <SelectItem value="rejected">Rejetés</SelectItem>
                        <SelectItem value="under_review">En révision</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="low">Basse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des notifications */}
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    {notifications.length === 0 
                      ? "Vous n'avez pas encore reçu de notifications."
                      : "Aucune notification ne correspond à vos critères de recherche."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card key={notification.id} className={`hover:shadow-md transition-all duration-300 ${
                    !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : 'border border-gray-200'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-2 rounded-full ${
                            !notification.read ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            {getActionIcon(notification.action)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-gray-900">
                                {notification.projectTitle}
                              </h3>
                              {!notification.read && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600">ID: {notification.projectId}</span>
                              {getStatusBadge(notification.action)}
                              {getPriorityBadge(notification.priority)}
                            </div>
                            {notification.comments && (
                              <p className="text-sm text-gray-700 mb-2">
                                {notification.comments}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              {formatDate(notification.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {notification.action === "approved" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Télécharger
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600 hover:text-gray-700 border-gray-300 hover:bg-gray-50"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 