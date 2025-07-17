"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Eye, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"

interface ProjetRetenu {
  id: string
  programme: string
  projet: string
  thematique: string
  nomCoordonnateur: string
  prenomCoordonnateur: string
  etablissement: string
  budgetPropose: number
  retenu: boolean
  dateReception: string
  sourceReception: "email" | "courrier"
}

export default function ProjetsRetenus() {
  const [projets, setProjets] = useState<ProjetRetenu[]>([
    {
      id: "PR001",
      programme: "Programme National de Recherche en IA",
      projet: "Développement d'algorithmes d'IA pour l'éducation",
      thematique: "Intelligence Artificielle",
      nomCoordonnateur: "Benali",
      prenomCoordonnateur: "Ahmed",
      etablissement: "Université Hassan II",
      budgetPropose: 500000,
      retenu: false,
      dateReception: "2024-01-15",
      sourceReception: "email"
    },
    {
      id: "PR002",
      programme: "Programme de Recherche en Cybersécurité",
      projet: "Protection des infrastructures critiques",
      thematique: "Cybersécurité",
      nomCoordonnateur: "Zahra",
      prenomCoordonnateur: "Fatima",
      etablissement: "ENSA Casablanca",
      budgetPropose: 1200000,
      retenu: true,
      dateReception: "2024-01-20",
      sourceReception: "courrier"
    },
    {
      id: "PR003",
      programme: "Programme de Recherche en Santé Numérique",
      projet: "IA pour diagnostic médical",
      thematique: "Santé Numérique",
      nomCoordonnateur: "El Harti",
      prenomCoordonnateur: "Sara",
      etablissement: "CHU Hassan II",
      budgetPropose: 850000,
      retenu: false,
      dateReception: "2024-01-25",
      sourceReception: "email"
    },
    {
      id: "PR004",
      programme: "Programme de Recherche en Énergies Renouvelables",
      projet: "Optimisation des panneaux solaires",
      thematique: "Énergies Renouvelables",
      nomCoordonnateur: "Lahby",
      prenomCoordonnateur: "Mohamed",
      etablissement: "Université Mohammed V",
      budgetPropose: 600000,
      retenu: true,
      dateReception: "2024-01-30",
      sourceReception: "courrier"
    },
    {
      id: "PR005",
      programme: "Programme de Recherche en Agriculture Intelligente",
      projet: "Agriculture de précision",
      thematique: "Agriculture Intelligente",
      nomCoordonnateur: "Alami",
      prenomCoordonnateur: "Youssef",
      etablissement: "IAV Hassan II",
      budgetPropose: 450000,
      retenu: false,
      dateReception: "2024-02-05",
      sourceReception: "email"
    }
  ])

  const [filteredProjets, setFilteredProjets] = useState<ProjetRetenu[]>(projets)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgramme, setFilterProgramme] = useState<string>("all")
  const [filterRetenu, setFilterRetenu] = useState<string>("all")
  const [filterSource, setFilterSource] = useState<string>("all")

  // Filter logic
  const applyFilters = () => {
    let filtered = projets

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (projet) =>
          projet.projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.nomCoordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.prenomCoordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.thematique.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.etablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.programme.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Programme filter
    if (filterProgramme !== "all") {
      filtered = filtered.filter((projet) => projet.programme === filterProgramme)
    }

    // Retenu filter
    if (filterRetenu !== "all") {
      const isRetenu = filterRetenu === "retenu"
      filtered = filtered.filter((projet) => projet.retenu === isRetenu)
    }

    // Source filter
    if (filterSource !== "all") {
      filtered = filtered.filter((projet) => projet.sourceReception === filterSource)
    }

    setFilteredProjets(filtered)
  }

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters()
  }, [searchTerm, filterProgramme, filterRetenu, filterSource])

  const handleRetenuToggle = (projetId: string) => {
    setProjets(projets.map(projet => 
      projet.id === projetId 
        ? { ...projet, retenu: !projet.retenu }
        : projet
    ))
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getUniqueProgrammes = () => {
    return [...new Set(projets.map((p) => p.programme))].sort()
  }

  const getStats = () => {
    const total = projets.length
    const retenus = projets.filter(p => p.retenu).length
    const enAttente = total - retenus
    const email = projets.filter(p => p.sourceReception === "email").length
    const courrier = projets.filter(p => p.sourceReception === "courrier").length

    return { total, retenus, enAttente, email, courrier }
  }

  const stats = getStats()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Projets Retenus</h1>
            </div>

            {/* Filters */}
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
                        placeholder="Rechercher par projet, coordonnateur, thématique..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label>Programme</Label>
                    <Select
                      value={filterProgramme}
                      onValueChange={(value) => setFilterProgramme(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les programmes</SelectItem>
                        {getUniqueProgrammes().map((programme) => (
                          <SelectItem key={programme} value={programme}>
                            {programme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects Table */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des projets de recherche classés par programme</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProjets.length === 0 ? (
                  <div className="text-center py-8">
                    <Image
                      src="/empty-state.svg"
                      alt="Empty state"
                      width={120}
                      height={120}
                      className="mx-auto mb-4 opacity-50"
                    />
                    <p className="text-gray-500">Aucun projet trouvé</p>
                    <p className="text-sm text-gray-400">Ajustez vos filtres pour voir les résultats</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Retenu</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Programme</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Projet</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Thématique</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Nom du coordonnateur</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Prénom</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Établissement</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">Budget proposé</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjets.map((projet, index) => (
                          <tr key={projet.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="py-3 px-4">
                              <Checkbox
                                checked={projet.retenu}
                                onCheckedChange={() => handleRetenuToggle(projet.id)}
                                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-gray-900">{projet.programme}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-gray-900">{projet.projet}</span>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="secondary" className="text-xs">
                                {projet.thematique}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-gray-900">{projet.nomCoordonnateur}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-gray-900">{projet.prenomCoordonnateur}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-gray-700">{projet.etablissement}</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="font-medium text-gray-900">{formatBudget(projet.budgetPropose)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
} 