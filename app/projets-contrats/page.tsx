"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Filter, Eye, Edit, Trash2, FileText } from "lucide-react"
import Image from "next/image"

interface ProjetContrat {
  id: string
  typeProjetContrat: "Projet de recherche financé" | "Contrat de recherche"
  typeProjet: "National" | "International"
  coordonnateur: string
  intitule: string
  thematique: string
  organismeContractant: string
  codeReference: string
  anneeDebut: number
  organismesPartenaires: string
  budgetPremiereTranche: number
  budgetDeuxiemeTranche: number
  budgetTroisiemeTranche: number
  nombreDoctorants: number
  bourse: number
  mobilite: number
  phaseSoumission?: string
  phaseConvention?: string
  lien?: string
  justificatifs?: string
  membres?: string[]
}

export default function ProjetsContrats() {
  const [projets, setProjets] = useState<ProjetContrat[]>([
    {
      id: "PC001",
      typeProjetContrat: "Projet de recherche financé",
      typeProjet: "National",
      coordonnateur: "Dr. Ahmed Benali",
      intitule: "Développement d'un système IA pour la santé",
      thematique: "Intelligence Artificielle",
      organismeContractant: "Ministère de la Santé",
      codeReference: "MS-IA-2024-001",
      anneeDebut: 2024,
      organismesPartenaires: "CHU Hassan II, ENSA Casablanca",
      budgetPremiereTranche: 200000,
      budgetDeuxiemeTranche: 200000,
      budgetTroisiemeTranche: 100000,
      nombreDoctorants: 3,
      bourse: 2,
      mobilite: 1,
    },
    {
      id: "PC002",
      typeProjetContrat: "Contrat de recherche",
      typeProjet: "International",
      coordonnateur: "Dr. Fatima Zahra",
      intitule: "Recherche en cybersécurité avancée",
      thematique: "Cybersécurité",
      organismeContractant: "Union Européenne",
      codeReference: "EU-CYBER-2023-H2020",
      anneeDebut: 2023,
      organismesPartenaires: "Université de Paris, TU Munich",
      budgetPremiereTranche: 400000,
      budgetDeuxiemeTranche: 500000,
      budgetTroisiemeTranche: 300000,
      nombreDoctorants: 5,
      bourse: 3,
      mobilite: 2,
    },
  ])

  const [filteredProjets, setFilteredProjets] = useState<ProjetContrat[]>(projets)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterAnnee, setFilterAnnee] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showTypeSelection, setShowTypeSelection] = useState(true)
  const [showProgramSelection, setShowProgramSelection] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedProject, setSelectedProject] = useState("")
  const [requestToResearchPole, setRequestToResearchPole] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [showProgramSelectionMessage, setShowProgramSelectionMessage] = useState(true)
  const [lienJustificatifError, setLienJustificatifError] = useState("")
  const [anneeError, setAnneeError] = useState("")
  const [justificatifFile, setJustificatifFile] = useState<File | null>(null)
  const [fieldErrors, setFieldErrors] = useState({
    coordonnateur: false,
    intitule: false,
    thematique: false,
    organismeContractant: false,
    codeReference: false,
    organismesPartenaires: false
  })

  const [newProjet, setNewProjet] = useState<Partial<ProjetContrat>>({
    typeProjetContrat: "Projet de recherche financé",
    typeProjet: "National",
    coordonnateur: "",
    intitule: "",
    thematique: "",
    organismeContractant: "",
    codeReference: "",
    anneeDebut: new Date().getFullYear(),
    organismesPartenaires: "",
    budgetPremiereTranche: 0,
    budgetDeuxiemeTranche: 0,
    budgetTroisiemeTranche: 0,
    nombreDoctorants: 0,
    bourse: 0,
    mobilite: 0,
    phaseSoumission: "",
    phaseConvention: "",
    lien: "",
    justificatifs: "",
    membres: [],
  })

  // Filter logic
  const applyFilters = () => {
    let filtered = projets

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (projet) =>
          projet.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.coordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.thematique.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.organismeContractant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.codeReference.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((projet) => projet.typeProjet === filterType)
    }

    // Year filter
    if (filterAnnee !== "all") {
      filtered = filtered.filter((projet) => projet.anneeDebut.toString() === filterAnnee)
    }

    setFilteredProjets(filtered)
  }

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters()
  }, [searchTerm, filterType, filterAnnee])

  const handleAddProjet = () => {
    // Validation des champs obligatoires
    const errors = {
      coordonnateur: !newProjet.coordonnateur,
      intitule: !newProjet.intitule,
      thematique: !newProjet.thematique,
      organismeContractant: !newProjet.organismeContractant,
      codeReference: !newProjet.codeReference,
      organismesPartenaires: !newProjet.organismesPartenaires
    }
    
    if (Object.values(errors).some(Boolean)) {
      setFieldErrors(errors)
      return
    }
    
    // Validation d'année
    if (newProjet.anneeDebut && newProjet.anneeDebut > getCurrentYear()) {
      setAnneeError("L'année ne peut pas être supérieure à l'année actuelle")
      return
    }
    
    // Validation conditionnelle : lien OU justificatifs obligatoire
    if (!newProjet.lien && !justificatifFile) {
      setLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
      return
    }

      const selectedProjectInfo = getSelectedProjectInfo()
      const selectedProgramInfo = availablePrograms.find(p => p.id === selectedProgram)

      const id = `PC${String(projets.length + 1).padStart(3, "0")}`
      const projet: ProjetContrat = {
        id,
      typeProjetContrat: newProjet.typeProjetContrat!,
        typeProjet: newProjet.typeProjet!,
        coordonnateur: newProjet.coordonnateur!,
        intitule: selectedProjectInfo ? selectedProjectInfo.name : newProjet.intitule!,
        thematique: selectedProjectInfo ? selectedProjectInfo.name : newProjet.thematique!,
        organismeContractant: selectedProgramInfo ? selectedProgramInfo.organisme : newProjet.organismeContractant!,
        codeReference: selectedProgramInfo ? selectedProgramInfo.code : newProjet.codeReference!,
        anneeDebut: newProjet.anneeDebut!,
        organismesPartenaires: newProjet.organismesPartenaires!,
        budgetPremiereTranche: selectedProjectInfo ? Math.floor(selectedProjectInfo.budget / 3) : newProjet.budgetPremiereTranche!,
        budgetDeuxiemeTranche: selectedProjectInfo ? Math.floor(selectedProjectInfo.budget / 3) : newProjet.budgetDeuxiemeTranche!,
        budgetTroisiemeTranche: selectedProjectInfo ? Math.floor(selectedProjectInfo.budget / 3) : newProjet.budgetTroisiemeTranche!,
        nombreDoctorants: newProjet.nombreDoctorants!,
        bourse: newProjet.bourse!,
        mobilite: newProjet.mobilite!,
      phaseSoumission: newProjet.phaseSoumission,
      phaseConvention: newProjet.phaseConvention,
      lien: newProjet.lien,
      justificatifs: justificatifFile ? justificatifFile.name : "",
        membres: newProjet.membres || [],
      }

      setProjets([...projets, projet])
      setFilteredProjets([...projets, projet])
      setNewProjet({
      typeProjetContrat: "Projet de recherche financé",
        typeProjet: "National",
        coordonnateur: "",
        intitule: "",
        thematique: "",
        organismeContractant: "",
        codeReference: "",
        anneeDebut: new Date().getFullYear(),
        organismesPartenaires: "",
        budgetPremiereTranche: 0,
        budgetDeuxiemeTranche: 0,
        budgetTroisiemeTranche: 0,
        nombreDoctorants: 0,
        bourse: 0,
        mobilite: 0,
      phaseSoumission: "",
      phaseConvention: "",
      lien: "",
        justificatifs: "",
        membres: [],
      })
      setIsDialogOpen(false)
    setFieldErrors({ coordonnateur: false, intitule: false, thematique: false, organismeContractant: false, codeReference: false, organismesPartenaires: false })
    setLienJustificatifError("")
    setAnneeError("")
    setJustificatifFile(null)
  }

  const handleDeleteProjet = (id: string) => {
    const updatedProjets = projets.filter((p) => p.id !== id)
    setProjets(updatedProjets)
    setFilteredProjets(updatedProjets)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setShowTypeSelection(true)
    setShowProgramSelection(false)
    setShowProjectForm(false)
    setSelectedProgram("")
    setSelectedProject("")
    setShowProjects(false)
    setRequestToResearchPole(false)
    setShowProgramSelectionMessage(true)
    setShowProgramSelectionMessage(true)
    setNewProjet({
      typeProjetContrat: "Projet de recherche financé",
      typeProjet: "National",
      coordonnateur: "",
      intitule: "",
      thematique: "",
      organismeContractant: "",
      codeReference: "",
      anneeDebut: new Date().getFullYear(),
      organismesPartenaires: "",
      budgetPremiereTranche: 0,
      budgetDeuxiemeTranche: 0,
      budgetTroisiemeTranche: 0,
      nombreDoctorants: 0,
      bourse: 0,
      mobilite: 0,
      phaseSoumission: "",
      phaseConvention: "",
      lien: "",
      justificatifs: "",
      membres: [],
    })
    setFieldErrors({
      coordonnateur: false,
      intitule: false,
      thematique: false,
      organismeContractant: false,
      codeReference: false,
      organismesPartenaires: false
    })
    setLienJustificatifError("")
    setAnneeError("")
    setJustificatifFile(null)
  }

  const handleMemberToggle = (memberId: string) => {
    const currentMembers = newProjet.membres || []
    const updatedMembers = currentMembers.includes(memberId)
      ? currentMembers.filter(id => id !== memberId)
      : [...currentMembers, memberId]
    setNewProjet({ ...newProjet, membres: updatedMembers })
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getCurrentYear = () => new Date().getFullYear()

  const getUniqueYears = () => {
    const years = [...new Set(projets.map((p) => p.anneeDebut))].sort((a, b) => b - a)
    return years
  }

  // Fonction pour récupérer les informations du projet sélectionné
  const getSelectedProjectInfo = () => {
    if (!selectedProgram || !selectedProject) return null
    
    const program = availablePrograms.find(p => p.id === selectedProgram)
    if (!program) return null
    
    return program.projets.find(projet => projet.id === selectedProject)
  }

  // Liste fictive de membres
  const availableMembers = [
    { id: "1", name: "Dr. Ahmed Benali" },
    { id: "2", name: "Dr. Fatima Zahra" },
    { id: "3", name: "Dr. Sara El Harti" },
    { id: "4", name: "Dr. Mohamed Lahby" }
  ];

  // Liste des programmes disponibles avec leurs projets
  const availablePrograms = [
    { 
      id: "1", 
      name: "Programme National de Recherche en IA", 
      code: "PNR-IA-2024", 
      organisme: "Ministère de l'Enseignement Supérieur",
      projets: [
        { id: "1.1", name: "Développement d'algorithmes d'IA pour l'éducation", budget: 500000 },
        { id: "1.2", name: "Systèmes d'IA pour la santé préventive", budget: 750000 },
        { id: "1.3", name: "IA pour l'optimisation énergétique", budget: 600000 },
        { id: "1.4", name: "Intelligence artificielle pour la cybersécurité", budget: 800000 }
      ]
    },
    { 
      id: "2", 
      name: "Programme de Recherche en Cybersécurité", 
      code: "PR-CYB-2024", 
      organisme: "Agence Nationale de Sécurité",
      projets: [
        { id: "2.1", name: "Protection des infrastructures critiques", budget: 1200000 },
        { id: "2.2", name: "Cryptographie post-quantique", budget: 900000 },
        { id: "2.3", name: "Détection d'intrusions avancée", budget: 650000 },
        { id: "2.4", name: "Sécurité des réseaux 5G", budget: 1100000 }
      ]
    },
    { 
      id: "3", 
      name: "Programme de Recherche en Santé Numérique", 
      code: "PR-SN-2024", 
      organisme: "Ministère de la Santé",
      projets: [
        { id: "3.1", name: "Télémédecine pour zones rurales", budget: 400000 },
        { id: "3.2", name: "IA pour diagnostic médical", budget: 850000 },
        { id: "3.3", name: "Systèmes de surveillance épidémiologique", budget: 550000 },
        { id: "3.4", name: "Plateforme de santé connectée", budget: 700000 }
      ]
    },
    { 
      id: "4", 
      name: "Programme de Recherche en Énergies Renouvelables", 
      code: "PR-ER-2024", 
      organisme: "Ministère de l'Énergie",
      projets: [
        { id: "4.1", name: "Optimisation des panneaux solaires", budget: 600000 },
        { id: "4.2", name: "Stockage d'énergie renouvelable", budget: 950000 },
        { id: "4.3", name: "Éoliennes intelligentes", budget: 750000 },
        { id: "4.4", name: "Biomasse et bioénergie", budget: 500000 }
      ]
    },
    { 
      id: "5", 
      name: "Programme de Recherche en Agriculture Intelligente", 
      code: "PR-AI-2024", 
      organisme: "Ministère de l'Agriculture",
      projets: [
        { id: "5.1", name: "Agriculture de précision", budget: 450000 },
        { id: "5.2", name: "Capteurs IoT pour l'agriculture", budget: 350000 },
        { id: "5.3", name: "Gestion intelligente de l'irrigation", budget: 400000 },
        { id: "5.4", name: "Prédiction des récoltes par IA", budget: 550000 }
      ]
    },
    { 
      id: "6", 
      name: "Programme de Recherche en Transport Durable", 
      code: "PR-TD-2024", 
      organisme: "Ministère des Transports",
      projets: [
        { id: "6.1", name: "Véhicules électriques intelligents", budget: 1000000 },
        { id: "6.2", name: "Systèmes de transport en commun", budget: 800000 },
        { id: "6.3", name: "Logistique urbaine durable", budget: 600000 },
        { id: "6.4", name: "Infrastructure de recharge", budget: 700000 }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Projets et Contrats de Recherche</h1>
                <p className="text-gray-600 mt-2">Gérez vos projets de recherche et contrats</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open) {
                  // Empêcher la fermeture automatique si on est en train de sélectionner
                  if (showProgramSelection && selectedProject) {
                    return
                  }
                }
                setIsDialogOpen(open)
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau projet
                  </Button>
                </DialogTrigger>
                <DialogContent 
                  className="max-w-4xl max-h-[90vh] overflow-y-auto"
                  onPointerDownOutside={(e) => {
                    // Empêcher la fermeture si on est en train de sélectionner un projet
                    if (showProgramSelection && selectedProject) {
                      e.preventDefault()
                    }
                  }}
                >
                  <div>
                                    <DialogHeader className="pb-2">
                    <DialogTitle className="text-left text-xl font-bold text-black mb-1">
                      Ajouter un nouveau projet/contrat
                    </DialogTitle>
                  </DialogHeader>
                      
                      {/* Indicateur d'étapes */}
                      {/* SUPPRIMÉ : l'indicateur d'étapes visuel n'est plus affiché */}
                    {showTypeSelection ? (
                      <div className="py-8">
                        <div className="text-center mb-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez le type</h3>
                          <p className="text-sm text-gray-600">Choisissez entre un projet de recherche financé ou un contrat de recherche</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div 
                            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                              newProjet.typeProjetContrat === "Projet de recherche financé"
                                ? "border-uh2c-blue bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => {
                              setNewProjet({ ...newProjet, typeProjetContrat: "Projet de recherche financé" })
                              setShowTypeSelection(false)
                              setShowProgramSelection(true)
                            }}
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <FileText className="h-6 w-6 text-blue-600" />
                              </div>
                              <h4 className="font-medium text-gray-900 mb-2">Projet de recherche financé</h4>
                              <p className="text-sm text-gray-600">Projet de recherche avec financement externe</p>
                              <p className="text-xs text-blue-600 font-medium mt-1">Phase de soumission</p>
                            </div>
                          </div>
                          
                          <div 
                            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                              newProjet.typeProjetContrat === "Contrat de recherche"
                                ? "border-uh2c-blue bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => {
                              setNewProjet({ ...newProjet, typeProjetContrat: "Contrat de recherche" })
                              setShowTypeSelection(false)
                              setShowProjectForm(true)
                            }}
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <FileText className="h-6 w-6 text-green-600" />
                              </div>
                              <h4 className="font-medium text-gray-900 mb-2">Contrat de recherche</h4>
                              <p className="text-sm text-gray-600">Contrat de recherche avec un partenaire</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <Button variant="outline" onClick={handleDialogClose}>
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : showProgramSelection ? (
                      <div className="py-8">
                        {showProgramSelectionMessage && (
                          <div className="text-center mb-2">
                            <h3 className="text-lg font-medium text-black mb-1">Sélectionnez le programme</h3>
                            <p className="text-sm text-gray-600">Choisissez le programme de recherche correspondant à votre projet</p>
                          </div>
                        )}
                        
                        <div className="space-y-4 mb-6">
                          {availablePrograms.map((program) => (
                            <div key={program.id}>
                                                          <div 
                                className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                                  selectedProgram === program.id
                                    ? "border-uh2c-blue bg-gradient-to-r from-blue-50 to-blue-100"
                                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                }`}
                                onClick={() => {
                                  setSelectedProgram(program.id)
                                  // setShowProjects(true) // Commenté pour masquer les projets
                                  setSelectedProject("")
                                  setShowProgramSelectionMessage(false)
                                  setRequestToResearchPole(false)
                                  // Rediriger directement vers le formulaire
                                  setShowProjectForm(true)
                                }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">
                                      <div className={`w-1.5 h-1.5 rounded-full ${
                                        selectedProgram === program.id ? 'bg-uh2c-blue' : 'bg-gray-300'
                                      }`}></div>
                                      <h4 className="text-sm font-semibold text-gray-900">{program.name}</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code:</span>
                                        <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">{program.code}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Organisme:</span>
                                        <span className="text-sm text-gray-700">{program.organisme}</span>
                                      </div>
                                    </div>

                                  </div>
                                                                    <div className="flex items-center space-x-1">
                                    {selectedProgram === program.id && (
                                      <div className="w-5 h-5 bg-uh2c-blue rounded-full flex items-center justify-center shadow-sm">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}

                                  </div>
                                </div>
                                
                                {/* Affichage des projets du programme - MASQUÉ */}
                                {/* {selectedProgram === program.id && showProjects && (
                                  <div className="mt-3 pt-2 border-t border-blue-200">
                                    <div className="flex items-center gap-1 mb-2">
                                      <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                                      <h5 className="text-xs font-semibold text-gray-800">Projets du programme</h5>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                      {program.projets.map((projet) => (
                                                                                <div 
                                          key={projet.id}
                                          className={`border rounded p-2 cursor-pointer transition-all duration-200 ${
                                            selectedProject === projet.id
                                              ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-sm"
                                              : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setSelectedProject(projet.id)
                                            setShowProgramSelectionMessage(false)
                                            setRequestToResearchPole(false)
                                            // Garder la fenêtre ouverte - ne pas passer automatiquement au formulaire
                                          }}
                                        >
                                          <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                              <div className="flex items-center gap-1 mb-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                  selectedProject === projet.id ? 'bg-green-500' : 'bg-gray-300'
                                                }`}></div>
                                                <h6 className="font-medium text-gray-900 text-xs leading-tight">{projet.name}</h6>
                                              </div>
                                              <div className="flex items-center gap-1">
                                                <span className="text-xs font-medium text-gray-500">Budget:</span>
                                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-1 py-0.5 rounded">
                                                  {formatBudget(projet.budget)}
                                                </span>
                                              </div>
                                            </div>
                                            {selectedProject === projet.id && (
                                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )} */}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-200 pt-6 mt-6">
                          <div className="text-center">
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-600 mb-2">Votre programme n'est pas dans la liste ?</p>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setRequestToResearchPole(true)
                                  setShowProgramSelectionMessage(false)
                                  setSelectedProject("")
                                  setShowProjects(false)
                                  setSelectedProgram("")
                                }}
                                className="text-orange-600 border-orange-300 hover:bg-orange-50 hover:border-orange-400 transition-colors duration-200 px-6 py-2"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Demander au pôle de recherche
                              </Button>
                            </div>
                          </div>
                        </div>

                        {requestToResearchPole && (
                          <div className="border-2 border-orange-200 rounded-xl p-6 bg-gradient-to-r from-orange-50 to-orange-100 mt-4 shadow-sm">
                            <div className="flex items-start space-x-4">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-base font-semibold text-orange-800 mb-2">Demande envoyée au pôle de recherche</h4>
                                <p className="text-sm text-orange-700 leading-relaxed">
                                  Votre demande a été enregistrée. Le pôle de recherche vous contactera pour ajouter le nouveau programme.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Message informatif quand un projet est sélectionné - MASQUÉ */}
                        {/* {selectedProject && !requestToResearchPole && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <p className="text-sm text-green-700">
                                Projet sélectionné : <span className="font-medium">{getSelectedProjectInfo()?.name}</span>
                              </p>
                            </div>
                          </div>
                        )} */}

                        <div className="flex justify-between mt-6">
                          <Button variant="outline" onClick={() => {
                            setShowProgramSelection(false)
                            setShowTypeSelection(true)
                            setSelectedProgram("")
                            setSelectedProject("")
                            setRequestToResearchPole(false)
                            setShowProgramSelectionMessage(true)
                          }}>
                            Retour
                          </Button>
                          <div className="space-x-2">
                            <Button variant="outline" onClick={handleDialogClose}>
                              Annuler
                            </Button>
                            <Button 
                              onClick={() => {
                                if (selectedProgram || requestToResearchPole) {
                                  setShowProgramSelection(false)
                                  setShowProjectForm(true)
                                }
                              }}
                              disabled={!selectedProgram && !requestToResearchPole}
                              className="bg-uh2c-blue hover:bg-uh2c-blue/90"
                            >
                              Continuer
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                                                {/* Informations administratives (Affichées automatiquement) */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <h3 className="font-medium text-blue-900 mb-3"></h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-blue-800">Coordonnateur du projet</Label>
                              <p className="text-sm text-blue-700 mt-1">Dr. Youssef Alami</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-blue-800">Laboratoire de l'utilisateur</Label>
                              <p className="text-sm text-blue-700 mt-1">Laboratoire d'Informatique et Systèmes</p>
                            </div>
                          </div>
                          
                          {selectedProgram && selectedProject && (
                            <div className="mt-4 pt-4 border-t border-blue-200">
                              <h4 className="font-medium text-blue-900 mb-3">Projet sélectionné :</h4>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-sm font-medium text-blue-800">Intitulé</Label>
                                  <p className="text-sm text-blue-700 mt-1">{getSelectedProjectInfo()?.name || 'Non sélectionné'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-blue-800">Budget</Label>
                                  <p className="text-sm text-blue-700 mt-1">{getSelectedProjectInfo() ? formatBudget(getSelectedProjectInfo()!.budget) : 'Non sélectionné'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-blue-800">Programme</Label>
                                  <p className="text-sm text-blue-700 mt-1">{availablePrograms.find(p => p.id === selectedProgram)?.name || 'Non sélectionné'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-blue-800">Code</Label>
                                  <p className="text-sm text-blue-700 mt-1">{availablePrograms.find(p => p.id === selectedProgram)?.code || 'Non sélectionné'}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid gap-6 py-4">
                          {/* 1. Intitulé du projet */}
                          <div className="space-y-2">
                            <Label className={`text-sm font-medium ${fieldErrors.intitule ? 'text-red-600' : ''}`}>Intitulé du projet <span className="text-red-600">*</span></Label>
                            <Input
                              value={newProjet.intitule}
                              onChange={(e) => {
                                setNewProjet({ ...newProjet, intitule: e.target.value })
                                if (e.target.value) setFieldErrors(err => ({ ...err, intitule: false }))
                              }}
                              placeholder="Titre du projet"
                              className={fieldErrors.intitule ? 'border-red-500' : ''}
                            />
                            {fieldErrors.intitule && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                          </div>

                          {/* 2. Thématique du projet */}
                          <div className="space-y-2">
                            <Label className={`text-sm font-medium ${fieldErrors.thematique ? 'text-red-600' : ''}`}>Thématique du projet <span className="text-red-600">*</span></Label>
                            <Input
                              value={newProjet.thematique}
                              onChange={(e) => {
                                setNewProjet({ ...newProjet, thematique: e.target.value })
                                if (e.target.value) setFieldErrors(err => ({ ...err, thematique: false }))
                              }}
                              placeholder="Intelligence Artificielle"
                              className={fieldErrors.thematique ? 'border-red-500' : ''}
                            />
                            {fieldErrors.thematique && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                          </div>

                          {/* 3. Organismes partenaires */}
                          <div className="space-y-2">
                            <Label className={`text-sm font-medium ${fieldErrors.organismesPartenaires ? 'text-red-600' : ''}`}>Organismes partenaires <span className="text-red-600">*</span></Label>
                            <Textarea
                              value={newProjet.organismesPartenaires}
                              onChange={(e) => {
                                setNewProjet({ ...newProjet, organismesPartenaires: e.target.value })
                                if (e.target.value) setFieldErrors(err => ({ ...err, organismesPartenaires: false }))
                              }}
                              placeholder="CHU Hassan II, ENSA Casablanca, Université Mohammed V..."
                              rows={3}
                              className={fieldErrors.organismesPartenaires ? 'border-red-500' : ''}
                            />
                            {fieldErrors.organismesPartenaires && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                          </div>

                          {/* 4. Membres associés */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Membres associés</Label>
                            <p className="text-xs text-gray-500">Sélectionnez les membres impliqués dans cette soumission</p>
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <div className="space-y-3">
                        {availableMembers.map((member) => (
                          <div key={member.id} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={`member-${member.id}`}
                              checked={newProjet.membres?.includes(member.id) || false}
                              onChange={() => handleMemberToggle(member.id)}
                              className="h-4 w-4 text-uh2c-blue rounded"
                            />
                                    <Label htmlFor={`member-${member.id}`} className="text-sm flex-1">
                              {member.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                              
                      {newProjet.membres && newProjet.membres.length > 0 && (
                        <div className="mt-4 pt-3 border-t">
                          <Label className="text-xs font-medium text-gray-600">Membres sélectionnés :</Label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {newProjet.membres.map((id) => {
                              const m = availableMembers.find(mem => mem.id === id)
                              return m ? (
                                <span key={id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-uh2c-blue text-white">
                                  {m.name}
                                </span>
                              ) : null
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                          </div>

                          {/* 5. Nombre de doctorants impliqués */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Nombre de doctorants impliqués <span className="text-red-600">*</span></Label>
                            <Input
                              type="number"
                              min="0"
                              value={newProjet.nombreDoctorants}
                              onChange={(e) => setNewProjet({ ...newProjet, nombreDoctorants: parseInt(e.target.value) || 0 })}
                              placeholder="0"
                            />
                            
                            {/* Sous-champs indentés */}
                            <div className="ml-6 space-y-3 mt-3">
                          <div className="space-y-2">
                                <Label className="text-sm font-medium">Bourse <span className="text-red-600">*</span></Label>
                            <Input
                                  type="number"
                                  min="0"
                                  value={newProjet.bourse}
                                  onChange={(e) => setNewProjet({ ...newProjet, bourse: parseInt(e.target.value) || 0 })}
                                  placeholder="0"
                                />
                          </div>
                          <div className="space-y-2">
                                <Label className="text-sm font-medium">Mobilité</Label>
                            <Input
                                  type="number"
                                  min="0"
                                  value={newProjet.mobilite}
                                  onChange={(e) => setNewProjet({ ...newProjet, mobilite: parseInt(e.target.value) || 0 })}
                                  placeholder="0"
                                />
                          </div>
                            </div>
                          </div>

                          {/* 6. Année de début */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Année de début <span className="text-red-600">*</span></Label>
                            <Input
                              type="number"
                              min="2000"
                              max={new Date().getFullYear()}
                              value={newProjet.anneeDebut}
                              onChange={(e) => {
                                const year = parseInt(e.target.value) || 0
                                if (year > new Date().getFullYear()) {
                                  setAnneeError("L'année ne peut pas dépasser l'année en cours")
                                  return
                                }
                                setAnneeError("")
                                setNewProjet({ ...newProjet, anneeDebut: year })
                              }}
                              placeholder={new Date().getFullYear().toString()}
                              className={anneeError ? 'border-red-500' : ''}
                            />
                            {anneeError && <p className="text-xs text-red-600 mt-1">{anneeError}</p>}
                          </div>

                          {/* 7. Budget en dirhams */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Budget en dirhams <span className="text-red-600">*</span></Label>
                            <div className="ml-6 space-y-3">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Première tranche <span className="text-red-600">*</span></Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={newProjet.budgetPremiereTranche}
                                  onChange={(e) => setNewProjet({ ...newProjet, budgetPremiereTranche: parseInt(e.target.value) || 0 })}
                                  placeholder="0"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Deuxième tranche <span className="text-red-600">*</span></Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={newProjet.budgetDeuxiemeTranche}
                                  onChange={(e) => setNewProjet({ ...newProjet, budgetDeuxiemeTranche: parseInt(e.target.value) || 0 })}
                                  placeholder="0"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Troisième tranche</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={newProjet.budgetTroisiemeTranche}
                                  onChange={(e) => setNewProjet({ ...newProjet, budgetTroisiemeTranche: parseInt(e.target.value) || 0 })}
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          </div>

                          {/* 8. Justificatifs */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Justificatifs 
                              <span className={`ml-1 ${!newProjet.lien && !justificatifFile ? 'text-red-600' : 'text-gray-500'}`}>
                                {!newProjet.lien && !justificatifFile ? '*' : (!justificatifFile ? '(optionnel)' : '')}
                              </span>
                            </Label>
                            
                            {!justificatifFile ? (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null
                                    setJustificatifFile(file)
                                    if (file || newProjet.lien) {
                                      setLienJustificatifError("")
                                    }
                                  }}
                                  className="hidden"
                                  id="justificatif-input"
                                />
                                <label htmlFor="justificatif-input" className="cursor-pointer">
                                  <div className="space-y-3">
                                    <div className="mx-auto w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                      <FileText className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">
                                        Cliquez pour télécharger ou glissez-déposez
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        PDF, DOC, DOCX jusqu'à 10MB
                                      </p>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <span className="flex-1 text-sm text-gray-700 truncate">
                                  {justificatifFile.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setJustificatifFile(null)
                                    // Reset the file input
                                    const fileInput = document.getElementById('justificatif-input') as HTMLInputElement
                                    if (fileInput) fileInput.value = ''
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            
                            {lienJustificatifError && (
                              <p className="text-xs text-red-600 mt-1">{lienJustificatifError}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button variant="outline" onClick={() => {
                            if (newProjet.typeProjetContrat === "Projet de recherche financé") {
                              setShowProjectForm(false)
                              setShowProgramSelection(true)
                            } else {
                              setShowProjectForm(false)
                              setShowTypeSelection(true)
                            }
                          }}>
                            Retour
                          </Button>
                          <Button variant="outline" onClick={handleDialogClose}>
                            Annuler
                          </Button>
                          <Button onClick={handleAddProjet} className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                            Soumettre la demande de projet
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {/* Filters simplifiés */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtres et recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-end md:space-x-6 gap-4 md:gap-0">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type de contrat</Label>
                      <Select
                        value={filterType}
                        onValueChange={(value) => {
                          setFilterType(value)
                          applyFilters()
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les types</SelectItem>
                          <SelectItem value="National">National</SelectItem>
                          <SelectItem value="International">International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Année</Label>
                      <Select
                        value={filterAnnee}
                        onValueChange={(value) => {
                          setFilterAnnee(value)
                          applyFilters()
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les années</SelectItem>
                          {getUniqueYears().map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex-1 flex md:justify-end items-center mt-2 md:mt-0">
                    <div className="text-sm text-gray-600 mt-1">
                      {filteredProjets.length} projet(s)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Projects Table */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des projets et contrats</CardTitle>
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
                    <p className="text-sm text-gray-400">Ajustez vos filtres ou ajoutez un nouveau projet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Intitulé</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Coordonnateur</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Thématique</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Année</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">Budget Total</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Type</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Membres</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Doctorants</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjets.map((projet, index) => (
                          <tr key={projet.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="py-3 px-4 font-mono text-sm">{projet.id}</td>
                            <td className="py-3 px-4">
                              <div className="max-w-xs">
                                <p className="font-medium truncate" title={projet.intitule}>
                                  {projet.intitule}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{projet.codeReference}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="max-w-xs truncate" title={projet.coordonnateur}>
                                {projet.coordonnateur}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="max-w-xs truncate" title={projet.thematique}>
                                {projet.thematique}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">{projet.anneeDebut}</td>
                            <td className="py-3 px-4 text-right font-mono">
                              {formatBudget(
                                projet.budgetPremiereTranche +
                                  projet.budgetDeuxiemeTranche +
                                  projet.budgetTroisiemeTranche,
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge
                                variant={projet.typeProjet === "International" ? "default" : "secondary"}
                                className={
                                  projet.typeProjet === "International"
                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                    : "bg-green-100 text-green-800 border-green-200"
                                }
                              >
                                {projet.typeProjet}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {projet.membres && projet.membres.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {projet.membres.map((id) => {
                                    const m = availableMembers.find(mem => mem.id === id)
                                    return m ? (
                                      <span key={id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-uh2c-blue text-white">
                                        {m.name}
                                      </span>
                                    ) : null
                                  })}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="text-sm">
                                <div>{projet.nombreDoctorants} impliqués</div>
                                <div className="text-xs text-gray-500">{projet.bourse} bourses</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center space-x-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteProjet(projet.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
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
    </div>
  )
} 
