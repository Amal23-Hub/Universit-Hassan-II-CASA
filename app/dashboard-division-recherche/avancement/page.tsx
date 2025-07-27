"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { Header } from "@/components/header"
import { 
  FileText, 
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
  Send,
  Plus,
  X,
  Clock,
  FileCheck,
  UserCheck,
  Building
} from "lucide-react"

interface ProjetAvancement {
  id: string
  programme: string
  projet: string
  coordonnateur: string
  etablissement: string
  organismeContractant: string
  budgetTotal: number
  dateDebut: string
  dateFin: string
  tranches: TrancheAvancement[]
}

interface TrancheAvancement {
  numero: number
  montant: number
  dateVersement: string
  dateFinTranche: string
  rapportIntermediaire?: RapportIntermediaire
  statut: "en_cours" | "terminee" | "rapport_depose" | "rapport_envoye"
}

interface RapportIntermediaire {
  id: string
  dateDepot: string
  fichier: string
  signeCoordonnateur: boolean
  signePresident: boolean
  dateEnvoi?: string
  commentaires?: string
}

export default function AvancementPage() {
  const [projets, setProjets] = useState<ProjetAvancement[]>([
    {
      id: "PROJ-001",
      programme: "Programme National de Recherche en IA",
      projet: "IA pour la santé préventive",
      coordonnateur: "Dr. Ahmed Benali",
      etablissement: "Université Hassan II",
      organismeContractant: "Ministère de l'Enseignement Supérieur",
      budgetTotal: 420000,
      dateDebut: "2024-02-15",
      dateFin: "2025-02-15",
      tranches: [
        {
          numero: 1,
          montant: 168000,
          dateVersement: "2024-02-15",
          dateFinTranche: "2024-08-15",
          statut: "terminee",
          rapportIntermediaire: {
            id: "RAPP-001-1",
            dateDepot: "2024-08-20",
            fichier: "rapport_intermediaire_proj001_tranche1.pdf",
            signeCoordonnateur: true,
            signePresident: true,
            dateEnvoi: "2024-08-25",
            commentaires: "Rapport déposé et envoyé avec succès"
          }
        },
        {
          numero: 2,
          montant: 126000,
          dateVersement: "2024-08-15",
          dateFinTranche: "2025-02-15",
          statut: "en_cours"
        },
        {
          numero: 3,
          montant: 126000,
          dateVersement: "2025-02-15",
          dateFinTranche: "2025-08-15",
          statut: "en_cours"
        }
      ]
    },
    {
      id: "PROJ-002",
      programme: "Programme National de Recherche en IA",
      projet: "Cybersécurité avancée",
      coordonnateur: "Dr. Fatima El Mansouri",
      etablissement: "Université Mohammed V",
      organismeContractant: "Agence Nationale de Réglementation des Télécommunications",
      budgetTotal: 300000,
      dateDebut: "2024-02-15",
      dateFin: "2025-02-15",
      tranches: [
        {
          numero: 1,
          montant: 120000,
          dateVersement: "2024-02-15",
          dateFinTranche: "2024-08-15",
          statut: "rapport_depose",
          rapportIntermediaire: {
            id: "RAPP-002-1",
            dateDepot: "2024-08-18",
            fichier: "rapport_intermediaire_proj002_tranche1.pdf",
            signeCoordonnateur: true,
            signePresident: false,
            commentaires: "En attente de signature du Président"
          }
        },
        {
          numero: 2,
          montant: 90000,
          dateVersement: "2024-08-15",
          dateFinTranche: "2025-02-15",
          statut: "en_cours"
        },
        {
          numero: 3,
          montant: 90000,
          dateVersement: "2025-02-15",
          dateFinTranche: "2025-08-15",
          statut: "en_cours"
        }
      ]
    },
    {
      id: "PROJ-003",
      programme: "Programme Énergies Renouvelables",
      projet: "Optimisation des panneaux solaires",
      coordonnateur: "Dr. Karim Alami",
      etablissement: "Université Ibn Zohr",
      organismeContractant: "Office National de l'Électricité",
      budgetTotal: 650000,
      dateDebut: "2024-03-20",
      dateFin: "2025-09-20",
      tranches: [
        {
          numero: 1,
          montant: 162500,
          dateVersement: "2024-03-20",
          dateFinTranche: "2024-09-20",
          statut: "terminee"
        },
        {
          numero: 2,
          montant: 162500,
          dateVersement: "2024-09-20",
          dateFinTranche: "2025-03-20",
          statut: "en_cours"
        },
        {
          numero: 3,
          montant: 162500,
          dateVersement: "2025-03-20",
          dateFinTranche: "2025-09-20",
          statut: "en_cours"
        },
        {
          numero: 4,
          montant: 162500,
          dateVersement: "2025-09-20",
          dateFinTranche: "2026-03-20",
          statut: "en_cours"
        }
      ]
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgramme, setFilterProgramme] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [selectedProjet, setSelectedProjet] = useState<ProjetAvancement | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedTranche, setSelectedTranche] = useState<{projetId: string, trancheNum: number} | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [commentaires, setCommentaires] = useState("")

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

  const getStatutBadge = (statut: string) => {
    const config = {
      en_cours: { label: "En cours", color: "bg-blue-100 text-blue-800" },
      terminee: { label: "Terminée", color: "bg-green-100 text-green-800" },
      rapport_depose: { label: "Rapport déposé", color: "bg-yellow-100 text-yellow-800" },
      rapport_envoye: { label: "Rapport envoyé", color: "bg-purple-100 text-purple-800" }
    }
    const configItem = config[statut as keyof typeof config]
    return (
      <Badge className={configItem.color}>
        {configItem.label}
      </Badge>
    )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleDeposerRapport = () => {
    if (selectedTranche && uploadedFile) {
      setProjets(projets.map(projet => {
        if (projet.id === selectedTranche.projetId) {
          return {
            ...projet,
            tranches: projet.tranches.map(tranche => {
              if (tranche.numero === selectedTranche.trancheNum) {
                return {
                  ...tranche,
                  statut: "rapport_depose",
                  rapportIntermediaire: {
                    id: `RAPP-${projet.id}-${tranche.numero}`,
                    dateDepot: new Date().toISOString().split('T')[0],
                    fichier: uploadedFile.name,
                    signeCoordonnateur: false,
                    signePresident: false,
                    commentaires: commentaires
                  }
                }
              }
              return tranche
            })
          }
        }
        return projet
      }))
      setShowUploadModal(false)
      setSelectedTranche(null)
      setUploadedFile(null)
      setCommentaires("")
    }
  }

  const handleEnvoiRapport = (projetId: string, trancheNum: number) => {
    setProjets(projets.map(projet => {
      if (projet.id === projetId) {
        return {
          ...projet,
          tranches: projet.tranches.map(tranche => {
            if (tranche.numero === trancheNum && tranche.rapportIntermediaire) {
              return {
                ...tranche,
                statut: "rapport_envoye",
                rapportIntermediaire: {
                  ...tranche.rapportIntermediaire,
                  dateEnvoi: new Date().toISOString().split('T')[0]
                }
              }
            }
            return tranche
          })
        }
      }
      return projet
    }))
  }

  const getStats = () => {
    const totalProjets = projets.length
    const totalTranches = projets.reduce((sum, p) => sum + p.tranches.length, 0)
    const tranchesTerminees = projets.reduce((sum, p) => 
      sum + p.tranches.filter(t => t.statut === "terminee").length, 0
    )
    const rapportsDeposes = projets.reduce((sum, p) => 
      sum + p.tranches.filter(t => t.statut === "rapport_depose").length, 0
    )
    const rapportsEnvoyes = projets.reduce((sum, p) => 
      sum + p.tranches.filter(t => t.statut === "rapport_envoye").length, 0
    )

    return { totalProjets, totalTranches, tranchesTerminees, rapportsDeposes, rapportsEnvoyes }
  }

  const stats = getStats()

  const filteredProjets = projets.filter(projet => {
    const matchesSearch = 
      projet.projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.coordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.etablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.programme.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProgramme = filterProgramme === "all" || projet.programme === filterProgramme
    const matchesStatut = filterStatut === "all" || 
      projet.tranches.some(t => t.statut === filterStatut)

    return matchesSearch && matchesProgramme && matchesStatut
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <div className="mx-auto max-w-7xl">
            {/* En-tête */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">État d'avancement du Projet</h1>
                  <p className="text-sm text-gray-600 mt-1">Division Recherche - Gestion des rapports intermédiaires</p>
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
                      <p className="text-xs text-gray-600 mb-1">Tranches Terminées</p>
                      <p className="text-lg font-bold text-green-600">{stats.tranchesTerminees}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Rapports Déposés</p>
                      <p className="text-lg font-bold text-yellow-600">{stats.rapportsDeposes}</p>
                    </div>
                    <FileCheck className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Rapports Envoyés</p>
                      <p className="text-lg font-bold text-purple-600">{stats.rapportsEnvoyes}</p>
                    </div>
                    <Send className="h-4 w-4 text-purple-600 flex-shrink-0" />
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
                  <div className="flex-1">
                    <Label className="text-xs">Statut</Label>
                    <Select
                      value={filterStatut}
                      onValueChange={(value) => setFilterStatut(value)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="terminee">Terminée</SelectItem>
                        <SelectItem value="rapport_depose">Rapport déposé</SelectItem>
                        <SelectItem value="rapport_envoye">Rapport envoyé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des projets */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                <CardTitle className="text-base flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-purple-600" />
                  État d'avancement des Projets
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {filteredProjets.map((projet, index) => (
                    <div 
                      key={projet.id} 
                      className={`p-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate text-sm">
                                {projet.projet}
                              </h3>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {projet.programme}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">Coordonnateur:</span>
                              <span className="font-medium text-gray-700">{projet.coordonnateur}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">Établissement:</span>
                              <span className="font-medium text-gray-700">{projet.etablissement}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">Budget:</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(projet.budgetTotal)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">Organisme:</span>
                              <span className="font-medium text-gray-700">{projet.organismeContractant}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProjet(projet)}
                          className="h-8 px-2 text-xs hover:bg-blue-100 hover:text-blue-700"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Détails
                        </Button>
                      </div>

                      {/* Tranches */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {projet.tranches.map((tranche) => (
                          <div key={tranche.numero} className="border rounded p-2 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">Tranche {tranche.numero}</span>
                              {getStatutBadge(tranche.statut)}
                            </div>
                            <div className="text-gray-600 mb-1">
                              {formatCurrency(tranche.montant)}
                            </div>
                            <div className="text-gray-500 mb-2">
                              Fin: {new Date(tranche.dateFinTranche).toLocaleDateString('fr-FR')}
                            </div>
                            
                            {tranche.statut === "terminee" && !tranche.rapportIntermediaire && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTranche({ projetId: projet.id, trancheNum: tranche.numero })
                                  setShowUploadModal(true)
                                }}
                                className="h-6 px-2 text-xs hover:bg-green-100 hover:text-green-700 w-full"
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                Déposer Rapport
                              </Button>
                            )}
                            
                            {tranche.rapportIntermediaire && (
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <FileCheck className="h-3 w-3 text-green-600" />
                                  <span className="text-green-600">Rapport déposé</span>
                                </div>
                                <div className="text-gray-500">
                                  {tranche.rapportIntermediaire.dateDepot}
                                </div>
                                {tranche.statut === "rapport_depose" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEnvoiRapport(projet.id, tranche.numero)}
                                    className="h-6 px-2 text-xs hover:bg-purple-100 hover:text-purple-700 w-full"
                                  >
                                    <Send className="h-3 w-3 mr-1" />
                                    Envoyer
                                  </Button>
                                )}
                                {tranche.statut === "rapport_envoye" && (
                                  <div className="text-purple-600 text-xs">
                                    Envoyé: {tranche.rapportIntermediaire.dateEnvoi}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modal de détails */}
          {selectedProjet && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold">Détails du Projet</h2>
                      <p className="text-sm text-gray-600">{selectedProjet.projet}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedProjet(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Informations générales */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Informations Générales</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-xs font-medium">Programme</Label>
                          <p className="font-medium">{selectedProjet.programme}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Coordonnateur</Label>
                          <p className="font-medium">{selectedProjet.coordonnateur}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Établissement</Label>
                          <p className="font-medium">{selectedProjet.etablissement}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Organisme Contractant</Label>
                          <p className="font-medium">{selectedProjet.organismeContractant}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Budget Total</Label>
                          <p className="font-medium">{formatCurrency(selectedProjet.budgetTotal)}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Période</Label>
                          <p className="font-medium">
                            {new Date(selectedProjet.dateDebut).toLocaleDateString('fr-FR')} - {new Date(selectedProjet.dateFin).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Détails des tranches */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Détails des Tranches et Rapports</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {selectedProjet.tranches.map((tranche) => (
                          <div key={tranche.numero} className="border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">Tranche {tranche.numero}</h4>
                              {getStatutBadge(tranche.statut)}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-2 text-xs">
                              <div>
                                <span className="text-gray-600">Montant:</span>
                                <span className="ml-1 font-medium">{formatCurrency(tranche.montant)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Date de fin:</span>
                                <span className="ml-1 font-medium">{new Date(tranche.dateFinTranche).toLocaleDateString('fr-FR')}</span>
                              </div>
                            </div>

                            {tranche.rapportIntermediaire && (
                              <div className="bg-gray-50 rounded p-2 text-xs">
                                <div className="font-medium mb-1">Rapport Intermédiaire</div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-gray-600">Date de dépôt:</span>
                                    <span className="ml-1">{tranche.rapportIntermediaire.dateDepot}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Fichier:</span>
                                    <span className="ml-1">{tranche.rapportIntermediaire.fichier}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-gray-600">Signatures:</span>
                                    <div className="flex space-x-1">
                                      <Badge variant={tranche.rapportIntermediaire.signeCoordonnateur ? "default" : "secondary"} className="text-xs">
                                        Coordonnateur
                                      </Badge>
                                      <Badge variant={tranche.rapportIntermediaire.signePresident ? "default" : "secondary"} className="text-xs">
                                        Président
                                      </Badge>
                                    </div>
                                  </div>
                                  {tranche.rapportIntermediaire.dateEnvoi && (
                                    <div>
                                      <span className="text-gray-600">Date d'envoi:</span>
                                      <span className="ml-1 text-purple-600">{tranche.rapportIntermediaire.dateEnvoi}</span>
                                    </div>
                                  )}
                                </div>
                                {tranche.rapportIntermediaire.commentaires && (
                                  <div className="mt-2 text-gray-600">
                                    {tranche.rapportIntermediaire.commentaires}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Modal de dépôt de rapport */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Déposer un Rapport Intermédiaire</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowUploadModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <Label htmlFor="rapport-upload" className="cursor-pointer">
                      <div className="font-medium text-gray-900 mb-1">Sélectionner le rapport PDF</div>
                      <div className="text-sm text-gray-500">Rapport signé par le coordonnateur et le président</div>
                    </Label>
                    <Input
                      id="rapport-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {uploadedFile && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium text-sm">{uploadedFile.name}</div>
                          <div className="text-xs text-green-700">
                            Taille: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium">Commentaires (optionnel)</Label>
                    <Textarea
                      placeholder="Ajouter des commentaires sur le rapport..."
                      value={commentaires}
                      onChange={(e) => setCommentaires(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setShowUploadModal(false)}>
                      Annuler
                    </Button>
                    <Button 
                      disabled={!uploadedFile}
                      size="sm"
                      onClick={handleDeposerRapport}
                    >
                      Déposer le Rapport
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