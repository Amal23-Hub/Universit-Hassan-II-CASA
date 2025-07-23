"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { Header } from "@/components/header"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle, FileText, Users, Calendar, DollarSign } from "lucide-react"
import Image from "next/image"

interface ProjetRetenu {
  id: string
  programme: string
  projet: string
  thematique: string
  nomCoordonnateur: string
  prenomCoordonnateur: string
  etablissement: string
  laboratoire: string
  enseignantChercheur: string
  budgetPropose: number
  statutRetenu: "Retenu" | "Non retenu" | null
  dateReception: string
  sourceReception: "email" | "courrier"
  // Informations supplémentaires du formulaire
  typologie?: string
  descriptifProgramme?: string
  organismesPartenaires?: string[]
  membresAssocies?: Array<{
    id: string
    nom: string
    prenom: string
    titre: string
    qualite: string
    affiliation: string
  }>
  anneeDebut?: string
  anneeFin?: string
  document?: string
}

export default function ProjetsRetenus() {
  const [projets, setProjets] = useState<ProjetRetenu[]>([
    {
      id: "PR000",
      programme: "Programme de Recherche en Santé Numérique",
      projet: "IA pour diagnostic médical",
      thematique: "Santé Numérique",
      nomCoordonnateur: "Benali",
      prenomCoordonnateur: "Ahmed",
      etablissement: "Université Hassan II",
      laboratoire: "Laboratoire de Physique des Matériaux et d'Électronique",
      enseignantChercheur: "Dr. Ahmed BENALI",
      budgetPropose: 500000,
      statutRetenu: null,
      dateReception: "2024-02-15",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Innovation technologique dans le domaine de la santé et de la télémédecine",
      organismesPartenaires: ["CHU Hassan II", "Ministère de la Santé"],
      membresAssocies: [
        {
          id: "0",
          nom: "Benali",
          prenom: "Ahmed",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Hassan II"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_sante_numerique_ia.pdf"
    },
    {
      id: "PR001",
      programme: "Programme National de Recherche en IA",
      projet: "Développement d'algorithmes d'IA pour l'éducation",
      thematique: "Intelligence Artificielle",
      nomCoordonnateur: "Benali",
      prenomCoordonnateur: "Ahmed",
      etablissement: "Université Hassan II",
      laboratoire: "Laboratoire de Bioinformatique et de Génomique",
      enseignantChercheur: "Dr. Ahmed BENALI",
      budgetPropose: 500000,
      statutRetenu: "Non retenu",
      dateReception: "2024-01-15",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Programme de recherche en intelligence artificielle pour le développement de solutions innovantes",
      organismesPartenaires: ["CHU Hassan II", "Ministère de l'Éducation"],
      membresAssocies: [
        {
          id: "1",
          nom: "Benali",
          prenom: "Ahmed",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Hassan II"
        },
        {
          id: "2",
          nom: "Zahra",
          prenom: "Fatima",
          titre: "Dr.",
          qualite: "Membre associé",
          affiliation: "ENSA Casablanca"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_ia_education.pdf"
    },
    {
      id: "PR002",
      programme: "Programme de Recherche en Cybersécurité",
      projet: "Protection des infrastructures critiques",
      thematique: "Cybersécurité",
      nomCoordonnateur: "Zahra",
      prenomCoordonnateur: "Fatima",
      etablissement: "ENSA Casablanca",
      laboratoire: "Laboratoire de Systèmes Intelligents",
      enseignantChercheur: "Dr. Fatima ZAHRA",
      budgetPropose: 1200000,
      statutRetenu: "Retenu",
      dateReception: "2024-01-20",
      sourceReception: "courrier",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Développement de solutions de cybersécurité pour protéger les infrastructures critiques",
      organismesPartenaires: ["Agence Nationale de Sécurité", "Ministère de l'Intérieur"],
      membresAssocies: [
        {
          id: "3",
          nom: "Zahra",
          prenom: "Fatima",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "ENSA Casablanca"
        },
        {
          id: "4",
          nom: "El Harti",
          prenom: "Sara",
          titre: "Dr.",
          qualite: "Chercheur",
          affiliation: "Université Mohammed V"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2027",
      document: "projet_cybersecurite.pdf"
    },
    {
      id: "PR003",
      programme: "Programme de Recherche en Santé Numérique",
      projet: "IA pour diagnostic médical",
      thematique: "Santé Numérique",
      nomCoordonnateur: "El Harti",
      prenomCoordonnateur: "Sara",
      etablissement: "CHU Hassan II",
      laboratoire: "Laboratoire de Recherche en Santé Numérique",
      enseignantChercheur: "Dr. Sara EL HARTI",
      budgetPropose: 850000,
      statutRetenu: "Non retenu",
      dateReception: "2024-01-25",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Innovation technologique dans le domaine de la santé et de la télémédecine",
      organismesPartenaires: ["CHU Hassan II", "Ministère de la Santé"],
      membresAssocies: [
        {
          id: "5",
          nom: "El Harti",
          prenom: "Sara",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "CHU Hassan II"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_sante_numerique.pdf"
    },
    {
      id: "PR004",
      programme: "Programme de Recherche en Énergies Renouvelables",
      projet: "Optimisation des panneaux solaires",
      thematique: "Énergies Renouvelables",
      nomCoordonnateur: "Lahby",
      prenomCoordonnateur: "Mohamed",
      etablissement: "Université Mohammed V",
      laboratoire: "Laboratoire d'Énergies Renouvelables et d'Efficacité Énergétique",
      enseignantChercheur: "Dr. Mohamed LAHBY",
      budgetPropose: 600000,
      statutRetenu: "Retenu",
      dateReception: "2024-01-30",
      sourceReception: "courrier",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Développement de technologies d'énergies renouvelables et d'efficacité énergétique",
      organismesPartenaires: ["Ministère de l'Énergie", "IRESEN"],
      membresAssocies: [
        {
          id: "6",
          nom: "Lahby",
          prenom: "Mohamed",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Mohammed V"
        },
        {
          id: "7",
          nom: "Alaoui",
          prenom: "Karim",
          titre: "Pr.",
          qualite: "Expert",
          affiliation: "IRESEN"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2027",
      document: "projet_energies_renouvelables.pdf"
    },
    {
      id: "PR005",
      programme: "Programme de Recherche en Agriculture Intelligente",
      projet: "Agriculture de précision",
      thematique: "Agriculture Intelligente",
      nomCoordonnateur: "Alami",
      prenomCoordonnateur: "Youssef",
      etablissement: "IAV Hassan II",
      laboratoire: "Laboratoire d'Agriculture Intelligente et de Précision",
      enseignantChercheur: "Dr. Youssef ALAMI",
      budgetPropose: 450000,
      statutRetenu: "Non retenu",
      dateReception: "2024-02-05",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Intégration des technologies numériques dans l'agriculture pour améliorer la productivité",
      organismesPartenaires: ["Ministère de l'Agriculture", "IAV Hassan II"],
      membresAssocies: [
        {
          id: "8",
          nom: "Alami",
          prenom: "Youssef",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "IAV Hassan II"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_agriculture_intelligente.pdf"
    },
    {
      id: "PR006",
      programme: "Programme de Recherche en Santé Numérique",
      projet: "IA pour diagnostic médical",
      thematique: "Santé Numérique",
      nomCoordonnateur: "Benali",
      prenomCoordonnateur: "Ahmed",
      etablissement: "Université Hassan II",
      laboratoire: "Laboratoire de Physique des Matériaux et d'Électronique",
      enseignantChercheur: "Dr. Ahmed BENALI",
      budgetPropose: 500000,
      statutRetenu: null,
      dateReception: "2024-02-10",
      sourceReception: "courrier",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Innovation technologique dans le domaine de la santé et de la télémédecine",
      organismesPartenaires: ["CHU Hassan II", "Ministère de la Santé"],
      membresAssocies: [
        {
          id: "9",
          nom: "Benali",
          prenom: "Ahmed",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Hassan II"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_sante_numerique_2.pdf"
    }
  ])

  const [filteredProjets, setFilteredProjets] = useState<ProjetRetenu[]>(projets)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgramme, setFilterProgramme] = useState<string>("all")
  const [filterLaboratoire, setFilterLaboratoire] = useState<string>("all")
  const [filterEnseignant, setFilterEnseignant] = useState<string>("all")
  const [filterSource, setFilterSource] = useState<string>("all")
  const [selectedProjet, setSelectedProjet] = useState<ProjetRetenu | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    projetId: string
    nouveauStatut: "Retenu" | "Non retenu"
  } | null>(null)
  
  // États pour les nouveaux modals
  const [showConventionModal, setShowConventionModal] = useState(false)
  const [showProgrammeEmploiModal, setShowProgrammeEmploiModal] = useState(false)
  const [showVersementsModal, setShowVersementsModal] = useState(false)
  const [showLivrablesModal, setShowLivrablesModal] = useState(false)

  // Appliquer les filtres automatiquement quand les projets ou les filtres changent
  useEffect(() => {
    let filtered = projets

    // Filtre de recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (projet) =>
          projet.projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.nomCoordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.prenomCoordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.thematique.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.etablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.programme.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.laboratoire.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.enseignantChercheur.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par programme
    if (filterProgramme !== "all") {
      filtered = filtered.filter((projet) => projet.programme === filterProgramme)
    }

    // Filtre par statut
    if (filterSource !== "all") {
      filtered = filtered.filter((projet) => projet.sourceReception === filterSource)
    }

    // Filtre par laboratoire
    if (filterLaboratoire !== "all") {
      filtered = filtered.filter((projet) => projet.laboratoire === filterLaboratoire)
    }

    // Filtre par enseignant chercheur
    if (filterEnseignant !== "all") {
      filtered = filtered.filter((projet) => projet.enseignantChercheur === filterEnseignant)
    }

    setFilteredProjets(filtered)
  }, [projets, searchTerm, filterProgramme, filterLaboratoire, filterEnseignant, filterSource])

  const handleRetenuToggle = (projetId: string, nouveauStatut: "Retenu" | "Non retenu") => {
    // Confirmation spéciale pour le statut "Retenu"
    if (nouveauStatut === "Retenu") {
      setPendingStatusChange({ projetId, nouveauStatut })
      setShowConfirmationModal(true)
      return
    }
    
    // Pour les autres statuts, appliquer directement
    applyStatusChange(projetId, nouveauStatut)
  }

  const applyStatusChange = (projetId: string, nouveauStatut: "Retenu" | "Non retenu") => {
    const updatedProjets = projets.map(projet => {
      if (projet.id === projetId) {
        return {
          ...projet,
          statutRetenu: nouveauStatut
        }
      }
      return projet
    })
    
    setProjets(updatedProjets)
  }

  const confirmStatusChange = () => {
    if (pendingStatusChange) {
      applyStatusChange(pendingStatusChange.projetId, pendingStatusChange.nouveauStatut)
      setShowConfirmationModal(false)
      setPendingStatusChange(null)
    }
  }

  const cancelStatusChange = () => {
    setShowConfirmationModal(false)
    setPendingStatusChange(null)
  }

  const handleVoirDetails = (projet: ProjetRetenu) => {
    setSelectedProjet(projet)
    setShowDetailsModal(true)
  }

  const handleConvention = (projet: ProjetRetenu) => {
    setSelectedProjet(projet)
    setShowConventionModal(true)
  }

  const handleProgrammeEmploi = (projet: ProjetRetenu) => {
    setSelectedProjet(projet)
    setShowProgrammeEmploiModal(true)
  }

  const handleVersements = (projet: ProjetRetenu) => {
    setSelectedProjet(projet)
    setShowVersementsModal(true)
  }

  const handleLivrables = (projet: ProjetRetenu) => {
    setSelectedProjet(projet)
    setShowLivrablesModal(true)
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

  const getUniqueLaboratoires = () => {
    return [...new Set(projets.map((p) => p.laboratoire))].sort()
  }

  const getUniqueEnseignants = () => {
    return [...new Set(projets.map((p) => p.enseignantChercheur))].sort()
  }

  const getStats = () => {
    const total = projets.length
    const retenus = projets.filter(p => p.statutRetenu === "Retenu").length
    const nonRetenus = projets.filter(p => p.statutRetenu === "Non retenu").length
    const nonDefinis = projets.filter(p => p.statutRetenu === null).length
    const email = projets.filter(p => p.sourceReception === "email").length
    const courrier = projets.filter(p => p.sourceReception === "courrier").length

    return { total, retenus, nonRetenus, nonDefinis, email, courrier }
  }

  const stats = getStats()

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto">
                            <div className="mb-4">
                  <h1 className="text-xl font-bold text-gray-900">Projet de recherche retenus</h1>
                </div>

            {/* Filters */}
            <Card className="mb-3">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres et recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-xs">Recherche</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Rechercher par projet, coordonnateur, thématique..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 text-sm h-8"
                      />
                    </div>
                  </div>
                  <div>
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
                  <div>
                    <Label className="text-xs">Laboratoire</Label>
                    <Select
                      value={filterLaboratoire}
                      onValueChange={(value) => setFilterLaboratoire(value)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les laboratoires</SelectItem>
                        {getUniqueLaboratoires().map((laboratoire) => (
                          <SelectItem key={laboratoire} value={laboratoire}>
                            {laboratoire}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Enseignant chercheur</Label>
                    <Select
                      value={filterEnseignant}
                      onValueChange={(value) => setFilterEnseignant(value)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les enseignants</SelectItem>
                        {getUniqueEnseignants().map((enseignant) => (
                          <SelectItem key={enseignant} value={enseignant}>
                            {enseignant}
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
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Liste des projets de recherche classés par programme</CardTitle>
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
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-medium text-gray-700 w-1/8">Programme</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-700 w-1/4">Projet</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-700 w-1/8">Thématique</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-700">Coordonnateur</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-700">Établissement</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-700 w-1/8">Laboratoire</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-700 w-1/8">Enseignant chercheur</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-700 whitespace-nowrap">Budget proposé</th>
                          <th className="text-center py-2 px-3 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjets.map((projet, index) => (
                          <tr key={projet.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="py-2 px-3 w-1/8">
                              <span className="font-medium text-gray-900 text-xs truncate block" title={projet.programme}>{projet.programme}</span>
                            </td>
                            <td className="py-2 px-3 w-1/4">
                              <span className="text-gray-900 whitespace-nowrap">{projet.projet}</span>
                            </td>
                            <td className="py-2 px-3 w-1/8">
                              <Badge variant="secondary" className="text-xs whitespace-nowrap">
                                {projet.thematique}
                              </Badge>
                            </td>
                            <td className="py-2 px-3">
                              <span className="text-gray-900 whitespace-nowrap">{projet.nomCoordonnateur} {projet.prenomCoordonnateur}</span>
                            </td>
                            <td className="py-2 px-3">
                              <span className="text-gray-700 whitespace-nowrap">{projet.etablissement}</span>
                            </td>
                            <td className="py-2 px-3 w-1/8">
                              <span className="text-gray-700 text-xs truncate block" title={projet.laboratoire}>{projet.laboratoire}</span>
                            </td>
                            <td className="py-2 px-3 w-1/8">
                              <span className="text-gray-700 text-xs truncate block" title={projet.enseignantChercheur}>{projet.enseignantChercheur}</span>
                            </td>
                            <td className="py-2 px-3 text-right">
                              <span className="font-medium text-gray-900 whitespace-nowrap">{formatBudget(projet.budgetPropose)}</span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVoirDetails(projet)}
                                  className="h-6 w-6 p-0 hover:bg-uh2c-blue/10 hover:text-uh2c-blue"
                                  title="Voir les détails"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleConvention(projet)}
                                  className="h-6 w-6 p-0 hover:bg-uh2c-blue/10 hover:text-uh2c-blue"
                                  title="Convention"
                                >
                                  <FileText className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProgrammeEmploi(projet)}
                                  className="h-6 w-6 p-0 hover:bg-uh2c-blue/10 hover:text-uh2c-blue"
                                  title="Programme d'emploi"
                                >
                                  <Users className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVersements(projet)}
                                  className="h-6 w-6 p-0 text-gray-600 hover:bg-uh2c-blue/10 hover:text-uh2c-blue border border-gray-200 hover:border-uh2c-blue/30"
                                  title="Versements"
                                >
                                  <DollarSign className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLivrables(projet)}
                                  className="h-6 w-6 p-0 hover:bg-uh2c-blue/10 hover:text-uh2c-blue"
                                  title="Livrables"
                                >
                                  <Calendar className="h-3 w-3" />
                                </Button>
                              </div>
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

      {/* Modal pour les détails du projet */}
      {showDetailsModal && selectedProjet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header avec couleur UH2C */}
            <div className="bg-uh2c-blue border-b border-uh2c-blue/20 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Détails du projet</h2>
                    <p className="text-xs text-white/80">ID: {selectedProjet.id}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                  className="h-5 w-5 p-0 text-white hover:bg-white/20 rounded"
                >
                  <XCircle className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-4">
                {/* Statut du projet - Banner en haut */}
                <div className={`rounded-lg p-3 border-l-4 ${
                  selectedProjet.statutRetenu === "Retenu"
                    ? "bg-green-50 border-green-500"
                    : selectedProjet.statutRetenu === "Non retenu"
                    ? "bg-red-50 border-red-500"
                    : "bg-yellow-50 border-yellow-500"
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedProjet.statutRetenu === "Retenu"
                        ? "bg-green-500"
                        : selectedProjet.statutRetenu === "Non retenu"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}></div>
                    <div>
                      <h3 className="font-medium text-gray-900">Statut du projet</h3>
                      <p className={`text-sm font-medium ${
                        selectedProjet.statutRetenu === "Retenu"
                          ? "text-green-700"
                          : selectedProjet.statutRetenu === "Non retenu"
                          ? "text-red-700"
                          : "text-yellow-700"
                      }`}>
                        {selectedProjet.statutRetenu || "Non défini"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations du programme */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Informations du programme</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Programme</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.programme}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Typologie</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.typologie || "Projet de recherche financé"}</p>
                    </div>
                    <div className="md:col-span-3 bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Descriptif du sous programme</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.descriptifProgramme}</p>
                    </div>
                  </div>
                </div>

                {/* Informations du projet */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Informations du projet</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Intitulé du projet *</Label>
                      <p className="text-sm font-medium text-gray-900">{selectedProjet.projet}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Thématique du projet *</Label>
                      <Badge variant="secondary" className="bg-uh2c-blue/10 text-uh2c-blue border-uh2c-blue/20 text-xs">
                        {selectedProjet.thematique}
                      </Badge>
                    </div>
                    <div className="md:col-span-2 bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Organismes partenaires *</Label>
                      <div className="flex flex-wrap gap-1">
                        {selectedProjet.organismesPartenaires?.map((organisme, index) => (
                          <Badge key={index} variant="outline" className="bg-uh2c-blue/5 text-uh2c-blue border-uh2c-blue/20 text-xs">
                            {organisme}
                          </Badge>
                        )) || <span className="text-xs text-gray-500 italic">Aucun organisme partenaire spécifié</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Membres associés */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Membres associés</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedProjet.membresAssocies && selectedProjet.membresAssocies.length > 0 ? (
                      selectedProjet.membresAssocies.map((membre, index) => (
                        <div key={membre.id} className="bg-white rounded p-3 border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-uh2c-blue rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-xs">
                                {membre.nom.charAt(0)}{membre.prenom.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium text-sm text-gray-900">{membre.titre} {membre.nom} {membre.prenom}</p>
                                <Badge className="bg-uh2c-blue/10 text-uh2c-blue border-uh2c-blue/20 text-xs">
                                  {membre.qualite}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600">{membre.affiliation}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded p-4 border border-gray-200 text-center">
                        <p className="text-sm text-gray-500">Aucun membre associé sélectionné</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Durée et budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Durée de projet */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Durée de projet</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">Année de début *</Label>
                        <p className="text-sm font-medium text-gray-900">{selectedProjet.anneeDebut || "Non spécifiée"}</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">Année de fin *</Label>
                        <p className="text-sm font-medium text-gray-900">{selectedProjet.anneeFin || "Non spécifiée"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Budget proposé */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Budget proposé</h3>
                    </div>
                    <div className="bg-white rounded p-4 border border-gray-200 text-center">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Montant en dirhams *</Label>
                      <p className="text-uh2c-blue font-bold text-xl">{formatBudget(selectedProjet.budgetPropose)}</p>
                      <p className="text-xs text-gray-500 mt-1">Budget total du projet</p>
                    </div>
                  </div>
                </div>

                {/* Document intégral du projet */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Document intégral du projet à signer *</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-uh2c-blue/5 border border-uh2c-blue/20 rounded p-3">
                      <div className="flex items-start space-x-2">
                        <div className="w-4 h-4 bg-uh2c-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-uh2c-blue mb-1">Confidentialité des documents</p>
                          <p className="text-xs text-uh2c-blue/80">
                            Tous les documents soumis dans cette section sont traités de manière strictement confidentielle. 
                            Seuls les membres autorisés du comité d'évaluation auront accès à ces informations.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-2 block">Document sélectionné</Label>
                      <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded border border-gray-200">
                        <div className="w-8 h-8 bg-uh2c-blue/10 rounded flex items-center justify-center">
                          <svg className="w-4 h-4 text-uh2c-blue" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{selectedProjet.document || "Aucun document joint"}</p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX jusqu'à 10MB</p>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs text-uh2c-blue border-uh2c-blue/30 hover:bg-uh2c-blue/5">
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations administratives */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Informations administratives</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Coordonnateur</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.nomCoordonnateur} {selectedProjet.prenomCoordonnateur}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Établissement</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.etablissement}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Date de réception</Label>
                      <p className="text-sm text-gray-900">{new Date(selectedProjet.dateReception).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Source de réception</Label>
                      <Badge variant="outline" className="bg-uh2c-blue/5 text-uh2c-blue border-uh2c-blue/20 text-xs">
                        {selectedProjet.sourceReception === "email" ? "Email" : "Courrier"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white px-4 py-2 rounded text-sm"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation pour le statut "Retenu" */}
      {showConfirmationModal && pendingStatusChange && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmation de la décision</h3>
              <p className="text-sm text-gray-700 mb-4">
                Vous êtes sur le point de RETENIR le projet "{projets.find(p => p.id === pendingStatusChange.projetId)?.projet}".
                Voulez-vous confirmer cette action ?
              </p>
              <div className="flex justify-center space-x-3">
                <Button variant="outline" size="sm" onClick={cancelStatusChange} className="text-gray-700 border-gray-300 hover:bg-gray-100">
                  Annuler
                </Button>
                <Button size="sm" onClick={confirmStatusChange} className="bg-green-600 hover:bg-green-700 text-white border-green-600">
                  Confirmer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Convention */}
      {showConventionModal && selectedProjet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-uh2c-blue border-b border-uh2c-blue/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Convention - {selectedProjet.projet}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConventionModal(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Informations du projet</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Programme</Label>
                        <p className="text-sm text-gray-900">{selectedProjet.programme}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Coordonnateur</Label>
                        <p className="text-sm text-gray-900">{selectedProjet.nomCoordonnateur} {selectedProjet.prenomCoordonnateur}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Budget</Label>
                        <p className="text-sm text-gray-900">{formatBudget(selectedProjet.budgetPropose)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-uh2c-blue hover:bg-uh2c-blue/90 text-white">
                        <FileText className="w-4 h-4 mr-2" />
                        Générer la convention
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Télécharger modèle
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Voir conventions existantes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Programme d'emploi */}
      {showProgrammeEmploiModal && selectedProjet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-uh2c-blue border-b border-uh2c-blue/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Programme d'emploi - {selectedProjet.projet}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProgrammeEmploiModal(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-6">
                {/* Informations du projet */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations du projet</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Budget total</Label>
                      <p className="text-lg font-bold text-uh2c-blue">{formatBudget(selectedProjet.budgetPropose)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Coordonnateur</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.nomCoordonnateur} {selectedProjet.prenomCoordonnateur}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Programme</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.programme}</p>
                    </div>
                  </div>
                </div>

                {/* Sélection de la tranche */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Saisie du budget par tranche</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">Sélectionner la tranche</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choisir une tranche" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tranche1">Tranche 1 - 30% (150.000 MAD)</SelectItem>
                          <SelectItem value="tranche2">Tranche 2 - 40% (200.000 MAD)</SelectItem>
                          <SelectItem value="tranche3">Tranche 3 - 30% (150.000 MAD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">Date de fin de tranche</Label>
                      <Input type="date" className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Saisie du budget par rubrique */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget utilisé par rubrique (réel consommé)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Personnel</Label>
                        <Input 
                          type="number" 
                          placeholder="Montant en MAD" 
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Équipement</Label>
                        <Input 
                          type="number" 
                          placeholder="Montant en MAD" 
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Fonctionnement</Label>
                        <Input 
                          type="number" 
                          placeholder="Montant en MAD" 
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Mission</Label>
                        <Input 
                          type="number" 
                          placeholder="Montant en MAD" 
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Publication</Label>
                        <Input 
                          type="number" 
                          placeholder="Montant en MAD" 
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Autres</Label>
                        <Input 
                          type="number" 
                          placeholder="Montant en MAD" 
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparaison budget prévisionnel vs réel */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparaison budget prévisionnel vs réel</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-medium text-gray-700">Rubrique</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-700">Prévisionnel</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-700">Réel</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-700">Écart</th>
                          <th className="text-center py-2 px-3 font-medium text-gray-700">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3">Personnel</td>
                          <td className="py-2 px-3 text-right">45.000 MAD</td>
                          <td className="py-2 px-3 text-right">42.500 MAD</td>
                          <td className="py-2 px-3 text-right text-green-600">-2.500 MAD</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="bg-green-100 text-green-800 text-xs">Sous-budget</Badge>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3">Équipement</td>
                          <td className="py-2 px-3 text-right">30.000 MAD</td>
                          <td className="py-2 px-3 text-right">32.000 MAD</td>
                          <td className="py-2 px-3 text-right text-red-600">+2.000 MAD</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="bg-red-100 text-red-800 text-xs">Dépassement</Badge>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3">Fonctionnement</td>
                          <td className="py-2 px-3 text-right">25.000 MAD</td>
                          <td className="py-2 px-3 text-right">24.800 MAD</td>
                          <td className="py-2 px-3 text-right text-green-600">-200 MAD</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="bg-green-100 text-green-800 text-xs">Sous-budget</Badge>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3">Mission</td>
                          <td className="py-2 px-3 text-right">20.000 MAD</td>
                          <td className="py-2 px-3 text-right">20.000 MAD</td>
                          <td className="py-2 px-3 text-right text-gray-600">0 MAD</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="bg-gray-100 text-gray-800 text-xs">Conforme</Badge>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3">Publication</td>
                          <td className="py-2 px-3 text-right">15.000 MAD</td>
                          <td className="py-2 px-3 text-right">15.700 MAD</td>
                          <td className="py-2 px-3 text-right text-red-600">+700 MAD</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="bg-red-100 text-red-800 text-xs">Dépassement</Badge>
                          </td>
                        </tr>
                        <tr className="bg-gray-50 font-medium">
                          <td className="py-2 px-3">Total</td>
                          <td className="py-2 px-3 text-right">135.000 MAD</td>
                          <td className="py-2 px-3 text-right">135.000 MAD</td>
                          <td className="py-2 px-3 text-right text-gray-600">0 MAD</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="bg-gray-100 text-gray-800 text-xs">Conforme</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="w-full bg-uh2c-blue hover:bg-uh2c-blue/90 text-white">
                      <FileText className="w-4 h-4 mr-2" />
                      Générer le document de justification
                    </Button>
                    <Button variant="outline" className="w-full">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Préparer déblocage tranche suivante
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Historique des programmes d'emploi
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Versements */}
      {showVersementsModal && selectedProjet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-uh2c-blue border-b border-uh2c-blue/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Gestion des versements - {selectedProjet.projet}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVersementsModal(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-6">
                {/* Informations du projet */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations du projet</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Programme</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.programme}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Coordonnateur</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.nomCoordonnateur} {selectedProjet.prenomCoordonnateur}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Établissement</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.etablissement}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Budget alloué</Label>
                      <p className="text-lg font-bold text-uh2c-blue">{formatBudget(selectedProjet.budgetPropose)}</p>
                    </div>
                  </div>
                </div>

                {/* Contrôles de tri */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Liste des projets classés par programme</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm font-medium text-gray-700">Trier par tranches:</Label>
                        <Select>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Ordre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asc">Croissant</SelectItem>
                            <SelectItem value="desc">Décroissant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Tableau des versements */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Programme</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Projet</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Nom coordonateur</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Prénom</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Établissement</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">Budget alloué</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Tranche 1</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Tranche 2</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{selectedProjet.programme}</td>
                          <td className="py-3 px-4 font-medium">{selectedProjet.projet}</td>
                          <td className="py-3 px-4">{selectedProjet.nomCoordonnateur}</td>
                          <td className="py-3 px-4">{selectedProjet.prenomCoordonnateur}</td>
                          <td className="py-3 px-4">{selectedProjet.etablissement}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatBudget(selectedProjet.budgetPropose)}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="tranche1-recu" />
                                <Label htmlFor="tranche1-recu" className="text-xs">Reçu</Label>
                              </div>
                              <Input 
                                type="date" 
                                className="w-32 text-xs h-8"
                                placeholder="Date réception"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="tranche2-recu" />
                                <Label htmlFor="tranche2-recu" className="text-xs">Reçu</Label>
                              </div>
                              <Input 
                                type="date" 
                                className="w-32 text-xs h-8"
                                placeholder="Date réception"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex flex-col space-y-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-7 text-xs"
                                title="Marquer comme envoyé"
                              >
                                <DollarSign className="w-3 h-3 mr-1" />
                                Envoyé
                              </Button>
                              <Input 
                                type="date" 
                                className="w-28 text-xs h-6"
                                placeholder="Date envoi"
                              />
                            </div>
                          </td>
                        </tr>
                        {/* Exemple avec d'autres projets */}
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">Programme National de Recherche en IA</td>
                          <td className="py-3 px-4 font-medium">Développement d'algorithmes d'IA</td>
                          <td className="py-3 px-4">Zahra</td>
                          <td className="py-3 px-4">Fatima</td>
                          <td className="py-3 px-4">ENSA Casablanca</td>
                          <td className="py-3 px-4 text-right font-medium">1.200.000 MAD</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="tranche1-recu-2" defaultChecked />
                                <Label htmlFor="tranche1-recu-2" className="text-xs">Reçu</Label>
                              </div>
                              <Input 
                                type="date" 
                                className="w-32 text-xs h-8"
                                defaultValue="2024-03-15"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="tranche2-recu-2" />
                                <Label htmlFor="tranche2-recu-2" className="text-xs">Reçu</Label>
                              </div>
                              <Input 
                                type="date" 
                                className="w-32 text-xs h-8"
                                placeholder="Date réception"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex flex-col space-y-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-7 text-xs"
                                title="Marquer comme envoyé"
                              >
                                <DollarSign className="w-3 h-3 mr-1" />
                                Envoyé
                              </Button>
                              <Input 
                                type="date" 
                                className="w-28 text-xs h-6"
                                placeholder="Date envoi"
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Résumé des versements */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé des versements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">Tranche 1</p>
                          <p className="text-sm text-green-600">{formatBudget(selectedProjet.budgetPropose * 0.3)} (30%)</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Reçu</Badge>
                      </div>
                      <p className="text-xs text-green-600 mt-2">Reçu le: 15/03/2024</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-yellow-800">Tranche 2</p>
                          <p className="text-sm text-yellow-600">{formatBudget(selectedProjet.budgetPropose * 0.4)} (40%)</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Envoyé</Badge>
                      </div>
                      <p className="text-xs text-yellow-600 mt-2">Envoyé le: 01/06/2024</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Tranche 3</p>
                          <p className="text-sm text-gray-600">{formatBudget(selectedProjet.budgetPropose * 0.3)} (30%)</p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-800">Non émis</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">En attente</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="w-full bg-uh2c-blue hover:bg-uh2c-blue/90 text-white">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Nouveau versement
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Générer rapport
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Historique complet
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Livrables */}
      {showLivrablesModal && selectedProjet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-uh2c-blue border-b border-uh2c-blue/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Livrables - {selectedProjet.projet}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLivrablesModal(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Tranches de livrables</h3>
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-green-800">Tranche 1 - Rapport initial</p>
                            <p className="text-sm text-green-600">Livré le 15/03/2024</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Livré</Badge>
                        </div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-yellow-800">Tranche 2 - Rapport intermédiaire</p>
                            <p className="text-sm text-yellow-600">Échéance: 15/06/2024</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
                        </div>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">Tranche 3 - Rapport final</p>
                            <p className="text-sm text-gray-600">Échéance: 15/12/2024</p>
                          </div>
                          <Badge className="bg-gray-100 text-gray-800">À venir</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-uh2c-blue hover:bg-uh2c-blue/90 text-white">
                        <Calendar className="w-4 h-4 mr-2" />
                        Nouveau livrable
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Planifier échéances
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Historique des livrables
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 