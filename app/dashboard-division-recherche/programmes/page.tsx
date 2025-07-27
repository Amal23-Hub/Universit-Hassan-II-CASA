"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Calendar, Building, DollarSign, Search, FolderOpen, BookOpen, Eye, Target, Users, X } from "lucide-react"
import { Header } from "@/components/header"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"

interface Programme {
  id: string
  name: string
  organisme: string
  dateDebut: string
  dateFin: string
  description: string
  budget: number
  nombreProjets: number
  objectifs?: string[]
  criteres?: string[]
  documents?: string[]
  statut: "en_cours" | "termine" | "inactif"
}

interface AppelProjet {
  id: string
  titre: string
  programme: string
  organisme: string
  dateOuverture: string
  dateLimite: string
  description: string
  budget: number
  nombreProjetsAttendus: number
  statut: "ouvert" | "ferme" | "en_evaluation"
  criteres?: string[]
  documents?: string[]
}

export default function ProgrammesPage() {
  const [activeTab, setActiveTab] = useState<"appels" | "programmes">("appels")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOrganisme, setFilterOrganisme] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterAnnee, setFilterAnnee] = useState("all")
  const [filterProgramme, setFilterProgramme] = useState("all")
  const [showNewProgramForm, setShowNewProgramForm] = useState(false)
  const [showNewAppelForm, setShowNewAppelForm] = useState(false)
  const [showEditProgramForm, setShowEditProgramForm] = useState(false)
  const [showEditAppelForm, setShowEditAppelForm] = useState(false)
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null)
  const [selectedAppel, setSelectedAppel] = useState<AppelProjet | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showSubmitProjectModal, setShowSubmitProjectModal] = useState(false)
  const [selectedAppelForSubmit, setSelectedAppelForSubmit] = useState<AppelProjet | null>(null)
  const [programmes, setProgrammes] = useState<Programme[]>([
    {
      id: "P001",
      name: "Programme National de Recherche en IA",
      organisme: "Ministère de l'Enseignement Supérieur",
      dateDebut: "2024-01-01",
      dateFin: "2026-12-31",
      description: "Programme national dédié au développement de l'intelligence artificielle",
      budget: 5000000,
      nombreProjets: 25,
      statut: "en_cours",
      objectifs: ["Développer l'IA au Maroc", "Former des experts", "Créer des partenariats"],
      criteres: ["Équipe pluridisciplinaire", "Impact économique", "Innovation technologique"]
    },
    {
      id: "P002",
      name: "Programme de Recherche Environnementale",
      organisme: "Ministère de l'Environnement",
      dateDebut: "2023-06-01",
      dateFin: "2025-05-31",
      description: "Recherche sur les enjeux environnementaux et le développement durable",
      budget: 3000000,
      nombreProjets: 15,
      statut: "en_cours",
      objectifs: ["Protection environnementale", "Développement durable", "Innovation verte"],
      criteres: ["Impact environnemental", "Durabilité", "Innovation"]
    },
    {
      id: "P003",
      name: "Programme Énergies Renouvelables",
      organisme: "Ministère de l'Énergie",
      dateDebut: "2024-03-01",
      dateFin: "2027-02-28",
      description: "Développement des énergies renouvelables et de l'efficacité énergétique",
      budget: 8000000,
      nombreProjets: 30,
      statut: "en_cours",
      objectifs: ["Transition énergétique", "Autonomie énergétique", "Innovation technologique"],
      criteres: ["Efficacité énergétique", "Innovation", "Impact économique"]
    }
  ])

  const [appelsProjets, setAppelsProjets] = useState<AppelProjet[]>([
    {
      id: "AP001",
      titre: "IA pour la santé préventive",
      programme: "Programme National de Recherche en IA",
      organisme: "Ministère de l'Enseignement Supérieur",
      dateOuverture: "2024-01-15",
      dateLimite: "2024-06-30",
      description: "Développement d'algorithmes d'intelligence artificielle pour la prévention et le diagnostic précoce des maladies",
      budget: 800000,
      nombreProjetsAttendus: 5,
      statut: "ouvert",
      criteres: ["Expertise en IA", "Partenaire médical", "Données de qualité"],
      documents: ["Cahier des charges", "Guide de soumission", "Modèle de convention"]
    },
    {
      id: "AP002",
      titre: "Changement climatique et agriculture",
      programme: "Programme de Recherche Environnementale",
      organisme: "Ministère de l'Environnement",
      dateOuverture: "2024-02-01",
      dateLimite: "2024-07-31",
      description: "Étude des impacts du changement climatique sur l'agriculture marocaine",
      budget: 600000,
      nombreProjetsAttendus: 3,
      statut: "ouvert",
      criteres: ["Expertise climatique", "Partenaire agricole", "Méthodologie robuste"],
      documents: ["Cahier des charges", "Guide méthodologique"]
    },
    {
      id: "AP003",
      titre: "Optimisation énergétique des bâtiments",
      programme: "Programme Énergies Renouvelables",
      organisme: "Ministère de l'Énergie",
      dateOuverture: "2024-03-15",
      dateLimite: "2024-08-31",
      description: "Solutions innovantes pour l'optimisation énergétique des bâtiments",
      budget: 1000000,
      nombreProjetsAttendus: 4,
      statut: "ouvert",
      criteres: ["Expertise énergétique", "Partenaire industriel", "Prototype fonctionnel"],
      documents: ["Cahier des charges", "Guide technique", "Modèle de convention"]
    }
  ])

  // États pour les formulaires
  const [newProgramData, setNewProgramData] = useState({
    name: "",
    organisme: "",
    dateDebut: "",
    dateFin: "",
    description: "",
    budget: "",
    nombreProjets: "",
    sousProgramme: "",
    descriptifSousProgramme: "",
    typologie: ""
  })

  const [newAppelData, setNewAppelData] = useState({
    titre: "",
    programme: "",
    organisme: "",
    dateOuverture: "",
    dateLimite: "",
    description: "",
    budget: "",
    nombreProjetsAttendus: ""
  })

  const typologies = [
    "Recherche fondamentale",
    "Recherche appliquée",
    "Recherche et développement",
    "Innovation technologique",
    "Transfert de technologie",
    "Formation et recherche"
  ]

  const organismes = [
    "Ministère de l'Enseignement Supérieur",
    "Agence Nationale de Sécurité",
    "Ministère de la Santé",
    "Ministère de l'Énergie",
    "Ministère de l'Agriculture",
    "Ministère des Transports",
    "CNRST",
    "Université Hassan II",
    "Autre"
  ]

  // Fonctions utilitaires
  const isProgrammeActif = (dateFin: string) => {
    return new Date(dateFin) > new Date()
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' MAD'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en_cours":
      case "ouvert":
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>
      case "termine":
      case "ferme":
        return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>
      case "inactif":
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>
      case "en_evaluation":
        return <Badge className="bg-yellow-100 text-yellow-800">En évaluation</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{statut}</Badge>
    }
  }

  // Gestionnaires d'événements
  const handleVoirDetails = (programme: Programme) => {
    setSelectedProgramme(programme)
    setShowDetailsModal(true)
  }

  const handleVoirDetailsAppel = (appel: AppelProjet) => {
    setSelectedAppel(appel)
    setShowDetailsModal(true)
  }

  const handleEditProgram = (programme: Programme) => {
    setSelectedProgramme(programme)
    setNewProgramData({
      name: programme.name,
      organisme: programme.organisme,
      dateDebut: programme.dateDebut,
      dateFin: programme.dateFin,
      description: programme.description,
      budget: programme.budget.toString(),
      nombreProjets: programme.nombreProjets.toString(),
      sousProgramme: "",
      descriptifSousProgramme: "",
      typologie: ""
    })
    setShowEditProgramForm(true)
  }

  const handleEditAppel = (appel: AppelProjet) => {
    setSelectedAppel(appel)
    setNewAppelData({
      titre: appel.titre,
      programme: appel.programme,
      organisme: appel.organisme,
      dateOuverture: appel.dateOuverture,
      dateLimite: appel.dateLimite,
      description: appel.description,
      budget: appel.budget.toString(),
      nombreProjetsAttendus: appel.nombreProjetsAttendus.toString()
    })
    setShowEditAppelForm(true)
  }

  const handleNewProgramInputChange = (field: string, value: string) => {
    setNewProgramData(prev => ({ ...prev, [field]: value }))
  }

  const handleNewAppelInputChange = (field: string, value: string) => {
    setNewAppelData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateNewProgram = (e: React.FormEvent) => {
    e.preventDefault()
    const newProgram: Programme = {
      id: `P${Date.now()}`,
      name: newProgramData.name,
      organisme: newProgramData.organisme,
      dateDebut: newProgramData.dateDebut,
      dateFin: newProgramData.dateFin,
      description: newProgramData.description,
      budget: parseInt(newProgramData.budget),
      nombreProjets: parseInt(newProgramData.nombreProjets),
      statut: "en_cours",
      objectifs: [],
      criteres: []
    }
    setProgrammes(prev => [...prev, newProgram])
    setShowNewProgramForm(false)
    setNewProgramData({
      name: "",
      organisme: "",
      dateDebut: "",
      dateFin: "",
      description: "",
      budget: "",
      nombreProjets: "",
      sousProgramme: "",
      descriptifSousProgramme: "",
      typologie: ""
    })
  }

  const handleCreateNewAppel = (e: React.FormEvent) => {
    e.preventDefault()
    const newAppel: AppelProjet = {
      id: `AP${Date.now()}`,
      titre: newAppelData.titre,
      programme: newAppelData.programme,
      organisme: newAppelData.organisme,
      dateOuverture: newAppelData.dateOuverture,
      dateLimite: newAppelData.dateLimite,
      description: newAppelData.description,
      budget: parseInt(newAppelData.budget),
      nombreProjetsAttendus: parseInt(newAppelData.nombreProjetsAttendus),
      statut: "ouvert",
      criteres: [],
      documents: []
    }
    setAppelsProjets(prev => [...prev, newAppel])
    setShowNewAppelForm(false)
    setNewAppelData({
      titre: "",
      programme: "",
      organisme: "",
      dateOuverture: "",
      dateLimite: "",
      description: "",
      budget: "",
      nombreProjetsAttendus: ""
    })
  }

  const handleUpdateProgram = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProgramme) return

    const updatedProgramme: Programme = {
      ...selectedProgramme,
      name: newProgramData.name,
      organisme: newProgramData.organisme,
      dateDebut: newProgramData.dateDebut,
      dateFin: newProgramData.dateFin,
      description: newProgramData.description,
      budget: parseInt(newProgramData.budget),
      nombreProjets: parseInt(newProgramData.nombreProjets)
    }

    setProgrammes(prev => prev.map(p => p.id === selectedProgramme.id ? updatedProgramme : p))
    setShowEditProgramForm(false)
    setSelectedProgramme(null)
    setNewProgramData({
      name: "",
      organisme: "",
      dateDebut: "",
      dateFin: "",
      description: "",
      budget: "",
      nombreProjets: "",
      sousProgramme: "",
      descriptifSousProgramme: "",
      typologie: ""
    })
  }

  const handleUpdateAppel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAppel) return

    const updatedAppel: AppelProjet = {
      ...selectedAppel,
      titre: newAppelData.titre,
      programme: newAppelData.programme,
      organisme: newAppelData.organisme,
      dateOuverture: newAppelData.dateOuverture,
      dateLimite: newAppelData.dateLimite,
      description: newAppelData.description,
      budget: parseInt(newAppelData.budget),
      nombreProjetsAttendus: parseInt(newAppelData.nombreProjetsAttendus)
    }

    setAppelsProjets(prev => prev.map(a => a.id === selectedAppel.id ? updatedAppel : a))
    setShowEditAppelForm(false)
    setSelectedAppel(null)
    setNewAppelData({
      titre: "",
      programme: "",
      organisme: "",
      dateOuverture: "",
      dateLimite: "",
      description: "",
      budget: "",
      nombreProjetsAttendus: ""
    })
  }

  // Filtrage des données
  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = programme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOrganisme = filterOrganisme === "all" || programme.organisme === filterOrganisme
    const matchesStatut = filterStatut === "all" || programme.statut === filterStatut
    const matchesAnnee = filterAnnee === "all" || 
                        new Date(programme.dateDebut).getFullYear().toString() === filterAnnee ||
                        new Date(programme.dateFin).getFullYear().toString() === filterAnnee
    
    return matchesSearch && matchesOrganisme && matchesStatut && matchesAnnee
  })

  const filteredAppels = appelsProjets.filter(appel => {
    const matchesSearch = appel.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appel.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOrganisme = filterOrganisme === "all" || appel.organisme === filterOrganisme
    const matchesStatut = filterStatut === "all" || appel.statut === filterStatut
    const matchesProgramme = filterProgramme === "all" || appel.programme === filterProgramme
    const matchesAnnee = filterAnnee === "all" || 
                        new Date(appel.dateOuverture).getFullYear().toString() === filterAnnee ||
                        new Date(appel.dateLimite).getFullYear().toString() === filterAnnee
    
    return matchesSearch && matchesOrganisme && matchesStatut && matchesProgramme && matchesAnnee
  })

  const uniqueOrganismes = [...new Set([...programmes.map(p => p.organisme), ...appelsProjets.map(a => a.organisme)])]

  const resetFilters = () => {
    setSearchTerm("")
    setFilterOrganisme("all")
    setFilterStatut("all")
    setFilterAnnee("all")
    setFilterProgramme("all")
  }

  const handleSubmitProject = (appel: AppelProjet) => {
    setSelectedAppelForSubmit(appel)
    setShowSubmitProjectModal(true)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <div className="mx-auto max-w-5xl">
            {/* Header simple */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Appels à projets</h1>
              <p className="text-gray-600 mt-1">Consultez les appels à projets de recherche disponibles et soumettre vos projets</p>
            </div>

            {/* Onglets pour les deux volets */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("appels")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "appels"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FolderOpen className="h-4 w-4" />
                  Appels à projets liés aux programmes
                </button>
                <button
                  onClick={() => setActiveTab("programmes")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "programmes"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Programmes eux-mêmes
                </button>
              </div>
            </div>

            {/* Section de recherche et filtres améliorée */}
            <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Recherche et filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Barre de recherche principale */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder={activeTab === "appels" ? "Rechercher un appel à projets..." : "Rechercher un programme..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                  />
                </div>

                {/* Filtres en grille */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Organisme</Label>
                    <Select value={filterOrganisme} onValueChange={setFilterOrganisme}>
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Tous les organismes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les organismes</SelectItem>
                        {uniqueOrganismes.map((organisme) => (
                          <SelectItem key={organisme} value={organisme}>
                            {organisme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Statut</Label>
                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {activeTab === "appels" ? (
                          <>
                            <SelectItem value="en_cours">Ouvert</SelectItem>
                            <SelectItem value="expire">Fermé</SelectItem>
                          </>
                        ) : (
                          <>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="expire">Expiré</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Année</Label>
                    <Select value={filterAnnee} onValueChange={setFilterAnnee}>
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Toutes les années" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les années</SelectItem>
                        {Array.from(new Set(programmes.flatMap(p => [
                          new Date(p.dateDebut).getFullYear(),
                          new Date(p.dateFin).getFullYear()
                        ]))).sort((a, b) => b - a).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Programme</Label>
                    <Select value={filterProgramme} onValueChange={setFilterProgramme}>
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder={activeTab === "appels" ? "Tous les appels à projets" : "Tous les programmes"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{activeTab === "appels" ? "Tous les appels à projets" : "Tous les programmes"}</SelectItem>
                        {activeTab === "appels" ? (
                          appelsProjets.map((appel) => (
                            <SelectItem key={appel.id} value={appel.programme}>
                              {appel.programme}
                            </SelectItem>
                          ))
                        ) : (
                          programmes.map((programme) => (
                          <SelectItem key={programme.id} value={programme.name}>
                            {programme.name}
                          </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques selon l'onglet actif */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {activeTab === "appels" ? "Appels à projets ouverts" : "Programmes en cours"}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {activeTab === "appels" 
                          ? appelsProjets.filter(a => a.statut === "ouvert").length
                          : programmes.filter(p => isProgrammeActif(p.dateFin)).length
                        }
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      {activeTab === "appels" ? (
                        <FolderOpen className="h-5 w-5 text-green-600" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {activeTab === "appels" ? "Appels à projets fermés" : "Programmes expirés"}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {activeTab === "appels" 
                          ? appelsProjets.filter(a => a.statut === "ferme").length
                          : programmes.filter(p => !isProgrammeActif(p.dateFin)).length
                        }
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                      {activeTab === "appels" ? (
                        <FolderOpen className="h-5 w-5 text-red-600" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bouton Nouveau programme/appel dans l'en-tête */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeTab === "appels" ? "Appels à projets" : "Programmes"}
                </h2>
                <p className="text-gray-600 mt-1">
                  {activeTab === "appels" 
                    ? "Gérez les appels à projets de recherche"
                    : "Gérez les programmes de recherche"
                  }
                </p>
              </div>
              <Button
                onClick={() => activeTab === "appels" ? setShowNewAppelForm(true) : setShowNewProgramForm(true)}
                size="sm"
                className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau {activeTab === "appels" ? "appel" : "programme"}
              </Button>
            </div>

            {/* Liste des éléments selon l'onglet actif */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === "appels" ? (
                filteredAppels.map((appel) => (
                  <Card key={appel.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                            {appel.titre}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 mb-3">
                            {appel.description.substring(0, 100)}...
                          </CardDescription>
                        </div>
                        {getStatutBadge(appel.statut)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="h-4 w-4" />
                        <span>{appel.organisme}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4" />
                        <span>{appel.programme}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Limite: {formatDate(appel.dateLimite)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatBudget(appel.budget)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target className="h-4 w-4" />
                        <span>{appel.nombreProjetsAttendus} projets attendus</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleVoirDetailsAppel(appel)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSubmitProject(appel)}
                          className="flex-1"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Soumettre un projet
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditAppel(appel)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredProgrammes.map((programme) => (
                  <Card key={programme.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                            {programme.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 mb-3">
                            {programme.description.substring(0, 100)}...
                          </CardDescription>
                        </div>
                        {getStatutBadge(programme.statut)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="h-4 w-4" />
                        <span>{programme.organisme}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(programme.dateDebut)} - {formatDate(programme.dateFin)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatBudget(programme.budget)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{programme.nombreProjets} projets</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleVoirDetails(programme)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditProgram(programme)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Modal de détails */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                    {selectedAppel ? selectedAppel.titre : selectedProgramme?.name}
                    </DialogTitle>
                    <DialogDescription>
                    {selectedAppel ? selectedAppel.description : selectedProgramme?.description}
                    </DialogDescription>
                  </DialogHeader>
                <div className="space-y-4">
                  {selectedAppel && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="font-medium">Programme</Label>
                          <p className="text-sm text-gray-600">{selectedAppel.programme}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Organisme</Label>
                          <p className="text-sm text-gray-600">{selectedAppel.organisme}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Date d'ouverture</Label>
                          <p className="text-sm text-gray-600">{formatDate(selectedAppel.dateOuverture)}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Date limite</Label>
                          <p className="text-sm text-gray-600">{formatDate(selectedAppel.dateLimite)}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Budget</Label>
                          <p className="text-sm text-gray-600">{formatBudget(selectedAppel.budget)}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Projets attendus</Label>
                          <p className="text-sm text-gray-600">{selectedAppel.nombreProjetsAttendus}</p>
                        </div>
                      </div>
                      {selectedAppel.criteres && (
                        <div>
                          <Label className="font-medium">Critères d'éligibilité</Label>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                            {selectedAppel.criteres.map((critere, index) => (
                              <li key={index}>{critere}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                  {selectedProgramme && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="font-medium">Organisme</Label>
                          <p className="text-sm text-gray-600">{selectedProgramme.organisme}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Période</Label>
                          <p className="text-sm text-gray-600">{formatDate(selectedProgramme.dateDebut)} - {formatDate(selectedProgramme.dateFin)}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Budget</Label>
                          <p className="text-sm text-gray-600">{formatBudget(selectedProgramme.budget)}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Nombre de projets</Label>
                          <p className="text-sm text-gray-600">{selectedProgramme.nombreProjets}</p>
                        </div>
                      </div>
                      {selectedProgramme.objectifs && (
                        <div>
                          <Label className="font-medium">Objectifs</Label>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                            {selectedProgramme.objectifs.map((objectif, index) => (
                              <li key={index}>{objectif}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedProgramme.criteres && (
                        <div>
                          <Label className="font-medium">Critères</Label>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                            {selectedProgramme.criteres.map((critere, index) => (
                              <li key={index}>{critere}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Modal pour nouveau programme */}
            <Dialog open={showNewProgramForm} onOpenChange={setShowNewProgramForm}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl font-semibold">Nouveau programme de recherche</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Créez un nouveau programme de recherche
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateNewProgram} className="space-y-6">
                  {/* Informations principales */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Informations principales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nom du programme *</Label>
                        <Input
                          id="name"
                          value={newProgramData.name}
                          onChange={(e) => handleNewProgramInputChange("name", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organisme" className="text-sm font-medium text-gray-700">Organisme *</Label>
                        <Select value={newProgramData.organisme} onValueChange={(value) => handleNewProgramInputChange("organisme", value)}>
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <SelectValue placeholder="Sélectionner un organisme" />
                          </SelectTrigger>
                          <SelectContent>
                            {organismes.map((organisme) => (
                              <SelectItem key={organisme} value={organisme}>
                                {organisme}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateDebut" className="text-sm font-medium text-gray-700">Date de début *</Label>
                        <Input
                          id="dateDebut"
                          type="date"
                          value={newProgramData.dateDebut}
                          onChange={(e) => handleNewProgramInputChange("dateDebut", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateFin" className="text-sm font-medium text-gray-700">Date de fin *</Label>
                        <Input
                          id="dateFin"
                          type="date"
                          value={newProgramData.dateFin}
                          onChange={(e) => handleNewProgramInputChange("dateFin", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget" className="text-sm font-medium text-gray-700">Budget (MAD) *</Label>
                        <Input
                          id="budget"
                          type="number"
                          value={newProgramData.budget}
                          onChange={(e) => handleNewProgramInputChange("budget", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nombreProjets" className="text-sm font-medium text-gray-700">Nombre de projets *</Label>
                        <Input
                          id="nombreProjets"
                          type="number"
                          value={newProgramData.nombreProjets}
                          onChange={(e) => handleNewProgramInputChange("nombreProjets", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informations détaillées */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Informations détaillées</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="sousProgramme" className="text-sm font-medium text-gray-700">Sous-programme</Label>
                        <Input
                          id="sousProgramme"
                          value={newProgramData.sousProgramme}
                          onChange={(e) => handleNewProgramInputChange("sousProgramme", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typologie" className="text-sm font-medium text-gray-700">Typologie</Label>
                        <Select value={newProgramData.typologie} onValueChange={(value) => handleNewProgramInputChange("typologie", value)}>
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <SelectValue placeholder="Sélectionner une typologie" />
                          </SelectTrigger>
                          <SelectContent>
                            {typologies.map((typologie) => (
                              <SelectItem key={typologie} value={typologie}>
                                {typologie}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Descriptions</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="descriptifSousProgramme" className="text-sm font-medium text-gray-700">Descriptif du sous-programme</Label>
                        <Textarea
                          id="descriptifSousProgramme"
                          value={newProgramData.descriptifSousProgramme}
                          onChange={(e) => handleNewProgramInputChange("descriptifSousProgramme", e.target.value)}
                          className="min-h-[100px] border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="Décrivez les détails du sous-programme..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description générale *</Label>
                        <Textarea
                          id="description"
                          value={newProgramData.description}
                          onChange={(e) => handleNewProgramInputChange("description", e.target.value)}
                          className="min-h-[120px] border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="Décrivez le programme de recherche..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewProgramForm(false)}
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Créer le programme
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Modal pour nouvel appel */}
            <Dialog open={showNewAppelForm} onOpenChange={setShowNewAppelForm}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl font-semibold">Nouvel appel à projets</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Créez un nouvel appel à projets
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateNewAppel} className="space-y-6">
                  {/* Informations principales */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Informations principales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="titre" className="text-sm font-medium text-gray-700">Titre de l'appel *</Label>
                        <Input
                          id="titre"
                          value={newAppelData.titre}
                          onChange={(e) => handleNewAppelInputChange("titre", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="programme" className="text-sm font-medium text-gray-700">Programme *</Label>
                        <Select value={newAppelData.programme} onValueChange={(value) => handleNewAppelInputChange("programme", value)}>
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <SelectValue placeholder="Sélectionner un programme" />
                          </SelectTrigger>
                          <SelectContent>
                            {programmes.map((programme) => (
                              <SelectItem key={programme.id} value={programme.name}>
                                {programme.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organisme" className="text-sm font-medium text-gray-700">Organisme *</Label>
                        <Select value={newAppelData.organisme} onValueChange={(value) => handleNewAppelInputChange("organisme", value)}>
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <SelectValue placeholder="Sélectionner un organisme" />
                          </SelectTrigger>
                          <SelectContent>
                            {organismes.map((organisme) => (
                              <SelectItem key={organisme} value={organisme}>
                                {organisme}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOuverture" className="text-sm font-medium text-gray-700">Date d'ouverture *</Label>
                        <Input
                          id="dateOuverture"
                          type="date"
                          value={newAppelData.dateOuverture}
                          onChange={(e) => handleNewAppelInputChange("dateOuverture", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateLimite" className="text-sm font-medium text-gray-700">Date limite *</Label>
                        <Input
                          id="dateLimite"
                          type="date"
                          value={newAppelData.dateLimite}
                          onChange={(e) => handleNewAppelInputChange("dateLimite", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget" className="text-sm font-medium text-gray-700">Budget (MAD) *</Label>
                        <Input
                          id="budget"
                          type="number"
                          value={newAppelData.budget}
                          onChange={(e) => handleNewAppelInputChange("budget", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nombreProjetsAttendus" className="text-sm font-medium text-gray-700">Projets attendus *</Label>
                        <Input
                          id="nombreProjetsAttendus"
                          type="number"
                          value={newAppelData.nombreProjetsAttendus}
                          onChange={(e) => handleNewAppelInputChange("nombreProjetsAttendus", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Description</h3>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description de l'appel *</Label>
                      <Textarea
                        id="description"
                        value={newAppelData.description}
                        onChange={(e) => handleNewAppelInputChange("description", e.target.value)}
                        className="min-h-[120px] border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Décrivez l'appel à projets..."
                        required
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewAppelForm(false)}
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Créer l'appel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Modal pour modifier programme */}
            <Dialog open={showEditProgramForm} onOpenChange={setShowEditProgramForm}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl font-semibold">Modifier le programme</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Modifiez les détails du programme sélectionné.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateProgram} className="space-y-6">
                  {/* Informations principales */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Informations principales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nom du programme *</Label>
                        <Input
                          id="name"
                          value={newProgramData.name}
                          onChange={(e) => handleNewProgramInputChange("name", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organisme" className="text-sm font-medium text-gray-700">Organisme *</Label>
                        <Select value={newProgramData.organisme} onValueChange={(value) => handleNewProgramInputChange("organisme", value)}>
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <SelectValue placeholder="Sélectionner un organisme" />
                          </SelectTrigger>
                          <SelectContent>
                            {organismes.map((organisme) => (
                              <SelectItem key={organisme} value={organisme}>
                                {organisme}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateDebut" className="text-sm font-medium text-gray-700">Date de début *</Label>
                        <Input
                          id="dateDebut"
                          type="date"
                          value={newProgramData.dateDebut}
                          onChange={(e) => handleNewProgramInputChange("dateDebut", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateFin" className="text-sm font-medium text-gray-700">Date de fin *</Label>
                        <Input
                          id="dateFin"
                          type="date"
                          value={newProgramData.dateFin}
                          onChange={(e) => handleNewProgramInputChange("dateFin", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget" className="text-sm font-medium text-gray-700">Budget (MAD) *</Label>
                        <Input
                          id="budget"
                          type="number"
                          value={newProgramData.budget}
                          onChange={(e) => handleNewProgramInputChange("budget", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nombreProjets" className="text-sm font-medium text-gray-700">Nombre de projets *</Label>
                        <Input
                          id="nombreProjets"
                          type="number"
                          value={newProgramData.nombreProjets}
                          onChange={(e) => handleNewProgramInputChange("nombreProjets", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informations détaillées */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Informations détaillées</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="sousProgramme" className="text-sm font-medium text-gray-700">Sous-programme</Label>
                        <Input
                          id="sousProgramme"
                          value={newProgramData.sousProgramme}
                          onChange={(e) => handleNewProgramInputChange("sousProgramme", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typologie" className="text-sm font-medium text-gray-700">Typologie</Label>
                        <Select value={newProgramData.typologie} onValueChange={(value) => handleNewProgramInputChange("typologie", value)}>
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <SelectValue placeholder="Sélectionner une typologie" />
                          </SelectTrigger>
                          <SelectContent>
                            {typologies.map((typologie) => (
                              <SelectItem key={typologie} value={typologie}>
                                {typologie}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Descriptions</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="descriptifSousProgramme" className="text-sm font-medium text-gray-700">Descriptif du sous-programme</Label>
                        <Textarea
                          id="descriptifSousProgramme"
                          value={newProgramData.descriptifSousProgramme}
                          onChange={(e) => handleNewProgramInputChange("descriptifSousProgramme", e.target.value)}
                          className="min-h-[100px] border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="Décrivez les détails du sous-programme..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description générale *</Label>
                        <Textarea
                          id="description"
                          value={newProgramData.description}
                          onChange={(e) => handleNewProgramInputChange("description", e.target.value)}
                          className="min-h-[120px] border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="Décrivez le programme de recherche..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowEditProgramForm(false)}
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Enregistrer les modifications
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Modal pour modifier appel */}
            <Dialog open={showEditAppelForm} onOpenChange={setShowEditAppelForm}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl font-semibold">Modifier l'appel à projets</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Modifiez les détails de l'appel à projets sélectionné.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateAppel} className="space-y-6">
                  {/* Informations principales */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Informations principales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="titre" className="text-sm font-medium text-gray-700">Titre de l'appel *</Label>
                        <Input
                          id="titre"
                          value={newAppelData.titre}
                          onChange={(e) => handleNewAppelInputChange("titre", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="programme" className="text-sm font-medium text-gray-700">Programme *</Label>
                        <Select value={newAppelData.programme} onValueChange={(value) => handleNewAppelInputChange("programme", value)}>
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <SelectValue placeholder="Sélectionner un programme" />
                          </SelectTrigger>
                          <SelectContent>
                            {programmes.map((programme) => (
                              <SelectItem key={programme.id} value={programme.name}>
                                {programme.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organisme" className="text-sm font-medium text-gray-700">Organisme *</Label>
                        <Select value={newAppelData.organisme} onValueChange={(value) => handleNewAppelInputChange("organisme", value)}>
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <SelectValue placeholder="Sélectionner un organisme" />
                          </SelectTrigger>
                          <SelectContent>
                            {organismes.map((organisme) => (
                              <SelectItem key={organisme} value={organisme}>
                                {organisme}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOuverture" className="text-sm font-medium text-gray-700">Date d'ouverture *</Label>
                        <Input
                          id="dateOuverture"
                          type="date"
                          value={newAppelData.dateOuverture}
                          onChange={(e) => handleNewAppelInputChange("dateOuverture", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateLimite" className="text-sm font-medium text-gray-700">Date limite *</Label>
                        <Input
                          id="dateLimite"
                          type="date"
                          value={newAppelData.dateLimite}
                          onChange={(e) => handleNewAppelInputChange("dateLimite", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget" className="text-sm font-medium text-gray-700">Budget (MAD) *</Label>
                        <Input
                          id="budget"
                          type="number"
                          value={newAppelData.budget}
                          onChange={(e) => handleNewAppelInputChange("budget", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nombreProjetsAttendus" className="text-sm font-medium text-gray-700">Projets attendus *</Label>
                        <Input
                          id="nombreProjetsAttendus"
                          type="number"
                          value={newAppelData.nombreProjetsAttendus}
                          onChange={(e) => handleNewAppelInputChange("nombreProjetsAttendus", e.target.value)}
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Description</h3>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description de l'appel *</Label>
                      <Textarea
                        id="description"
                        value={newAppelData.description}
                        onChange={(e) => handleNewAppelInputChange("description", e.target.value)}
                        className="min-h-[120px] border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Décrivez l'appel à projets..."
                        required
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowEditAppelForm(false)}
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Enregistrer les modifications
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Modal de soumission de projet */}
            <Dialog open={showSubmitProjectModal} onOpenChange={setShowSubmitProjectModal}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                    <Plus className="h-5 w-5 text-blue-600" />
                    Soumettre un projet
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {selectedAppelForSubmit && (
                      <>
                        Appel à projets : <strong>{selectedAppelForSubmit.titre}</strong>
                        <br />
                        Programme : {selectedAppelForSubmit.programme}
                      </>
                    )}
                  </DialogDescription>
                </DialogHeader>

                <form className="space-y-6">
                  {/* Informations du coordonnateur */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Informations du coordonnateur</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nomCoordonnateur" className="text-sm font-medium text-gray-700">Nom complet *</Label>
                        <Input
                          id="nomCoordonnateur"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="Dr. Ahmed BENALI"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emailCoordonnateur" className="text-sm font-medium text-gray-700">Email *</Label>
                        <Input
                          id="emailCoordonnateur"
                          type="email"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="ahmed.benali@uh2c.ac.ma"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telephoneCoordonnateur" className="text-sm font-medium text-gray-700">Téléphone *</Label>
                        <Input
                          id="telephoneCoordonnateur"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="+212 6 12 34 56 78"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="etablissement" className="text-sm font-medium text-gray-700">Établissement *</Label>
                        <Input
                          id="etablissement"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="Université Hassan II"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informations du projet */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Informations du projet</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="intituleProjet" className="text-sm font-medium text-gray-700">Intitulé du projet *</Label>
                        <Input
                          id="intituleProjet"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="Développement d'algorithmes d'IA pour la santé préventive"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="thematique" className="text-sm font-medium text-gray-700">Thématique *</Label>
                        <Select>
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <SelectValue placeholder="Sélectionner une thématique" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ia-sante">Intelligence artificielle pour la santé</SelectItem>
                            <SelectItem value="cybersecurite">Cybersécurité</SelectItem>
                            <SelectItem value="energies-renouvelables">Énergies renouvelables</SelectItem>
                            <SelectItem value="environnement">Environnement et développement durable</SelectItem>
                            <SelectItem value="telemedecine">Télémédecine et santé connectée</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="descriptionProjet" className="text-sm font-medium text-gray-700">Description du projet *</Label>
                        <Textarea
                          id="descriptionProjet"
                          className="min-h-[120px] border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="Décrivez votre projet de recherche en détail..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Équipe de recherche */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Équipe de recherche</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nombreChercheurs" className="text-sm font-medium text-gray-700">Nombre de chercheurs *</Label>
                        <Input
                          id="nombreChercheurs"
                          type="number"
                          min="1"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="3"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nombreDoctorants" className="text-sm font-medium text-gray-700">Nombre de doctorants</Label>
                        <Input
                          id="nombreDoctorants"
                          type="number"
                          min="0"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nombreMasters" className="text-sm font-medium text-gray-700">Nombre d'étudiants Master</Label>
                        <Input
                          id="nombreMasters"
                          type="number"
                          min="0"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Budget</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="budgetTotal" className="text-sm font-medium text-gray-700">Budget total demandé (MAD) *</Label>
                        <Input
                          id="budgetTotal"
                          type="number"
                          min="0"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="500000"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dureeProjet" className="text-sm font-medium text-gray-700">Durée du projet (mois) *</Label>
                        <Input
                          id="dureeProjet"
                          type="number"
                          min="1"
                          max="36"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder="24"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Répartition budgétaire */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">Répartition budgétaire</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="budgetPersonnel" className="text-xs text-gray-600">Personnel (salaires, bourses)</Label>
                          <Input
                            id="budgetPersonnel"
                            type="number"
                            min="0"
                            className="h-9 border border-gray-300 focus:border-blue-500"
                            placeholder="200000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budgetEquipement" className="text-xs text-gray-600">Équipements et matériel</Label>
                          <Input
                            id="budgetEquipement"
                            type="number"
                            min="0"
                            className="h-9 border border-gray-300 focus:border-blue-500"
                            placeholder="150000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budgetFonctionnement" className="text-xs text-gray-600">Fonctionnement</Label>
                          <Input
                            id="budgetFonctionnement"
                            type="number"
                            min="0"
                            className="h-9 border border-gray-300 focus:border-blue-500"
                            placeholder="100000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budgetAutres" className="text-xs text-gray-600">Autres dépenses</Label>
                          <Input
                            id="budgetAutres"
                            type="number"
                            min="0"
                            className="h-9 border border-gray-300 focus:border-blue-500"
                            placeholder="50000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents à joindre */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Documents à joindre</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cvCoordonnateur" className="text-sm font-medium text-gray-700">CV du coordonnateur *</Label>
                        <Input
                          id="cvCoordonnateur"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projetDetaille" className="text-sm font-medium text-gray-700">Projet détaillé *</Label>
                        <Input
                          id="projetDetaille"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lettreMotivation" className="text-sm font-medium text-gray-700">Lettre de motivation</Label>
                        <Input
                          id="lettreMotivation"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowSubmitProjectModal(false)}
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Soumettre le projet
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  )
} 