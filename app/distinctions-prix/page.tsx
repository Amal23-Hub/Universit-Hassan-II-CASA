"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Search, Filter, Eye, Edit, Trash2, LinkIcon, Upload, FileText } from "lucide-react"
import Image from "next/image"

interface DistinctionPrix {
  id: string
  intitule: string
  evenement?: string
  organisme?: string
  date: string // YYYY-MM-DD ou YYYY-MM ou YYYY
  dateType: "jour" | "mois" | "annee" // Type de précision de la date
  lien?: string
  justificatifs?: string
  decision?: string
  commentaireExpert?: string
  typeProjet?: "individuel" | "collectif"
  membres?: string[]
}

export default function DistinctionsPrix() {
  const [distinctions, setDistinctions] = useState<DistinctionPrix[]>([
    {
      id: "DP001",
      intitule: "Prix de l'Innovation Scientifique",
      evenement: "Conférence Nationale de la Recherche",
      organisme: "Ministère de l'Enseignement Supérieur",
      date: "2023-11-20",
      dateType: "jour",
      lien: "https://example.com/prix001",
      justificatifs: "prix001_certificat.pdf",
      decision: "Attribué",
      commentaireExpert: "Reconnaissance pour des travaux exceptionnels.",
      typeProjet: "individuel",
      membres: ["1"],
    },
    {
      id: "DP002",
      intitule: "Médaille d'Or de la Recherche",
      evenement: "Gala Annuel de la Science",
      organisme: "Académie Royale des Sciences",
      date: "2022-05",
      dateType: "mois",
      lien: "https://example.com/prix002",
      justificatifs: "prix002_medaille.pdf",
      decision: "Attribué",
      commentaireExpert: "Contribution significative à la science.",
      typeProjet: "individuel",
      membres: ["2"],
    },
    {
      id: "DP003",
      intitule: "Prix d'Excellence Académique",
      evenement: "Cérémonie de Distinction",
      organisme: "Université Hassan II",
      date: "2021",
      dateType: "annee",
      lien: "https://example.com/prix003",
      justificatifs: "prix003_excellence.pdf",
      decision: "Attribué",
      commentaireExpert: "Excellence dans l'enseignement et la recherche.",
      typeProjet: "individuel",
      membres: ["3"],
    },
    // Exemple collectif
    {
      id: "DP004",
      intitule: "Prix du Meilleur Projet Collaboratif",
      evenement: "Forum International de l'Innovation",
      organisme: "Organisation Mondiale de l'Innovation",
      date: "2023-06-15",
      dateType: "jour",
      lien: "https://example.com/prix004",
      justificatifs: "prix004_collaboratif.pdf",
      decision: "Attribué",
      commentaireExpert: "Projet collectif remarquable impliquant plusieurs membres.",
      typeProjet: "collectif",
      membres: ["1", "2", "3"],
    },
  ])

  const [filteredDistinctions, setFilteredDistinctions] = useState<DistinctionPrix[]>(distinctions)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAnnee, setFilterAnnee] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dateError, setDateError] = useState("")
  const [lienJustificatifError, setLienJustificatifError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({
    intitule: false,
    evenement: false,
    organisme: false,
    date: false
  })

  const [newDistinction, setNewDistinction] = useState<Partial<DistinctionPrix>>({
    intitule: "",
    evenement: "",
    organisme: "",
    date: "",
    dateType: "jour",
    lien: "",
    justificatifs: "",
    decision: "",
    commentaireExpert: "",
    typeProjet: "individuel",
    membres: [],
  })

  const [showMembersSection, setShowMembersSection] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filterTitre, setFilterTitre] = useState("all")
  const [filterEtat, setFilterEtat] = useState("all")
  const [availableMembers] = useState([
    { id: "1", nom: "Benali", prenom: "Ahmed", etat: "Actif", titre: "Dr." },
    { id: "2", nom: "Zahra", prenom: "Fatima", etat: "Actif", titre: "Dr." },
    { id: "3", nom: "El Harti", prenom: "Sara", etat: "Actif", titre: "Dr." },
    { id: "4", nom: "Lahby", prenom: "Mohamed", etat: "Actif", titre: "Dr." },
    { id: "5", nom: "Alaoui", prenom: "Karim", etat: "Actif", titre: "Pr." },
    { id: "6", nom: "Bennani", prenom: "Amina", etat: "Actif", titre: "Dr." }
  ])

  // Filter logic
  const applyFilters = () => {
    let filtered = distinctions

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (distinction) =>
          distinction.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
          distinction.evenement?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          distinction.organisme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          distinction.decision?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Year filter (based on date)
    if (filterAnnee !== "all") {
      filtered = filtered.filter((distinction) => distinction.date.startsWith(filterAnnee))
    }

    setFilteredDistinctions(filtered)
  }

  // Apply filters when dependencies change
  useState(() => {
    applyFilters()
  })

  const validateDate = (value: string, type: "jour" | "mois" | "annee") => {
    if (!value) {
      setDateError("")
      return true
    }
    if (type === "jour" && value > getCurrentDate()) {
      setDateError("La date ne peut pas dépasser aujourd'hui.")
      return false
    }
    if (type === "mois" && value > getCurrentMonth()) {
      setDateError("Le mois ne peut pas dépasser le mois en cours.")
      return false
    }
    if (type === "annee" && parseInt(value) > getCurrentYear()) {
      setDateError("L'année ne peut pas dépasser l'année en cours.")
      return false
    }
    setDateError("")
    return true
  }

  const handleAddDistinction = () => {
    // Validation des champs obligatoires
    const requiredFields = {
      intitule: newDistinction.intitule,
      evenement: newDistinction.evenement,
      organisme: newDistinction.organisme,
      date: newDistinction.date,
      dateType: newDistinction.dateType,
      justificatifs: newDistinction.justificatifs,
      typeProjet: newDistinction.typeProjet,
    }

    // Vérification supplémentaire pour les projets collectifs
    if (newDistinction.typeProjet === "collectif") {
      if (!newDistinction.membres || newDistinction.membres.length === 0) {
        alert("Veuillez sélectionner au moins un membre pour un projet collectif")
        return
      }
    }

    // Validation conditionnelle : lien OU justificatifs obligatoire
    if (!newDistinction.lien && !selectedFile) {
      setLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
      return
    }
    setLienJustificatifError("")

    // Vérification que tous les champs obligatoires sont remplis
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => {
        // Exclure justificatifs de la validation obligatoire car il peut être remplacé par lien
        if (key === "justificatifs") return false
        return !value
      })
      .map(([key]) => key)

    if (missingFields.length > 0) {
      const newFieldErrors = {
        intitule: !newDistinction.intitule,
        evenement: !newDistinction.evenement,
        organisme: !newDistinction.organisme,
        date: !newDistinction.date
      }
      setFieldErrors(newFieldErrors)
      return
    }
    setFieldErrors({
      intitule: false,
      evenement: false,
      organisme: false,
      date: false
    })

    if (!validateDate(newDistinction.date || "", newDistinction.dateType || "jour")) {
      return
    }

    const id = `DP${String(distinctions.length + 1).padStart(3, "0")}`
    const distinction: DistinctionPrix = {
      id,
      intitule: newDistinction.intitule!,
      evenement: newDistinction.evenement,
      organisme: newDistinction.organisme,
      date: newDistinction.date!,
      dateType: newDistinction.dateType!,
      lien: newDistinction.lien,
      justificatifs: newDistinction.justificatifs,
      decision: newDistinction.decision,
      commentaireExpert: newDistinction.commentaireExpert,
      typeProjet: newDistinction.typeProjet,
      membres: newDistinction.membres,
    }

    setDistinctions([...distinctions, distinction])
    setFilteredDistinctions([...distinctions, distinction])
    setNewDistinction({
      intitule: "",
      evenement: "",
      organisme: "",
      date: "",
      dateType: "jour",
      lien: "",
      justificatifs: "",
      decision: "",
      commentaireExpert: "",
      typeProjet: "individuel",
      membres: [],
    })
    setShowMembersSection(false)
    setSelectedFile(null)
    setIsDragOver(false)
    setIsDialogOpen(false)
  }

  const handleDeleteDistinction = (id: string) => {
    const updatedDistinctions = distinctions.filter((d) => d.id !== id)
    setDistinctions(updatedDistinctions)
    setFilteredDistinctions(updatedDistinctions)
  }

  const handleProjectTypeChange = (type: "individuel" | "collectif") => {
    setNewDistinction({ ...newDistinction, typeProjet: type })
    if (type === "individuel") {
      setNewDistinction({ ...newDistinction, typeProjet: type, membres: [] })
      setShowMembersSection(false)
    } else {
      setShowMembersSection(true)
    }
  }

  const handleMemberToggle = (memberId: string) => {
    const currentMembers = newDistinction.membres || []
    const updatedMembers = currentMembers.includes(memberId)
      ? currentMembers.filter(id => id !== memberId)
      : [...currentMembers, memberId]
    setNewDistinction({ ...newDistinction, membres: updatedMembers })
  }

  const handleRemoveMember = (memberName: string) => {
    // Extraire le nom de famille du nom complet pour trouver l'ID
    const memberNameParts = memberName.split(' ')
    const lastName = memberNameParts[1] // Le nom de famille est à l'index 1
    
    const memberToRemove = availableMembers.find(member => member.nom === lastName)
    if (memberToRemove) {
      const currentMembers = newDistinction.membres || []
      const updatedMembers = currentMembers.filter(id => id !== memberToRemove.id)
      setNewDistinction({ ...newDistinction, membres: updatedMembers })
    }
  }

  const handleDateTypeChange = (dateType: "jour" | "mois" | "annee") => {
    setNewDistinction({ ...newDistinction, dateType })
    
    // Ajuster le format de la date selon le type choisi
    if (newDistinction.date) {
      const currentDate = new Date(newDistinction.date)
      let formattedDate = ""
      
      switch (dateType) {
        case "jour":
          formattedDate = currentDate.toISOString().split('T')[0] // YYYY-MM-DD
          break
        case "mois":
          formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}` // YYYY-MM
          break
        case "annee":
          formattedDate = currentDate.getFullYear().toString() // YYYY
          break
      }
      
      setNewDistinction({ ...newDistinction, dateType, date: formattedDate })
    }
  }

  const formatDateForDisplay = (date: string, dateType: "jour" | "mois" | "annee") => {
    if (!date) return "-"
    
    switch (dateType) {
      case "jour":
        return new Date(date).toLocaleDateString('fr-FR')
      case "mois":
        const [year, month] = date.split('-')
        const monthNames = [
          'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
          'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ]
        return `${monthNames[parseInt(month) - 1]} ${year}`
      case "annee":
        return date
      default:
        return date
    }
  }

  const handleFileSelect = (file: File) => {
    // Validation du type de fichier
    const allowedTypes = ['.pdf', '.doc', '.docx']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Type de fichier non supporté. Veuillez sélectionner un fichier PDF, DOC ou DOCX.')
      return
    }
    
    // Validation de la taille (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      alert('Fichier trop volumineux. La taille maximale est de 10MB.')
      return
    }
    
    setSelectedFile(file)
    setNewDistinction({ ...newDistinction, justificatifs: file.name })
    setLienJustificatifError("")
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setNewDistinction({ ...newDistinction, justificatifs: "" })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Obtenir l'année actuelle pour limiter les dates
  const getCurrentYear = () => new Date().getFullYear()
  const getCurrentDate = () => new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const getCurrentMonth = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}` // YYYY-MM
  }

  const getSelectedMemberNames = () => {
    if (!newDistinction.membres || newDistinction.membres.length === 0) return []
    return availableMembers
      .filter(member => newDistinction.membres!.includes(member.id))
      .map(member => `${member.titre} ${member.nom} ${member.prenom}`)
  }

  const getMemberNamesByIds = (memberIds: string[] | undefined) => {
    if (!memberIds || memberIds.length === 0) return []
    return availableMembers
      .filter(member => memberIds.includes(member.id))
      .map(member => `${member.titre} ${member.nom} ${member.prenom}`)
  }

  // Filtrage des membres
  const filteredMembers = availableMembers.filter(member => {
    const titreMatch = filterTitre === "all" || member.titre === filterTitre
    const etatMatch = filterEtat === "all" || member.etat === filterEtat
    return titreMatch && etatMatch
  })

  const handleMemberSelect = (memberId: string) => {
    if (!newDistinction.membres?.includes(memberId)) {
      setNewDistinction(prev => ({
        ...prev,
        membres: [...(prev.membres || []), memberId]
      }))
    }
  }

  const getUniqueYears = () => {
    const years = [...new Set(distinctions.map((d) => d.date.substring(0, 4)))].sort((a, b) => Number(b) - Number(a))
    return years
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Distinctions et Prix</h1>
                <p className="text-gray-600 mt-1 text-sm">Gérez vos distinctions et prix reçus</p>
              </div>
            </div>

            {/* Filters */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label className="text-sm">Recherche</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          applyFilters()
                        }}
                        className="pl-10 h-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Année</Label>
                    <Select
                      value={filterAnnee}
                      onValueChange={(value) => {
                        setFilterAnnee(value)
                        applyFilters()
                      }}
                    >
                      <SelectTrigger className="h-9 mt-1">
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
                  <div>
                    <Label className="text-sm">Résultats</Label>
                    <div className="text-sm text-gray-600 mt-1">
                      {filteredDistinctions.length} distinction(s)
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-uh2c-blue hover:bg-uh2c-blue/90 h-9">
                          <Plus className="h-4 w-4 mr-2" />
                          Nouvelle distinction
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Ajouter une nouvelle distinction/prix</DialogTitle>
                          <DialogDescription>Remplissez les informations de la distinction ou du prix</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                          {/* Type de projet */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Type de projet <span className="text-red-600">*</span></Label>
                            <div className="flex gap-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="individuel"
                                  name="typeProjet"
                                  value="individuel"
                                  checked={newDistinction.typeProjet === "individuel"}
                                  onChange={() => handleProjectTypeChange("individuel")}
                                  className="h-4 w-4 text-uh2c-blue"
                                />
                                <Label htmlFor="individuel" className="text-sm">Projet individuel</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="collectif"
                                  name="typeProjet"
                                  value="collectif"
                                  checked={newDistinction.typeProjet === "collectif"}
                                  onChange={() => handleProjectTypeChange("collectif")}
                                  className="h-4 w-4 text-uh2c-blue"
                                />
                                <Label htmlFor="collectif" className="text-sm">Projet collectif</Label>
                              </div>
                            </div>
                          </div>

                          {/* Liste des membres - seulement si projet collectif */}
                          {newDistinction.typeProjet === "collectif" && (
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Membres associés <span className="text-red-600">*</span></Label>
                              
                              <div className="space-y-3">
                                {/* Filtres */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <Label className="text-xs font-medium text-gray-600">Filtrer par titre</Label>
                                    <Select onValueChange={(value) => setFilterTitre(value)}>
                                      <SelectTrigger className="mt-1 h-9 text-sm">
                                        <SelectValue placeholder="Tous les titres" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="all">Tous les titres</SelectItem>
                                        <SelectItem value="Dr.">Dr.</SelectItem>
                                        <SelectItem value="Pr.">Pr.</SelectItem>
                                        <SelectItem value="M.">M.</SelectItem>
                                        <SelectItem value="Mme.">Mme.</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label className="text-xs font-medium text-gray-600">Filtrer par qualité</Label>
                                    <Select onValueChange={(value) => setFilterEtat(value)}>
                                      <SelectTrigger className="mt-1 h-9 text-sm">
                                        <SelectValue placeholder="Toutes les qualités" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="all">Toutes les qualités</SelectItem>
                                        <SelectItem value="Actif">Actif</SelectItem>
                                        <SelectItem value="Inactif">Inactif</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {/* Liste déroulante des membres */}
                                <div>
                                  <Label className="text-xs font-medium text-gray-600">Sélectionner un membre</Label>
                                  <Select onValueChange={(value) => handleMemberSelect(value)}>
                                    <SelectTrigger className="mt-1 h-9 text-sm">
                                      <SelectValue placeholder="Choisir un membre..." />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60">
                                      {filteredMembers.map((member) => (
                                        <SelectItem key={member.id} value={member.id}>
                                          <div className="flex items-center justify-between w-full">
                                            <span>{member.nom} {member.prenom}</span>
                                            <div className="flex items-center gap-2 text-gray-500">
                                              <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0.5">
                                                {member.etat}
                                              </Badge>
                                              <span className="text-xs">{member.titre}</span>
                                            </div>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Membres sélectionnés */}
                                {getSelectedMemberNames().length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-gray-600 mb-2">Membres sélectionnés :</p>
                                    <div className="flex flex-wrap gap-1">
                                      {getSelectedMemberNames().map((name, index) => (
                                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-uh2c-blue text-white">
                                          {name}
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveMember(name)}
                                            className="ml-2 text-white hover:text-red-200"
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Intitulé et Evènement */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="intitule" className={fieldErrors.intitule ? "text-red-600" : ""}>
                                Intitulé <span className="text-red-600">*</span>
                              </Label>
                              <Input
                                id="intitule"
                                value={newDistinction.intitule}
                                onChange={(e) => {
                                  setNewDistinction({ ...newDistinction, intitule: e.target.value })
                                  if (fieldErrors.intitule) {
                                    setFieldErrors({ ...fieldErrors, intitule: false })
                                  }
                                }}
                                placeholder="Titre de la distinction"
                                className={fieldErrors.intitule ? "border-red-500 focus:border-red-500" : ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="evenement" className={fieldErrors.evenement ? "text-red-600" : ""}>
                                Evènement <span className="text-red-600">*</span>
                              </Label>
                              <Input
                                id="evenement"
                                value={newDistinction.evenement}
                                onChange={(e) => {
                                  setNewDistinction({ ...newDistinction, evenement: e.target.value })
                                  if (fieldErrors.evenement) {
                                    setFieldErrors({ ...fieldErrors, evenement: false })
                                  }
                                }}
                                placeholder="Conférence Nationale de la Recherche"
                                className={fieldErrors.evenement ? "border-red-500 focus:border-red-500" : ""}
                              />
                            </div>
                          </div>

                          {/* Organisme et Date */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="organisme" className={fieldErrors.organisme ? "text-red-600" : ""}>
                                Organisme <span className="text-red-600">*</span>
                              </Label>
                              <Input
                                id="organisme"
                                value={newDistinction.organisme}
                                onChange={(e) => {
                                  setNewDistinction({ ...newDistinction, organisme: e.target.value })
                                  if (fieldErrors.organisme) {
                                    setFieldErrors({ ...fieldErrors, organisme: false })
                                  }
                                }}
                                placeholder="Ministère de l'Enseignement Supérieur"
                                className={fieldErrors.organisme ? "border-red-500 focus:border-red-500" : ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="date" className={fieldErrors.date ? "text-red-600" : ""}>
                                Date <span className="text-red-600">*</span>
                              </Label>
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  {newDistinction.dateType === "jour" && (
                                    <Input
                                      type="date"
                                      value={newDistinction.date}
                                      max={getCurrentDate()}
                                      onChange={(e) => {
                                        setNewDistinction({ ...newDistinction, date: e.target.value })
                                        validateDate(e.target.value, "jour")
                                        if (fieldErrors.date) {
                                          setFieldErrors({ ...fieldErrors, date: false })
                                        }
                                      }}
                                      className={`flex-1 ${fieldErrors.date ? "border-red-500 focus:border-red-500" : ""}`}
                                    />
                                  )}
                                  {newDistinction.dateType === "mois" && (
                                    <Input
                                      type="month"
                                      value={newDistinction.date}
                                      max={getCurrentMonth()}
                                      onChange={(e) => {
                                        setNewDistinction({ ...newDistinction, date: e.target.value })
                                        validateDate(e.target.value, "mois")
                                        if (fieldErrors.date) {
                                          setFieldErrors({ ...fieldErrors, date: false })
                                        }
                                      }}
                                      className={`flex-1 ${fieldErrors.date ? "border-red-500 focus:border-red-500" : ""}`}
                                    />
                                  )}
                                  {newDistinction.dateType === "annee" && (
                                    <Input
                                      type="number"
                                      min="1900"
                                      max={getCurrentYear()}
                                      value={newDistinction.date}
                                      onChange={(e) => {
                                        setNewDistinction({ ...newDistinction, date: e.target.value })
                                        validateDate(e.target.value, "annee")
                                        if (fieldErrors.date) {
                                          setFieldErrors({ ...fieldErrors, date: false })
                                        }
                                      }}
                                      placeholder={getCurrentYear().toString()}
                                      className={`flex-1 ${fieldErrors.date ? "border-red-500 focus:border-red-500" : ""}`}
                                    />
                                  )}
                                  <Select
                                    value={newDistinction.dateType}
                                    onValueChange={handleDateTypeChange}
                                  >
                                    <SelectTrigger className="h-9 w-32">
                                      <SelectValue placeholder="Précision" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="jour">Date précise</SelectItem>
                                      <SelectItem value="mois">Mois/Année</SelectItem>
                                      <SelectItem value="annee">Année seulement</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {newDistinction.dateType === "jour" && "Sélectionnez le jour exact de la distinction"}
                                  {newDistinction.dateType === "mois" && "Sélectionnez le mois et l'année de la distinction"}
                                  {newDistinction.dateType === "annee" && "Saisissez uniquement l'année de la distinction"}
                                </p>
                                {dateError && (
                                  <p className="text-xs text-red-600 mt-1">{dateError}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Lien */}
                          <div className="space-y-2">
                            <Label htmlFor="lien">
                              Lien 
                              <span className={`ml-1 ${!newDistinction.lien && !selectedFile ? 'text-red-600' : 'text-gray-500'}`}>
                                {!newDistinction.lien && !selectedFile ? '*' : (selectedFile ? '(optionnel)' : '')}
                              </span>
                            </Label>
                            <Input
                              id="lien"
                              type="url"
                              value={newDistinction.lien}
                              onChange={(e) => {
                                setNewDistinction({ ...newDistinction, lien: e.target.value })
                                setLienJustificatifError("")
                              }}
                              placeholder="https://example.com/distinction"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                            </p>
                          </div>

                          {/* Justificatifs */}
                          <div className="space-y-2">
                            <Label htmlFor="justificatifs">
                              Justificatifs 
                              <span className={`ml-1 ${!newDistinction.lien && !selectedFile ? 'text-red-600' : 'text-gray-500'}`}>
                                {!newDistinction.lien && !selectedFile ? '*' : (newDistinction.lien ? '(optionnels)' : '')}
                              </span>
                            </Label>
                            
                            {!selectedFile ? (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={handleFileInputChange}
                                  className="hidden"
                                  id="file-input"
                                />
                                <label htmlFor="file-input" className="cursor-pointer">
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
                                  {selectedFile.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={removeFile}
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
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button onClick={handleAddDistinction} className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                            Ajouter la distinction
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distinctions Table */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Liste des distinctions et prix</h3>
                </div>
                {filteredDistinctions.length === 0 ? (
                  <div className="text-center py-6">
                    <Image
                      src="/empty-state.svg"
                      alt="Empty state"
                      width={80}
                      height={80}
                      className="mx-auto mb-3 opacity-50"
                    />
                    <p className="text-gray-500 text-sm">Aucune distinction trouvée</p>
                    <p className="text-xs text-gray-400">Ajustez vos filtres ou ajoutez une nouvelle distinction</p>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="overflow-x-auto max-w-6xl">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 font-medium text-gray-700 text-xs">Intitulé</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700 text-xs">Type</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700 text-xs">Evènement</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700 text-xs">Organisme</th>
                            <th className="text-center py-2 px-3 font-medium text-gray-700 text-xs">Date</th>
                            <th className="text-center py-2 px-3 font-medium text-gray-700 text-xs">Justifs</th>
                            <th className="text-center py-2 px-3 font-medium text-gray-700 text-xs">Liens</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700 text-xs">Décision</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700 text-xs">Commentaire</th>
                            <th className="text-center py-2 px-3 font-medium text-gray-700 text-xs">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDistinctions.map((distinction, index) => (
                            <tr key={distinction.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                              <td className="py-2 px-3">
                                <div className="max-w-xs truncate text-xs" title={distinction.intitule}>
                                  {distinction.intitule}
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <div className="max-w-xs truncate text-xs" title={distinction.typeProjet}>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                    distinction.typeProjet === "individuel" 
                                      ? "bg-blue-100 text-blue-800" 
                                      : "bg-green-100 text-green-800"
                                  }`}>
                                    {distinction.typeProjet === "collectif" ? "Collectif" : "Individuel"}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <div className="max-w-xs truncate text-xs" title={distinction.evenement}>
                                  {distinction.evenement || "-"}
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <div className="max-w-xs truncate text-xs" title={distinction.organisme}>
                                  {distinction.organisme || "-"}
                                </div>
                              </td>
                              <td className="py-2 px-3 text-center text-xs">
                                {formatDateForDisplay(distinction.date, distinction.dateType)}
                              </td>
                              <td className="py-2 px-3 text-center">
                                {distinction.justificatifs ? (
                                  <div className="flex items-center justify-center space-x-1">
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Télécharger le justificatif">
                                      <Upload className="h-3 w-3" />
                                    </Button>
                                    <span className="text-xs text-gray-600" title={distinction.justificatifs}>
                                      {distinction.justificatifs.length > 15 
                                        ? distinction.justificatifs.substring(0, 15) + '...' 
                                        : distinction.justificatifs
                                      }
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-xs">-</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-center">
                                {distinction.lien ? (
                                  <a href={distinction.lien} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 underline hover:text-blue-800 text-xs">
                                    Lien
                                    <LinkIcon className="h-3 w-3 ml-1" />
                                  </a>
                                ) : (
                                  <span className="text-gray-400 text-xs">-</span>
                                )}
                              </td>
                              <td className="py-2 px-3">
                                <div className="max-w-[120px] truncate text-xs" title={distinction.decision}>
                                  {distinction.decision || "-"}
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <div className="max-w-[150px] truncate text-xs" title={distinction.commentaireExpert}>
                                  {distinction.commentaireExpert || "-"}
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <div className="flex items-center justify-center space-x-1">
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteDistinction(distinction.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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