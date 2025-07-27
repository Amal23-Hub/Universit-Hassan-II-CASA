"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XCircle, AlertTriangle, RefreshCw, Search, Filter, Eye, FileText, DollarSign } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface ProjetNonRetenu {
  id: string
  titre: string
  description: string
  raison: string
  dateSoumission: string
  dateDecision: string
  programme: string
  budgetDemande: number
  duree: string
  recommandations?: string
  peutResoumettre: boolean
}

const projetsNonRetenus: ProjetNonRetenu[] = [
  {
    id: "PNR001",
    titre: "Développement d'une plateforme de e-learning pour l'enseignement supérieur",
    description: "Création d'une plateforme complète d'apprentissage en ligne avec IA",
    raison: "Budget trop élevé pour le programme",
    dateSoumission: "2024-01-15",
    dateDecision: "2024-03-15",
    programme: "Programme de Recherche en Éducation",
    budgetDemande: 450000,
    duree: "36 mois",
    recommandations: "Réduire le budget de 30% et simplifier la portée du projet",
    peutResoumettre: true
  },
  {
    id: "PNR002",
    titre: "Étude sur l'impact des réseaux sociaux sur la productivité au travail",
    description: "Analyse quantitative de l'effet des réseaux sociaux sur la performance professionnelle",
    raison: "Méthodologie insuffisante",
    dateSoumission: "2024-02-01",
    dateDecision: "2024-04-01",
    programme: "Programme de Recherche en Psychologie",
    budgetDemande: 120000,
    duree: "18 mois",
    recommandations: "Améliorer la méthodologie d'échantillonnage et ajouter des contrôles expérimentaux",
    peutResoumettre: true
  },
  {
    id: "PNR003",
    titre: "Optimisation des algorithmes de cryptographie quantique",
    description: "Développement de nouveaux algorithmes de sécurité pour l'ère post-quantique",
    raison: "Expertise insuffisante dans le domaine",
    dateSoumission: "2024-01-20",
    dateDecision: "2024-03-20",
    programme: "Programme National de Recherche en IA",
    budgetDemande: 280000,
    duree: "30 mois",
    recommandations: "Collaborer avec des experts en cryptographie quantique",
    peutResoumettre: false
  },
  {
    id: "PNR004",
    titre: "Étude comparative des méthodes de recyclage des déchets électroniques",
    description: "Analyse des différentes techniques de recyclage et leur impact environnemental",
    raison: "Projet déjà financé par un autre organisme",
    dateSoumission: "2024-02-10",
    dateDecision: "2024-04-10",
    programme: "Programme de Recherche Environnementale",
    budgetDemande: 150000,
    duree: "24 mois",
    recommandations: "Proposer un angle d'approche différent ou collaborer avec l'équipe existante",
    peutResoumettre: true
  }
]

export default function ProjetsNonRetenus() {
  const [searchTerm, setSearchTerm] = useState("")
  const [programmeFilter, setProgrammeFilter] = useState<string>("all")
  const [resoumettreFilter, setResoumettreFilter] = useState<string>("all")

  const filteredProjets = projetsNonRetenus.filter(projet => {
    const matchesSearch = projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projet.raison.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesProgramme = programmeFilter === "all" || projet.programme === programmeFilter
    const matchesResoumettre = resoumettreFilter === "all" || 
                              (resoumettreFilter === "oui" && projet.peutResoumettre) ||
                              (resoumettreFilter === "non" && !projet.peutResoumettre)
    
    return matchesSearch && matchesProgramme && matchesResoumettre
  })

  const programmes = [...new Set(projetsNonRetenus.map(p => p.programme))]

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mes Projets Non Retenus</h1>
                <p className="text-gray-600 mt-1">
                  Consultez vos projets non retenus et les recommandations d'amélioration
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {projetsNonRetenus.length} projet(s) non retenu(s)
                </Badge>
              </div>
            </div>

      {/* Filtres */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
            <Select value={resoumettreFilter} onValueChange={setResoumettreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Possibilité de resoumission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les possibilités</SelectItem>
                <SelectItem value="oui">Peut être resoumis</SelectItem>
                <SelectItem value="non">Ne peut pas être resoumis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des projets */}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date soumission
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date décision
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Raison rejet
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resoumettable
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjets.map((projet) => (
                  <tr key={projet.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {projet.titre}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {projet.description}
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
                      {new Date(projet.dateSoumission).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {new Date(projet.dateDecision).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {projet.raison}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={`${projet.peutResoumettre ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {projet.peutResoumettre ? (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Oui
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Non
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        {projet.peutResoumettre && (
                          <Button size="sm" className="h-7 px-2 text-xs">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Resoumettre
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* État vide */}
      {filteredProjets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
            <p className="text-gray-600">
              {searchTerm || programmeFilter !== "all" || resoumettreFilter !== "all" 
                ? "Aucun projet ne correspond à vos critères de recherche."
                : "Vous n'avez pas de projets non retenus."}
            </p>
          </CardContent>
        </Card>
      )}
          </div>
        </main>
      </div>
    </div>
  )
} 