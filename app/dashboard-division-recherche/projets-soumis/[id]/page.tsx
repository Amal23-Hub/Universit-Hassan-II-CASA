"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { Header } from "@/components/header"
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  FileText, 
  User, 
  Building,
  Calendar,
  DollarSign
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProjetSoumis {
  id: string
  titre: string
  coordonnateur: string
  etablissement: string
  laboratoire: string
  thematique: string
  budgetDemande: number
  dateSoumission: string
  statut: "En attente" | "Retenu" | "Non retenu"
  description: string
  objectifs: string[]
  methodologie: string
  impactEspere: string
  documents: string[]
}

interface Programme {
  id: string
  nom: string
  description: string
  dateOuverture: string
  dateLimite: string
  budgetTotal: number
}

export default function ProjetsSoumisDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const programmeId = params.id as string

  const [programme, setProgramme] = useState<Programme | null>(null)
  const [projets, setProjets] = useState<ProjetSoumis[]>([])
  const [filteredProjets, setFilteredProjets] = useState<ProjetSoumis[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState<string>("all")
  const [filterThematique, setFilterThematique] = useState<string>("all")
  const [selectedProjet, setSelectedProjet] = useState<ProjetSoumis | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [actionProjet, setActionProjet] = useState<{ projet: ProjetSoumis; action: "Retenu" | "Non retenu" } | null>(null)

  // Données simulées du programme
  const programmesData: Programme[] = [
    {
      id: "1",
      nom: "Programme National de Recherche en Intelligence Artificielle",
      description: "Développement de solutions innovantes en IA pour l'industrie et la société",
      dateOuverture: "2024-01-15",
      dateLimite: "2024-06-30",
      budgetTotal: 5000000
    },
    {
      id: "2",
      nom: "Programme de Recherche en Énergies Renouvelables",
      description: "Innovation technologique dans le domaine des énergies vertes",
      dateOuverture: "2024-02-01",
      dateLimite: "2024-07-31",
      budgetTotal: 3000000
    },
    {
      id: "3",
      nom: "Programme de Recherche en Santé Numérique",
      description: "Technologies numériques pour améliorer les soins de santé",
      dateOuverture: "2024-01-20",
      dateLimite: "2024-05-15",
      budgetTotal: 4500000
    },
    {
      id: "4",
      nom: "Programme de Recherche en Agriculture Intelligente",
      description: "Intégration des technologies numériques dans l'agriculture",
      dateOuverture: "2024-03-01",
      dateLimite: "2024-08-31",
      budgetTotal: 2000000
    },
    {
      id: "5",
      nom: "Programme de Recherche en Cybersécurité",
      description: "Protection des infrastructures critiques et des données",
      dateOuverture: "2024-02-15",
      dateLimite: "2024-07-15",
      budgetTotal: 3500000
    }
  ]

  // Données simulées des projets
  const projetsData: { [key: string]: ProjetSoumis[] } = {
    "1": [
      {
        id: "1",
        titre: "Développement d'algorithmes d'IA pour l'éducation personnalisée",
        coordonnateur: "Dr. Ahmed BENALI",
        etablissement: "Université Hassan II",
        laboratoire: "Laboratoire de Bioinformatique et de Génomique",
        thematique: "Intelligence Artificielle",
        budgetDemande: 500000,
        dateSoumission: "2024-02-15",
        statut: "En attente",
        description: "Développement d'un système d'IA pour personnaliser l'apprentissage selon les besoins de chaque étudiant",
        objectifs: ["Créer un algorithme de recommandation", "Développer une interface utilisateur", "Tester sur un échantillon d'étudiants"],
        methodologie: "Approche hybride combinant machine learning et analyse comportementale",
        impactEspere: "Amélioration de 30% des résultats académiques",
        documents: ["projet_ia_education.pdf", "budget_detaille.xlsx", "equipe_recherche.pdf"]
      },
      {
        id: "2",
        titre: "Système de reconnaissance faciale pour la sécurité",
        coordonnateur: "Dr. Fatima EL HASSANI",
        etablissement: "ENSA Casablanca",
        laboratoire: "Laboratoire de Systèmes Intelligents",
        thematique: "Vision par ordinateur",
        budgetDemande: 750000,
        dateSoumission: "2024-02-20",
        statut: "Retenu",
        description: "Développement d'un système de reconnaissance faciale pour applications de sécurité",
        objectifs: ["Créer un algorithme de reconnaissance", "Optimiser les performances", "Intégrer dans un système existant"],
        methodologie: "Deep learning avec réseaux de neurones convolutifs",
        impactEspere: "Réduction de 50% des incidents de sécurité",
        documents: ["projet_reconnaissance.pdf", "analyse_risques.pdf"]
      },
      {
        id: "3",
        titre: "IA pour l'optimisation des réseaux de transport",
        coordonnateur: "Dr. Karim ALAOUI",
        etablissement: "Université Mohammed V",
        laboratoire: "Laboratoire d'Optimisation et de Recherche Opérationnelle",
        thematique: "Optimisation",
        budgetDemande: 600000,
        dateSoumission: "2024-02-25",
        statut: "Non retenu",
        description: "Application de l'IA pour optimiser les flux de transport urbain",
        objectifs: ["Modéliser le trafic urbain", "Développer des algorithmes d'optimisation", "Réduire les temps de trajet"],
        methodologie: "Reinforcement learning avec simulation multi-agents",
        impactEspere: "Réduction de 25% des temps de trajet",
        documents: ["projet_transport.pdf", "etude_faisabilite.pdf"]
      }
    ],
    "2": [
      {
        id: "4",
        titre: "Optimisation des panneaux solaires nouvelle génération",
        coordonnateur: "Dr. Mohamed LAHBY",
        etablissement: "Université Mohammed V",
        laboratoire: "Laboratoire d'Énergies Renouvelables",
        thematique: "Énergie solaire",
        budgetDemande: 400000,
        dateSoumission: "2024-03-01",
        statut: "En attente",
        description: "Développement de panneaux solaires à haut rendement",
        objectifs: ["Améliorer l'efficacité énergétique", "Réduire les coûts de production", "Tester en conditions réelles"],
        methodologie: "Recherche expérimentale avec tests en laboratoire",
        impactEspere: "Augmentation de 40% du rendement",
        documents: ["projet_panneaux.pdf", "protocole_tests.pdf"]
      }
    ]
  }

  useEffect(() => {
    // Charger les données du programme
    const programmeData = programmesData.find(p => p.id === programmeId)
    setProgramme(programmeData || null)

    // Charger les projets du programme
    const projetsProgramme = projetsData[programmeId] || []
    setProjets(projetsProgramme)
    setFilteredProjets(projetsProgramme)
  }, [programmeId])

  useEffect(() => {
    // Appliquer les filtres
    let filtered = projets

    if (searchTerm) {
      filtered = filtered.filter(projet =>
        projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.coordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.etablissement.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatut !== "all") {
      filtered = filtered.filter(projet => projet.statut === filterStatut)
    }

    if (filterThematique !== "all") {
      filtered = filtered.filter(projet => projet.thematique === filterThematique)
    }

    setFilteredProjets(filtered)
  }, [projets, searchTerm, filterStatut, filterThematique])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "Retenu":
        return <Badge className="bg-green-100 text-green-800">Retenu</Badge>
      case "Non retenu":
        return <Badge className="bg-red-100 text-red-800">Non retenu</Badge>
      case "En attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{statut}</Badge>
    }
  }

  const handleVoirDetails = (projet: ProjetSoumis) => {
    setSelectedProjet(projet)
    setShowDetailsModal(true)
  }

  const handleRetenirProjet = (projet: ProjetSoumis) => {
    setActionProjet({ projet, action: "Retenu" })
    setShowConfirmDialog(true)
  }

  const handleRejeterProjet = (projet: ProjetSoumis) => {
    setActionProjet({ projet, action: "Non retenu" })
    setShowConfirmDialog(true)
  }

  const confirmAction = () => {
    if (!actionProjet) return

    const updatedProjets = projets.map(projet =>
      projet.id === actionProjet.projet.id
        ? { ...projet, statut: actionProjet.action }
        : projet
    )

    setProjets(updatedProjets)
    setShowConfirmDialog(false)
    setActionProjet(null)
  }

  const getUniqueThematiques = () => {
    return [...new Set(projets.map(projet => projet.thematique))]
  }

  if (!programme) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DivisionRechercheSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement du programme...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{programme.nom}</h1>
                <p className="text-gray-600">{programme.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Ouvert: {formatDate(programme.dateOuverture)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Limite: {formatDate(programme.dateLimite)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Budget: {formatBudget(programme.budgetTotal)}</span>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres et recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs">Recherche</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Rechercher par titre, coordonnateur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 text-sm h-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Statut</Label>
                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="Retenu">Retenu</SelectItem>
                        <SelectItem value="Non retenu">Non retenu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Thématique</Label>
                    <Select value={filterThematique} onValueChange={setFilterThematique}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les thématiques</SelectItem>
                        {getUniqueThematiques().map((thematique) => (
                          <SelectItem key={thematique} value={thematique}>
                            {thematique}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  {filteredProjets.length} projet(s) trouvé(s)
                </div>
              </CardContent>
            </Card>

            {/* Liste des projets */}
            <Card>
              <CardHeader>
                <CardTitle>Projets soumis</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProjets.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun projet trouvé</p>
                    <p className="text-sm text-gray-400">Ajustez vos filtres pour voir les résultats</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProjets.map((projet) => (
                      <Card key={projet.id} className="border-l-4 border-l-uh2c-blue">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-1">{projet.titre}</h3>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      <span>{projet.coordonnateur}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Building className="h-3 w-3" />
                                      <span>{projet.etablissement}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>Soumis le {formatDate(projet.dateSoumission)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  {getStatutBadge(projet.statut)}
                                  <Badge variant="outline" className="text-xs">
                                    {formatBudget(projet.budgetDemande)}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{projet.description}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {projet.thematique}
                                </Badge>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">{projet.laboratoire}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVoirDetails(projet)}
                                className="h-7 px-2 text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Détails
                              </Button>
                            </div>
                            {projet.statut === "En attente" && (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleRetenirProjet(projet)}
                                  className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Retenir
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleRejeterProjet(projet)}
                                  className="h-7 px-3 text-xs bg-red-600 hover:bg-red-700 text-white"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Rejeter
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Modal de détails du projet */}
      {showDetailsModal && selectedProjet && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-uh2c-blue" />
                Détails du projet
              </DialogTitle>
              <DialogDescription>
                Informations complètes sur le projet soumis
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Titre du projet</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedProjet.titre}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Statut</Label>
                  <div className="mt-1">{getStatutBadge(selectedProjet.statut)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Coordonnateur</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedProjet.coordonnateur}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Établissement</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedProjet.etablissement}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Laboratoire</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedProjet.laboratoire}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Budget demandé</Label>
                  <p className="text-sm text-gray-900 mt-1">{formatBudget(selectedProjet.budgetDemande)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Date de soumission</Label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(selectedProjet.dateSoumission)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Thématique</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedProjet.thematique}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="text-sm text-gray-900 mt-1">{selectedProjet.description}</p>
              </div>

              {/* Objectifs */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Objectifs</Label>
                <ul className="list-disc list-inside text-sm text-gray-900 mt-1 space-y-1">
                  {selectedProjet.objectifs.map((objectif, index) => (
                    <li key={index}>{objectif}</li>
                  ))}
                </ul>
              </div>

              {/* Méthodologie */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Méthodologie</Label>
                <p className="text-sm text-gray-900 mt-1">{selectedProjet.methodologie}</p>
              </div>

              {/* Impact escompté */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Impact escompté</Label>
                <p className="text-sm text-gray-900 mt-1">{selectedProjet.impactEspere}</p>
              </div>

              {/* Documents */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Documents joints</Label>
                <div className="mt-1 space-y-1">
                  {selectedProjet.documents.map((document, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                      <FileText className="h-3 w-3" />
                      <span className="cursor-pointer underline">{document}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              {selectedProjet.statut === "En attente" && (
                <>
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false)
                      handleRetenirProjet(selectedProjet)
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Retenir le projet
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false)
                      handleRejeterProjet(selectedProjet)
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter le projet
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Fermer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de confirmation */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'action</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir {actionProjet?.action === "Retenu" ? "retenir" : "rejeter"} le projet "{actionProjet?.projet.titre}" ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={confirmAction}
              className={actionProjet?.action === "Retenu" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              Confirmer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 