"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Clock, CheckCircle, XCircle, Search, Filter, Eye, Edit, DollarSign, Calendar, TrendingUp, AlertTriangle, FileText, Users, ArrowUpDown } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface ProjetSoumis {
  id: string
  titre: string
  description: string
  statut: "en_attente" | "en_evaluation" | "approuve" | "rejete"
  dateSoumission: string
  dateLimite: string
  programme: string
  budgetDemande: number
  duree: string
  commentaires?: string
  priorite?: "basse" | "moyenne" | "haute"
  membres?: number
  documents?: number
}

const projetsSoumis: ProjetSoumis[] = [
  {
    id: "PS001",
    titre: "Développement d'un système de surveillance environnementale intelligent",
    description: "Projet visant à créer un système IoT pour la surveillance en temps réel de la qualité de l'air et de l'eau",
    statut: "en_evaluation",
    dateSoumission: "2024-02-15",
    dateLimite: "2024-04-15",
    programme: "Programme National de Recherche en IA",
    budgetDemande: 180000,
    duree: "24 mois",
    commentaires: "Projet en cours d'évaluation par le comité scientifique",
    priorite: "haute",
    membres: 5,
    documents: 8
  },
  {
    id: "PS002",
    titre: "Étude comparative des méthodes d'enseignement en ligne",
    description: "Analyse comparative de l'efficacité des différentes plateformes d'enseignement à distance",
    statut: "en_attente",
    dateSoumission: "2024-03-01",
    dateLimite: "2024-05-01",
    programme: "Programme de Recherche en Éducation",
    budgetDemande: 95000,
    duree: "18 mois",
    priorite: "moyenne",
    membres: 3,
    documents: 5
  },
  {
    id: "PS003",
    titre: "Optimisation des algorithmes de machine learning pour la finance",
    description: "Développement d'algorithmes prédictifs pour l'analyse des marchés financiers",
    statut: "approuve",
    dateSoumission: "2024-01-10",
    dateLimite: "2024-03-10",
    programme: "Programme de Recherche en Finance",
    budgetDemande: 220000,
    duree: "30 mois",
    commentaires: "Projet approuvé avec modifications mineures",
    priorite: "haute",
    membres: 7,
    documents: 12
  },
  {
    id: "PS004",
    titre: "Impact du changement climatique sur l'agriculture marocaine",
    description: "Étude des effets du changement climatique sur les rendements agricoles et adaptation des pratiques",
    statut: "en_attente",
    dateSoumission: "2024-03-10",
    dateLimite: "2024-06-10",
    programme: "Programme de Recherche Environnementale",
    budgetDemande: 150000,
    duree: "36 mois",
    priorite: "basse",
    membres: 4,
    documents: 6
  }
]

export default function ProjetsSoumis() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [programmeFilter, setProgrammeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("dateSoumission")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const getDaysRemaining = (dateLimite: string) => {
    const today = new Date()
    const limite = new Date(dateLimite)
    const diffTime = limite.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusInfo = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return { label: "En attente", color: "bg-gray-100 text-gray-800", icon: Clock }
      case "en_evaluation":
        return { label: "En évaluation", color: "bg-gray-100 text-gray-800", icon: Send }
      case "approuve":
        return { label: "Approuvé", color: "bg-gray-100 text-gray-800", icon: CheckCircle }
      case "rejete":
        return { label: "Rejeté", color: "bg-gray-100 text-gray-800", icon: XCircle }
      default:
        return { label: "Inconnu", color: "bg-gray-100 text-gray-800", icon: Clock }
    }
  }

  const getPriorityInfo = (priorite?: string) => {
    switch (priorite) {
      case "haute":
        return { label: "Haute", color: "bg-gray-100 text-gray-800" }
      case "moyenne":
        return { label: "Moyenne", color: "bg-gray-100 text-gray-800" }
      case "basse":
        return { label: "Basse", color: "bg-gray-100 text-gray-800" }
      default:
        return { label: "Non définie", color: "bg-gray-100 text-gray-800" }
    }
  }

  // Statistiques
  const stats = {
    total: projetsSoumis.length,
    enAttente: projetsSoumis.filter(p => p.statut === "en_attente").length,
    enEvaluation: projetsSoumis.filter(p => p.statut === "en_evaluation").length,
    approuves: projetsSoumis.filter(p => p.statut === "approuve").length,
    rejetes: projetsSoumis.filter(p => p.statut === "rejete").length,
    budgetTotal: projetsSoumis.reduce((sum, p) => sum + p.budgetDemande, 0),
    urgent: projetsSoumis.filter(p => {
      const daysRemaining = getDaysRemaining(p.dateLimite)
      return (p.statut === "en_attente" || p.statut === "en_evaluation") && daysRemaining < 7
    }).length
  }

  const filteredProjets = projetsSoumis
    .filter(projet => {
      const matchesSearch = projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           projet.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || projet.statut === statusFilter
      const matchesProgramme = programmeFilter === "all" || projet.programme === programmeFilter
      
      return matchesSearch && matchesStatus && matchesProgramme
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof ProjetSoumis]
      let bValue: any = b[sortBy as keyof ProjetSoumis]
      
      if (sortBy === "dateSoumission" || sortBy === "dateLimite") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const programmes = [...new Set(projetsSoumis.map(p => p.programme))]

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="p-6 space-y-6">
            {/* Header amélioré */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mes projets Soumis – en attente de traitement</h1>
                <p className="text-gray-600 mt-1">
                  Suivez l'état de vos soumissions de projets et gérez vos demandes
                </p>
              </div>
              <div className="flex items-center gap-3">
                {stats.urgent > 0 && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {stats.urgent} projet(s) urgent(s)
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  {stats.total} projet(s) soumis
                </Badge>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">En attente</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.enAttente}</p>
                    </div>
                    <Clock className="h-8 w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">En évaluation</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.enEvaluation}</p>
                    </div>
                    <Send className="h-8 w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Approuvés</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.approuves}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Budget total</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.budgetTotal.toLocaleString()} MAD</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtres améliorés */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres et recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un projet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="en_attente">En attente ({stats.enAttente})</SelectItem>
                      <SelectItem value="en_evaluation">En évaluation ({stats.enEvaluation})</SelectItem>
                      <SelectItem value="approuve">Approuvé ({stats.approuves})</SelectItem>
                      <SelectItem value="rejete">Rejeté ({stats.rejetes})</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={programmeFilter} onValueChange={setProgrammeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par programme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les programmes</SelectItem>
                      {programmes.map(programme => (
                        <SelectItem key={programme} value={programme}>{programme}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setProgrammeFilter("all")
                    }}
                    className="h-10"
                  >
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste des projets améliorée */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Projet
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Programme
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort("budgetDemande")}>
                          <div className="flex items-center gap-1">
                            Budget
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durée
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort("dateSoumission")}>
                          <div className="flex items-center gap-1">
                            Date soumission
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort("dateLimite")}>
                          <div className="flex items-center gap-1">
                            Date limite
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Délai
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProjets.map((projet) => {
                        const statusInfo = getStatusInfo(projet.statut)
                        const priorityInfo = getPriorityInfo(projet.priorite)
                        const StatusIcon = statusInfo.icon
                        const daysRemaining = getDaysRemaining(projet.dateLimite)
                        
                        return (
                          <tr key={projet.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4">
                              <div className="space-y-2">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {projet.titre}
                                  </div>
                                  <div className="text-sm text-gray-500 line-clamp-1">
                                    {projet.description}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {projet.priorite && (
                                    <Badge className={`${priorityInfo.color} text-xs`}>
                                      {priorityInfo.label}
                                    </Badge>
                                  )}
                                  {projet.membres && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Users className="h-3 w-3" />
                                      {projet.membres}
                                    </div>
                                  )}
                                  {projet.documents && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <FileText className="h-3 w-3" />
                                      {projet.documents}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {projet.programme}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3 text-gray-400" />
                                {projet.budgetDemande.toLocaleString()} MAD
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {projet.duree}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {new Date(projet.dateSoumission).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {new Date(projet.dateLimite).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge className={`${statusInfo.color}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              {(projet.statut === "en_attente" || projet.statut === "en_evaluation") ? (
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  daysRemaining < 7 
                                    ? 'bg-red-100 text-red-800' 
                                    : daysRemaining < 30 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {daysRemaining > 0 ? `${daysRemaining} jour(s)` : 'Expiré'}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Voir
                                </Button>
                                {(projet.statut === "en_attente" || projet.statut === "en_evaluation") && (
                                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                    <Edit className="h-3 w-3 mr-1" />
                                    Modifier
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* État vide amélioré */}
            {filteredProjets.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || statusFilter !== "all" || programmeFilter !== "all" 
                      ? "Aucun projet ne correspond à vos critères de recherche."
                      : "Vous n'avez pas encore soumis de projets."}
                  </p>
                  {!searchTerm && statusFilter === "all" && programmeFilter === "all" && (
                    <Button className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Soumettre votre premier projet
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 