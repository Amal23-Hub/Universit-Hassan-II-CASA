"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, Users, DollarSign } from "lucide-react"

interface Programme {
  id: string
  nom: string
  code: string
  description: string
  budgetTotal: number
  budgetUtilise: number
  dateDebut: string
  dateFin: string
  statut: "En cours" | "En pause" | "Terminé" | "En préparation"
  nombreProjets: number
  responsable: string
  thematique: string
}

export default function Programmes() {
  const [programmes, setProgrammes] = useState<Programme[]>([
    {
      id: "1",
      nom: "Programme National de Recherche en IA",
      code: "PNR-IA-2024",
      description: "Développement de solutions d'intelligence artificielle pour l'éducation et la santé",
      budgetTotal: 5000000,
      budgetUtilise: 3200000,
      dateDebut: "2024-01-01",
      dateFin: "2026-12-31",
      statut: "En cours",
      nombreProjets: 15,
      responsable: "Dr. Ahmed Benali",
      thematique: "Intelligence Artificielle"
    },
    {
      id: "2",
      nom: "Programme de Recherche en Cybersécurité",
      code: "PR-CYB-2024",
      description: "Protection des infrastructures critiques et développement de solutions de sécurité",
      budgetTotal: 3000000,
      budgetUtilise: 1800000,
      dateDebut: "2024-03-01",
      dateFin: "2025-12-31",
      statut: "En cours",
      nombreProjets: 8,
      responsable: "Dr. Fatima Zahra",
      thematique: "Cybersécurité"
    },
    {
      id: "3",
      nom: "Programme de Recherche en Santé Numérique",
      code: "PR-SN-2024",
      description: "Innovation technologique pour améliorer les soins de santé",
      budgetTotal: 4000000,
      budgetUtilise: 2500000,
      dateDebut: "2024-02-01",
      dateFin: "2026-06-30",
      statut: "En cours",
      nombreProjets: 12,
      responsable: "Dr. Sara El Harti",
      thematique: "Santé Numérique"
    },
    {
      id: "4",
      nom: "Programme de Recherche en Énergies Renouvelables",
      code: "PR-ER-2024",
      description: "Développement de technologies pour les énergies durables",
      budgetTotal: 3500000,
      budgetUtilise: 2100000,
      dateDebut: "2024-04-01",
      dateFin: "2025-12-31",
      statut: "En pause",
      nombreProjets: 6,
      responsable: "Dr. Mohamed Lahby",
      thematique: "Énergies Renouvelables"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState<string>("all")
  const [filterThematique, setFilterThematique] = useState<string>("all")

  const filteredProgrammes = programmes.filter((programme) => {
    const matchesSearch = programme.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.responsable.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatut = filterStatut === "all" || programme.statut === filterStatut
    const matchesThematique = filterThematique === "all" || programme.thematique === filterThematique
    return matchesSearch && matchesStatut && matchesThematique
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "En cours":
        return "bg-green-100 text-green-800"
      case "En pause":
        return "bg-yellow-100 text-yellow-800"
      case "Terminé":
        return "bg-gray-100 text-gray-800"
      case "En préparation":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressPercentage = (utilise: number, total: number) => {
    return Math.round((utilise / total) * 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-red-500"
    if (percentage >= 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Programmes</h1>
                <p className="text-gray-600 mt-2">Gérez les programmes de recherche et leurs budgets</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Programme
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau programme</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Nom du programme</Label>
                      <Input placeholder="Nom du programme" />
                    </div>
                    <div>
                      <Label>Code</Label>
                      <Input placeholder="Code du programme" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input placeholder="Description du programme" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Budget total</Label>
                        <Input type="number" placeholder="Budget en MAD" />
                      </div>
                      <div>
                        <Label>Responsable</Label>
                        <Input placeholder="Nom du responsable" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Date de début</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>Date de fin</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Annuler</Button>
                      <Button>Créer</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filtres */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-end md:space-x-6 gap-4 md:gap-0">
                  <div className="flex-1">
                    <Label>Recherche</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher par nom, code ou responsable..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label>Statut</Label>
                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="En pause">En pause</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                        <SelectItem value="En préparation">En préparation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Thématique</Label>
                    <Select value={filterThematique} onValueChange={setFilterThematique}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les thématiques</SelectItem>
                        <SelectItem value="Intelligence Artificielle">Intelligence Artificielle</SelectItem>
                        <SelectItem value="Cybersécurité">Cybersécurité</SelectItem>
                        <SelectItem value="Santé Numérique">Santé Numérique</SelectItem>
                        <SelectItem value="Énergies Renouvelables">Énergies Renouvelables</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des programmes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProgrammes.map((programme) => {
                const progressPercentage = getProgressPercentage(programme.budgetUtilise, programme.budgetTotal)
                return (
                  <Card key={programme.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{programme.nom}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{programme.code}</p>
                        </div>
                        <Badge className={getStatutColor(programme.statut)}>
                          {programme.statut}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-4">{programme.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Budget utilisé</span>
                          <span className="font-medium">{formatCurrency(programme.budgetUtilise)} / {formatCurrency(programme.budgetTotal)}</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(progressPercentage)}`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-500 mr-2" />
                            <span>{programme.nombreProjets} projets</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                            <span>{new Date(programme.dateFin).getFullYear()}</span>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Responsable:</span> {programme.responsable}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 