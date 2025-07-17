"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { 
  DollarSign, 
  Download, 
  Upload, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  BarChart3,
  Search,
  Filter,
  FileSpreadsheet,
  Plus,
  X,
  ArrowUpDown,
  Send,
  Receipt
} from "lucide-react"

interface ProjetVersement {
  id: string
  programme: string
  projet: string
  nomCoordonnateur: string
  prenomCoordonnateur: string
  etablissement: string
  budgetAlloue: number
  tranches: TrancheVersement[]
}

interface TrancheVersement {
  numero: number
  montant: number
  dateVersement: string
  recu: boolean
  dateReception?: string
  envoye: boolean
  dateOrdreVirement?: string
}

export default function VersementsPage() {
  const [projets, setProjets] = useState<ProjetVersement[]>([
    {
      id: "PROJ-001",
      programme: "Programme National de Recherche en IA",
      projet: "IA pour la santé préventive",
      nomCoordonnateur: "Benali",
      prenomCoordonnateur: "Ahmed",
      etablissement: "Université Hassan II",
      budgetAlloue: 420000,
      tranches: [
        {
          numero: 1,
          montant: 168000,
          dateVersement: "2024-02-15",
          recu: true,
          dateReception: "2024-02-20",
          envoye: true,
          dateOrdreVirement: "2024-02-18"
        },
        {
          numero: 2,
          montant: 126000,
          dateVersement: "2024-08-15",
          recu: false,
          envoye: false
        },
        {
          numero: 3,
          montant: 126000,
          dateVersement: "2025-02-15",
          recu: false,
          envoye: false
        }
      ]
    },
    {
      id: "PROJ-002",
      programme: "Programme National de Recherche en IA",
      projet: "Cybersécurité avancée",
      nomCoordonnateur: "El Mansouri",
      prenomCoordonnateur: "Fatima",
      etablissement: "Université Mohammed V",
      budgetAlloue: 300000,
      tranches: [
        {
          numero: 1,
          montant: 120000,
          dateVersement: "2024-02-15",
          recu: true,
          dateReception: "2024-02-22",
          envoye: true,
          dateOrdreVirement: "2024-02-19"
        },
        {
          numero: 2,
          montant: 90000,
          dateVersement: "2024-08-15",
          recu: false,
          envoye: false
        },
        {
          numero: 3,
          montant: 90000,
          dateVersement: "2025-02-15",
          recu: false,
          envoye: false
        }
      ]
    },
    {
      id: "PROJ-003",
      programme: "Programme Énergies Renouvelables",
      projet: "Optimisation des panneaux solaires",
      nomCoordonnateur: "Alami",
      prenomCoordonnateur: "Karim",
      etablissement: "Université Ibn Zohr",
      budgetAlloue: 650000,
      tranches: [
        {
          numero: 1,
          montant: 162500,
          dateVersement: "2024-03-20",
          recu: true,
          dateReception: "2024-03-25",
          envoye: true,
          dateOrdreVirement: "2024-03-22"
        },
        {
          numero: 2,
          montant: 162500,
          dateVersement: "2024-09-20",
          recu: false,
          envoye: false
        },
        {
          numero: 3,
          montant: 162500,
          dateVersement: "2025-03-20",
          recu: false,
          envoye: false
        },
        {
          numero: 4,
          montant: 162500,
          dateVersement: "2025-09-20",
          recu: false,
          envoye: false
        }
      ]
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgramme, setFilterProgramme] = useState("all")
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedTranche, setSelectedTranche] = useState<{projetId: string, trancheNum: number} | null>(null)
  const [showVirementModal, setShowVirementModal] = useState(false)
  const [ordreVirementDate, setOrdreVirementDate] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getUniqueProgrammes = () => {
    return [...new Set(projets.map((p) => p.programme))].sort()
  }

  const handleTrancheRecuToggle = (projetId: string, trancheNum: number) => {
    setProjets(projets.map(projet => {
      if (projet.id === projetId) {
        return {
          ...projet,
          tranches: projet.tranches.map(tranche => {
            if (tranche.numero === trancheNum) {
              return {
                ...tranche,
                recu: !tranche.recu,
                dateReception: !tranche.recu ? new Date().toISOString().split('T')[0] : undefined
              }
            }
            return tranche
          })
        }
      }
      return projet
    }))
  }

  const handleEnvoyerVirement = (projetId: string, trancheNum: number) => {
    setSelectedTranche({ projetId, trancheNum })
    setShowVirementModal(true)
  }

  const confirmerEnvoiVirement = () => {
    if (selectedTranche && ordreVirementDate) {
      setProjets(projets.map(projet => {
        if (projet.id === selectedTranche.projetId) {
          return {
            ...projet,
            tranches: projet.tranches.map(tranche => {
              if (tranche.numero === selectedTranche.trancheNum) {
                return {
                  ...tranche,
                  envoye: true,
                  dateOrdreVirement: ordreVirementDate
                }
              }
              return tranche
            })
          }
        }
        return projet
      }))
      setShowVirementModal(false)
      setSelectedTranche(null)
      setOrdreVirementDate("")
    }
  }

  const getStats = () => {
    const totalProjets = projets.length
    const totalBudget = projets.reduce((sum, p) => sum + p.budgetAlloue, 0)
    const totalTranches = projets.reduce((sum, p) => sum + p.tranches.length, 0)
    const tranchesRecues = projets.reduce((sum, p) => 
      sum + p.tranches.filter(t => t.recu).length, 0
    )
    const tranchesEnvoyees = projets.reduce((sum, p) => 
      sum + p.tranches.filter(t => t.envoye).length, 0
    )

    return { totalProjets, totalBudget, totalTranches, tranchesRecues, tranchesEnvoyees }
  }

  const stats = getStats()

  const filteredProjets = projets.filter(projet => {
    const matchesSearch = 
      projet.projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.nomCoordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.prenomCoordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.etablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.programme.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProgramme = filterProgramme === "all" || projet.programme === filterProgramme

    return matchesSearch && matchesProgramme
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <div className="mx-auto max-w-7xl">
            {/* En-tête */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Gestion des Versements</h1>
                  <p className="text-sm text-gray-600 mt-1">Service Budget & Division Recherche</p>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Projets</p>
                      <p className="text-lg font-bold">{stats.totalProjets}</p>
                    </div>
                    <Users className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 mb-1">Budget Total</p>
                      <p className="text-lg font-bold truncate">{formatCurrency(stats.totalBudget)}</p>
                    </div>
                    <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0 ml-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Tranches</p>
                      <p className="text-lg font-bold">{stats.totalTranches}</p>
                    </div>
                    <BarChart3 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Tranches Reçues</p>
                      <p className="text-lg font-bold text-green-600">{stats.tranchesRecues}</p>
                    </div>
                    <Receipt className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Tranches Envoyées</p>
                      <p className="text-lg font-bold text-blue-600">{stats.tranchesEnvoyees}</p>
                    </div>
                    <Send className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtres */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres et Recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col md:flex-row md:items-end md:space-x-4 gap-3 md:gap-0">
                  <div className="flex-1">
                    <Label className="text-xs">Recherche</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Rechercher par projet, coordonnateur, établissement..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 text-sm h-8"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Programme</Label>
                    <Select
                      value={filterProgramme}
                      onValueChange={(value) => setFilterProgramme(value)}
                    >
                      <SelectTrigger className="h-8 text-sm">
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

            {/* Tableau des projets */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-blue-50 border-b">
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                  Liste des Projets - Gestion des Versements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Programme</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Projet</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Nom Coordonnateur</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Prénom</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Établissement</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-700">Budget Alloué</th>
                        <th className="text-center py-2 px-3 font-medium text-gray-700">Tranche 1</th>
                        <th className="text-center py-2 px-3 font-medium text-gray-700">Tranche 2</th>
                        <th className="text-center py-2 px-3 font-medium text-gray-700">Tranche 3</th>
                        <th className="text-center py-2 px-3 font-medium text-gray-700">Tranche 4</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjets.map((projet, index) => (
                        <tr key={projet.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                          <td className="py-2 px-3">
                            <span className="font-medium text-gray-900">{projet.programme}</span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-gray-900">{projet.projet}</span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-gray-900">{projet.nomCoordonnateur}</span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-gray-900">{projet.prenomCoordonnateur}</span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-gray-700">{projet.etablissement}</span>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <span className="font-medium text-gray-900">{formatCurrency(projet.budgetAlloue)}</span>
                          </td>
                          {[1, 2, 3, 4].map((trancheNum) => {
                            const tranche = projet.tranches.find(t => t.numero === trancheNum)
                            return (
                              <td key={trancheNum} className="py-2 px-3 text-center">
                                {tranche ? (
                                  <div className="space-y-1">
                                    <div className="text-xs font-medium text-gray-900">
                                      {formatCurrency(tranche.montant)}
                                    </div>
                                    <div className="flex items-center justify-center space-x-1">
                                      <Checkbox
                                        checked={tranche.recu}
                                        onCheckedChange={() => handleTrancheRecuToggle(projet.id, tranche.numero)}
                                        className="h-3 w-3 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                      />
                                      <span className="text-xs text-gray-500">Reçu</span>
                                    </div>
                                    {tranche.recu && (
                                      <div className="text-xs text-green-600">
                                        {tranche.dateReception}
                                      </div>
                                    )}
                                    {!tranche.envoye && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEnvoyerVirement(projet.id, tranche.numero)}
                                        className="h-6 px-2 text-xs hover:bg-blue-100 hover:text-blue-700"
                                      >
                                        <Send className="h-3 w-3 mr-1" />
                                        Envoyer
                                      </Button>
                                    )}
                                    {tranche.envoye && (
                                      <div className="text-xs text-blue-600">
                                        Envoyé: {tranche.dateOrdreVirement}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modal pour ordre de virement */}
          {showVirementModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Ordre de Virement</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowVirementModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Date de l'ordre de virement</Label>
                    <Input
                      type="date"
                      value={ordreVirementDate}
                      onChange={(e) => setOrdreVirementDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setShowVirementModal(false)}>
                      Annuler
                    </Button>
                    <Button 
                      disabled={!ordreVirementDate}
                      size="sm"
                      onClick={confirmerEnvoiVirement}
                    >
                      Confirmer l'envoi
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 