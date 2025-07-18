"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RefreshCw, Check, X, Eye, Search, ExternalLink, BookOpen, Plus, Edit, FileText, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Member {
  id: string
  name: string
  scopusId: string
  role: string
}

interface Publication {
  id: string
  title: string
  authors: string
  year: number
  source: "Scopus" | "WOS" | "ORCID" | "DOI"
  status: "pending" | "validated" | "rejected"
  category: string
  mode: string
  memberId: string
  doi?: string
  orcid?: string
  journal?: string
  citations?: number
  abstract?: string
  scopusUrl?: string
  wosUrl?: string
  orcidUrl?: string
  doiUrl?: string
  detectedAffiliation?: string
}

export default function PublicationsPage() {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [addManualDialogOpen, setAddManualDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterYear, setFilterYear] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterSource, setFilterSource] = useState<string>("all")
  const [filterMode, setFilterMode] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("")
  const [searchGlobal, setSearchGlobal] = useState("")
  const [selectedMemberId, setSelectedMemberId] = useState<string>("member1")
  const [lienJustificatifError, setLienJustificatifError] = useState("")
  const [yearError, setYearError] = useState("")
  const [manualFormData, setManualFormData] = useState({
    lien: "",
    justificatif: null as File | null
  })
  const [indexeeErrors, setIndexeeErrors] = useState({
    titre: false,
    journal: false,
    issn: false,
    base: false,
    annee: false
  })
  const [indexeeValues, setIndexeeValues] = useState({
    titre: '',
    journal: '',
    issn: '',
    base: '',
    annee: ''
  })
  const [ouvrageErrors, setOuvrageErrors] = useState({
    intitule: false,
    maisonEdition: false,
    annee: false
  })
  const [ouvrageValues, setOuvrageValues] = useState({
    intitule: '',
    maisonEdition: '',
    annee: ''
  })
  const [ouvrageFormData, setOuvrageFormData] = useState({
    lien: "",
    justificatif: null as File | null
  })
  const [ouvrageLienJustificatifError, setOuvrageLienJustificatifError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    year: new Date().getFullYear(),
    journal: "",
    doi: "",
    orcid: "",
    source: "",
    abstract: "",
    lien: "",
    justificatifs: [] as File[]
  })
  const [genericErrors, setGenericErrors] = useState({
    title: false,
    authors: false,
    year: false,
    source: false
  })
  const [commErrors, setCommErrors] = useState({
    intitule: false,
    manifestation: false,
    jour: false,
    mois: false,
    annee: false,
    ville: false,
    base: false,
    pays: false,
    justificatif: false
  })
  const [commValues, setCommValues] = useState({
    intitule: '',
    manifestation: '',
    jour: '',
    mois: '',
    annee: '',
    ville: '',
    base: '',
    pays: ''
  })
  const [commFormData, setCommFormData] = useState({
    lien: "",
    justificatif: null as File | null
  })
  const [commLienJustificatifError, setCommLienJustificatifError] = useState("")

  // Données des membres
  const [members, setMembers] = useState<Member[]>([
    {
      id: "member1",
      name: "Dr. Fatima EL HASSANI",
      scopusId: "57123456789",
      role: "Enseignant chercheur"
    }
  ])

  const [publications, setPublications] = useState<Publication[]>([
    {
      id: "1",
      title: "Deep Learning in Oncology",
      authors: "F. EL HASSANI, J. Smith",
      year: 2024,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      doi: "10.1234/abcd.2024.001",
      journal: "Iran Medicine",
      citations: 12,
      abstract:
        "This paper presents a comprehensive study on the application of deep learning techniques in oncology...",
      scopusUrl: "https://scopus.com/record/123",
      detectedAffiliation: "Université Hassan II Casablanca",
      category: "Publications",
      mode: "Automatique",
    },
    {
      id: "2",
      title: "NLP for Arabic Documents",
      authors: "F. EL HASSANI, A. BENALI, M. ALAMI",
      year: 2023,
      source: "WOS",
      status: "validated",
      memberId: "member1",
      doi: "10.5678/efgh.2023.002",
      journal: "Computer Science Review",
      citations: 8,
      abstract: "Natural language processing techniques for Arabic document analysis...",
      wosUrl: "https://webofscience.com/record/456",
      detectedAffiliation: "Université Hassan II Casablanca",
      category: "Communications",
      mode: "Automatique",
    },
    {
      id: "3",
      title: "Smart Cities and Sustainability",
      authors: "F. EL HASSANI, M. LAHBY, S. HASSAN",
      year: 2023,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      doi: "10.9012/ijkl.2023.003",
      journal: "Sustainable Cities Journal",
      citations: 15,
      abstract: "An analysis of smart city initiatives and their impact on sustainability...",
      scopusUrl: "https://scopus.com/record/789",
      detectedAffiliation: "Université Hassan II Casablanca",
      category: "Ouvrages",
      mode: "Manuel",
    },
    // Exemples supplémentaires pour tester la pagination
    {
      id: "4",
      title: "Blockchain for Secure Transactions",
      authors: "F. EL HASSANI, A. YOUSSEF, L. KHALID",
      year: 2022,
      source: "WOS",
      status: "pending",
      memberId: "member1",
      category: "Publications",
      mode: "Automatique",
    },
    {
      id: "5",
      title: "Quantum Computing: A New Era",
      authors: "F. EL HASSANI, S. AMINE, F. ZAHRA",
      year: 2021,
      source: "Scopus",
      status: "validated",
      memberId: "member1",
      category: "Ouvrages",
      mode: "Manuel",
    },
    {
      id: "6",
      title: "Edge AI for IoT Devices",
      authors: "F. EL HASSANI, M. BOUZID, H. EL MANSOURI",
      year: 2020,
      source: "WOS",
      status: "pending",
      memberId: "member1",
      category: "Communications",
      mode: "Automatique",
    },
    {
      id: "7",
      title: "Cybersecurity Trends in 2024",
      authors: "F. EL HASSANI, A. BENJELLOUN, K. LAMRANI",
      year: 2024,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      category: "Publications",
      mode: "Automatique",
    },
    {
      id: "8",
      title: "Big Data Analytics for Healthcare",
      authors: "F. EL HASSANI, N. EL FASSI, R. BOUZIANE",
      year: 2023,
      source: "WOS",
      status: "validated",
      memberId: "member1",
      category: "Ouvrages",
      mode: "Manuel",
    },
    {
      id: "9",
      title: "AI Ethics and Society",
      authors: "F. EL HASSANI, S. EL HARTI, M. CHAKIR",
      year: 2022,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      category: "Communications",
      mode: "Automatique",
    },
    {
      id: "10",
      title: "Natural Language Generation",
      authors: "F. EL HASSANI, A. EL MANSOURI, F. BENSAID",
      year: 2021,
      source: "WOS",
      status: "pending",
      memberId: "member1",
      category: "Publications",
      mode: "Automatique",
    },
    {
      id: "11",
      title: "Smart Grids and Renewable Energy",
      authors: "F. EL HASSANI, M. EL KADIRI, S. BERRADA",
      year: 2020,
      source: "Scopus",
      status: "validated",
      memberId: "member1",
      category: "Ouvrages",
      mode: "Manuel",
    },
    {
      id: "12",
      title: "Data Mining in Social Networks",
      authors: "F. EL HASSANI, H. EL AMRANI, L. BOUZID",
      year: 2023,
      source: "WOS",
      status: "pending",
      memberId: "member1",
      category: "Communications",
      mode: "Automatique",
    },
    {
      id: "13",
      title: "Machine Learning for Finance",
      authors: "F. EL HASSANI, A. EL BAKKALI, K. EL YOUSFI",
      year: 2022,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      category: "Publications",
      mode: "Automatique",
    },
    {
      id: "14",
      title: "Cloud Computing Security",
      authors: "F. EL HASSANI, S. EL HASSANI, M. BENALI",
      year: 2021,
      source: "WOS",
      status: "validated",
      memberId: "member1",
      category: "Ouvrages",
      mode: "Manuel",
    },
    {
      id: "15",
      title: "Prix d'Excellence en Recherche 2024",
      authors: "F. EL HASSANI",
      year: 2024,
      source: "Scopus",
      status: "validated",
      memberId: "member1",
      category: "Distinctions et Prix",
      mode: "Manuel",
    },
    {
      id: "16",
      title: "Distinction Honorifique - Académie des Sciences",
      authors: "F. EL HASSANI",
      year: 2023,
      source: "WOS",
      status: "pending",
      memberId: "member1",
      category: "Distinctions et Prix",
      mode: "Manuel",
    },
    {
      id: "17",
      title: "Médaille d'Or pour l'Innovation Technologique",
      authors: "F. EL HASSANI",
      year: 2022,
      source: "Scopus",
      status: "validated",
      memberId: "member1",
      category: "Distinctions et Prix",
      mode: "Automatique",
    },
    {
      id: "19",
      title: "État de l'art sur l'Intelligence Artificielle en 2024",
      authors: "F. EL HASSANI, A. BENNANI, M. EL KADIRI",
      year: 2024,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      category: "Revue bibliographique",
      mode: "Manuel",
    },
    {
      id: "20",
      title: "Revue systématique des méthodes de Deep Learning",
      authors: "F. EL HASSANI, S. EL HARTI, L. BOUZID",
      year: 2023,
      source: "WOS",
      status: "validated",
      memberId: "member1",
      category: "Revue bibliographique",
      mode: "Automatique",
    },
    {
      id: "21",
      title: "Analyse bibliométrique des publications en cybersécurité",
      authors: "F. EL HASSANI, N. EL FASSI, R. BOUZIANE",
      year: 2022,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      category: "Revue bibliographique",
      mode: "Manuel",
    },
    {
      id: "18",
      title: "Robotics in Industry 4.0",
      authors: "F. EL HASSANI, N. EL MOUTAWAKIL, F. EL HASSANI",
      year: 2020,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      category: "Communications",
      mode: "Automatique",
    },
  ])

  const handleValidatePublication = (pub: Publication) => {
    setPublications(publications.map((p) => (p.id === pub.id ? { ...p, status: "validated" as const } : p)))
    setDetailDialogOpen(false)
  }

  const handleRejectPublication = (pub: Publication) => {
    setPublications(publications.map((p) => (p.id === pub.id ? { ...p, status: "rejected" as const } : p)))
    setDetailDialogOpen(false)
  }

  const handleViewDetails = (pub: Publication) => {
    setSelectedPublication(pub)
    setDetailDialogOpen(true)
  }

  const handleAddManual = () => {
    setAddManualDialogOpen(true)
  }

  const handleAddAuto = () => {
    console.log("Ajouter automatiquement")
    // Logique pour ajouter automatiquement
  }

  // Obtenir l'année actuelle pour limiter la sélection
  const getCurrentYear = () => new Date().getFullYear()

  const getSelectedMember = () => {
    return members.find(m => m.id === selectedMemberId) || members[0]
  }

  const getStatusBadge = (status: Publication["status"]) => {
    switch (status) {
      case "validated":
        return <Badge className="bg-green-100 text-green-800">Validée</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">À valider</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejetée</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const getSourceBadge = (source: Publication["source"]) => {
    return source === "Scopus" ? (
      <Badge className="bg-orange-100 text-orange-800">Scopus</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800">WOS</Badge>
    )
  }

  const filteredPublications = publications.filter((pub) => {
    const matchesMember = pub.memberId === selectedMemberId;
    const matchesYear = filterYear === "all" || pub.year.toString() === filterYear;
    const matchesCategory = filterCategory === "all" || pub.category === filterCategory;
    const matchesSource = filterSource === "all" || pub.source === filterSource;
    const matchesMode = filterMode === "all" || pub.mode === filterMode;
    return matchesMember && matchesYear && matchesCategory && matchesSource && matchesMode;
  }).sort((a, b) => {
    // Trier par mode : Automatique en premier, Manuel à la fin
    if (a.mode === "Automatique" && b.mode === "Manuel") return -1;
    if (a.mode === "Manuel" && b.mode === "Automatique") return 1;
    
    // Si même mode, trier par année décroissante
    if (a.year !== b.year) return b.year - a.year;
    
    // Si même année, trier par titre alphabétiquement
    return a.title.localeCompare(b.title);
  });

  const validatedCount = publications.filter((p) => p.status === "validated").length
  const proposedCount = publications.filter((p) => p.status === "pending").length

  // Ajout de la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPublications.length / itemsPerPage);
  const paginatedPublications = filteredPublications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3">
          <div className="w-full max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 mb-1">Publications détectées pour :</h1>
                <div className="flex items-center gap-4">
                  <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                    <SelectTrigger className="w-80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} (Scopus ID: {member.scopusId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddManual} className="bg-uh2c-blue hover:bg-uh2c-blue/90 h-10">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter manuel
              </Button>
            </div>

            {/* Filtres avancés */}
            <Card className="mb-3">
              <CardContent className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  {/* Année */}
                  <div>
                    <Label className="text-sm">Année</Label>
                    <Select
                      value={filterYear}
                      onValueChange={value => setFilterYear(value)}
                    >
                      <SelectTrigger className="h-10 mt-1">
                        <SelectValue placeholder="Toutes les années" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les années</SelectItem>
                        {[...new Set(publications.map((p) => p.year))].sort((a, b) => b - a).map((year) => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Catégorie */}
                  <div>
                    <Label className="text-sm">Catégorie</Label>
                    <Select
                      value={filterCategory}
                      onValueChange={value => setFilterCategory(value)}
                    >
                      <SelectTrigger className="h-10 mt-1">
                        <SelectValue placeholder="Toutes les catégories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        <SelectItem value="Brevets et droits">Brevets et droits</SelectItem>
                        {[...new Set(publications.map((p) => p.category))].map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Mode */}
                  <div>
                    <Label className="text-sm">Mode</Label>
                    <Select
                      value={filterMode}
                      onValueChange={value => setFilterMode(value)}
                    >
                      <SelectTrigger className="h-10 mt-1">
                        <SelectValue placeholder="Tous les modes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les modes</SelectItem>
                        {[...new Set(publications.map((p) => p.mode))].map((mode) => (
                          <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Source */}
                  <div>
                    <Label className="text-sm">Source</Label>
                    <Select
                      value={filterSource}
                      onValueChange={value => setFilterSource(value)}
                    >
                      <SelectTrigger className="h-10 mt-1">
                        <SelectValue placeholder="Toutes les sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les sources</SelectItem>
                        <SelectItem value="Scopus">Scopus</SelectItem>
                        <SelectItem value="WOS">WOS</SelectItem>
                        <SelectItem value="ORCID">ORCID</SelectItem>
                        <SelectItem value="DOI">DOI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publications Table */}
            <Card className="mb-3">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-center py-1.5 px-2 font-medium text-gray-700 w-12">#</th>
                        <th className="text-left py-1.5 px-2 font-medium text-gray-700">Titre</th>
                        <th className="text-left py-1.5 px-2 font-medium text-gray-700">Année</th>
                        <th className="text-center py-1.5 px-2 font-medium text-gray-700">Catégorie</th>
                        <th className="text-center py-1.5 px-2 font-medium text-gray-700">Mode</th>
                        <th className="text-center py-1.5 px-2 font-medium text-gray-700">Source</th>
                        <th className="text-center py-1.5 px-2 font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPublications.map((pub, index) => (
                        <tr key={pub.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="py-1.5 px-2 text-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </span>
                          </td>
                          <td className="py-1.5 px-2 max-w-sm">
                            <div className="font-medium text-gray-900 truncate" title={pub.title}>
                              {pub.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate" title={pub.authors}>
                              {pub.authors}
                            </div>
                          </td>
                          <td className="py-1.5 px-2 text-gray-700">{pub.year}</td>
                          <td className="py-1.5 px-2 text-center">
                            <Badge variant="outline" className="text-xs">
                              {pub.category}
                            </Badge>
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <span className="text-xs text-gray-600">{pub.mode}</span>
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            {pub.source === "Scopus" ? (
                              <a 
                                href={pub.scopusUrl || "https://www.scopus.com"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center text-blue-600 underline hover:text-blue-800 text-xs"
                              >
                                Scopus
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            ) : pub.source === "WOS" ? (
                              <a 
                                href={pub.wosUrl || "https://www.webofscience.com"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center text-blue-600 underline hover:text-blue-800 text-xs"
                              >
                                WOS
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            ) : pub.source === "ORCID" ? (
                              <a 
                                href={pub.orcidUrl || "https://orcid.org"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center text-blue-600 underline hover:text-blue-800 text-xs"
                              >
                                ORCID
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            ) : pub.source === "DOI" ? (
                              <a 
                                href={pub.doiUrl || `https://doi.org/${pub.doi}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center text-blue-600 underline hover:text-blue-800 text-xs"
                              >
                                DOI
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            ) : (
                              <a 
                                href="#" 
                                className="inline-flex items-center text-blue-600 underline hover:text-blue-800 text-xs"
                                onClick={(e) => e.preventDefault()}
                              >
                                {pub.source}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            )}
                          </td>
                          <td className="py-1.5 px-2">
                            <div className="flex justify-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(pub)}
                                className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                title="Voir détails"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            
                              {pub.mode === "Manuel" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleValidatePublication(pub)}
                                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    title="Valider"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRejectPublication(pub)}
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    title="Rejeter"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 my-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        aria-label="Page précédente"
                      >
                        &lt;
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "default" : "ghost"}
                          size="icon"
                          className={`rounded-full ${currentPage === i + 1 ? 'bg-uh2c-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setCurrentPage(i + 1)}
                          aria-label={`Page ${i + 1}`}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        aria-label="Page suivante"
                      >
                        &gt;
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add Manual Button */}
            {/* 
            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleAddManual}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ajouter manuel
              </Button>
            </div>
            */}

            {/* My Publications Section - Commented out */}
            {/* 
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  MES PUBLICATIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Rechercher dans Scopus / WOS" className="pl-10" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Publications validées ({validatedCount})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium">Publications proposées ({proposedCount})</span>
                  </div>
                  <Button variant="ghost" className="flex items-center space-x-2 text-sm p-0 h-auto">
                    <Plus className="h-4 w-4" />
                    <span>Ajouter manuellement</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            */}
          </div>
        </main>
      </div>

      {/* Publication Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Détail de la publication (extrait {selectedPublication?.source})
            </DialogTitle>
          </DialogHeader>

          {selectedPublication && (
            <div className="space-y-6">
              {/* Publication Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Titre</label>
                  <p className="text-gray-900 font-medium">{selectedPublication.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Auteurs</label>
                  <p className="text-gray-900">{selectedPublication.authors}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">DOI</label>
                    <p className="text-gray-900 font-mono text-sm">{selectedPublication.doi}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Journal</label>
                    <p className="text-gray-900">{selectedPublication.journal}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Année</label>
                    <p className="text-gray-900">{selectedPublication.year}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Citations</label>
                    <p className="text-gray-900">
                      {selectedPublication.citations} fois ({selectedPublication.source})
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Résumé</label>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedPublication.abstract}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Associer à un projet:</label>
                    <Select>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="🔗 Projet X" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="project1">Projet X</SelectItem>
                        <SelectItem value="project2">Projet Y</SelectItem>
                        <SelectItem value="project3">Projet Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm" className="mt-6 bg-transparent">
                    Modifier
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Affiliation détectée:</label>
                    <p className="text-gray-900 mt-1">{selectedPublication.detectedAffiliation}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-6 bg-transparent">
                    <Edit className="h-4 w-4 mr-1" />
                    Corriger
                  </Button>
                </div>

                {/* External Links */}
                <div className="flex space-x-2">
                  {selectedPublication.scopusUrl && (
                    <a href={selectedPublication.scopusUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 underline hover:text-blue-800">
                      Voir sur Scopus
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                  {selectedPublication.wosUrl && (
                    <a href={selectedPublication.wosUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 underline hover:text-blue-800">
                      Voir sur WOS
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                  Fermer
                </Button>
                {selectedPublication.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleRejectPublication(selectedPublication)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Rejeter
                    </Button>
                    <Button
                      onClick={() => handleValidatePublication(selectedPublication)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Valider cette publication
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Manual Publication Dialog */}
      <Dialog open={addManualDialogOpen} onOpenChange={setAddManualDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Publication Manuelle
            </DialogTitle>
          </DialogHeader>

          {!selectedCategory ? (
            // Step 1: Select Category
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Veuillez d'abord sélectionner le type de publication à ajouter :</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Publications")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Publications</span>
                    <span className="text-sm text-gray-500">Articles scientifiques, revues, etc.</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Communications")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Communications</span>
                    <span className="text-sm text-gray-500">Présentations en conférences, colloques</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Ouvrages")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Ouvrages</span>
                    <span className="text-sm text-gray-500">Livres, monographies</span>
                  </div>
                </Button>
                

                
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Brevets et droits")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Brevets et droits</span>
                    <span className="text-sm text-gray-500">Brevets, propriété intellectuelle</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Distinctions et Prix")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Distinctions et Prix</span>
                    <span className="text-sm text-gray-500">Prix, distinctions, médailles, récompenses</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Revue bibliographique")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Revue bibliographique</span>
                    <span className="text-sm text-gray-500">États de l'art, revues systématiques, analyses bibliométriques</span>
                  </div>
                </Button>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setAddManualDialogOpen(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (selectedCategory === "Publications" || selectedCategory === "Communications") && !selectedSubCategory ? (
            // Step 1.5: Select Sub-Category
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {selectedCategory === "Publications" 
                    ? "Sélectionnez le type de publication :"
                    : "Sélectionnez le type de communication :"
                  }
                </p>
              </div>
              
              {selectedCategory === "Publications" ? (
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => setSelectedSubCategory("Publication dans une revue indexée")}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900">Publication dans une revue indexée</span>
                      <span className="text-sm text-gray-500">Articles publiés dans des revues indexées (Scopus, WOS, etc.)</span>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => setSelectedSubCategory("Publication dans une revue avec comité de lecture")}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900">Publication dans une revue avec comité de lecture</span>
                      <span className="text-sm text-gray-500">Articles avec processus de révision par les pairs</span>
                    </div>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => setSelectedSubCategory("Communication nationale")}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900">Communication nationale</span>
                      <span className="text-sm text-gray-500">Présentations dans des conférences nationales</span>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => setSelectedSubCategory("Communication internationale")}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900">Communication internationale</span>
                      <span className="text-sm text-gray-500">Présentations dans des conférences internationales</span>
                    </div>
                  </Button>
                </div>
              )}

              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedCategory("")}
                  className="flex items-center"
                >
                  ← Retour
                </Button>
                <Button variant="outline" onClick={() => {
                  setAddManualDialogOpen(false)
                  setSelectedCategory("")
                  setSelectedSubCategory("")
                }}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            // Step 2: Fill Publication Details
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (selectedCategory === "Publications" || selectedCategory === "Communications") {
                        setSelectedSubCategory("")
                      } else {
                        setSelectedCategory("")
                      }
                    }}
                    className="mr-2"
                  >
                    ← Retour
                  </Button>
                  <span className="text-sm text-gray-600">
                    {(selectedCategory === "Publications" || selectedCategory === "Communications") 
                      ? `Catégorie : ${selectedCategory} - ${selectedSubCategory}`
                      : `Catégorie : ${selectedCategory}`
                    }
                  </span>
                </div>
              </div>

              {(selectedSubCategory === "Publication dans une revue indexée" || selectedSubCategory === "Publication dans une revue avec comité de lecture") ? (
                <form className="space-y-8 rounded-lg shadow-md bg-white border p-6">
                  <div className="mb-4">
                    <Label htmlFor="titre-indexee">
                      Intitulé de la publication <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="titre-indexee" 
                      required 
                      placeholder="Titre de la publication" 
                      className={`h-11 rounded-lg text-base ${indexeeErrors.titre ? 'border-red-500' : ''}`}
                      value={indexeeValues.titre}
                      onChange={(e) => {
                        setIndexeeValues(v => ({ ...v, titre: e.target.value }))
                        if (e.target.value) setIndexeeErrors(err => ({ ...err, titre: false }))
                      }}
                    />
                    {indexeeErrors.titre && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="journal-indexee">
                      Libellé de la Revue/Journal <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="journal-indexee" 
                      required 
                      placeholder="Nom de la revue/journal" 
                      className={`h-11 rounded-lg text-base ${indexeeErrors.journal ? 'border-red-500' : ''}`}
                      value={indexeeValues.journal}
                      onChange={(e) => {
                        setIndexeeValues(v => ({ ...v, journal: e.target.value }))
                        if (e.target.value) setIndexeeErrors(err => ({ ...err, journal: false }))
                      }}
                    />
                    {indexeeErrors.journal && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  {selectedSubCategory === "Publication dans une revue indexée" && (
                    <>
                      <div className="mb-4">
                        <Label htmlFor="issn-indexee">
                          ISSN de la Revue/Journal <span className="text-red-600">*</span>
                        </Label>
                        <Input 
                          id="issn-indexee" 
                          required 
                          placeholder="ISSN" 
                          className={`h-11 rounded-lg text-base ${indexeeErrors.issn ? 'border-red-500' : ''}`}
                          value={indexeeValues.issn}
                          onChange={(e) => {
                            setIndexeeValues(v => ({ ...v, issn: e.target.value }))
                            if (e.target.value) setIndexeeErrors(err => ({ ...err, issn: false }))
                          }}
                        />
                        {indexeeErrors.issn && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                      </div>
                      <div className="mb-4">
                        <Label htmlFor="base-indexation">
                          Base d'indexation <span className="text-red-600">*</span>
                        </Label>
                        <Select
                          value={indexeeValues.base}
                          onValueChange={(value) => {
                            setIndexeeValues(v => ({ ...v, base: value }))
                            if (value) setIndexeeErrors(err => ({ ...err, base: false }))
                          }}
                        >
                          <SelectTrigger className={`h-11 rounded-lg text-base ${indexeeErrors.base ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Choisir une base d'indexation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Scopus">Scopus</SelectItem>
                            <SelectItem value="WOS">WOS</SelectItem>
                            <SelectItem value="ORCID">ORCID</SelectItem>
                            <SelectItem value="DOI">DOI</SelectItem>
                            <SelectItem value="DOAJ">DOAJ</SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        {indexeeErrors.base && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                      </div>
                      <div className="mb-4">
                        <Label htmlFor="doi-indexee">DOI</Label>
                        <Input id="doi-indexee" placeholder="10.1234/abcd.2024.001" className="h-11 rounded-lg text-base" />
                      </div>
                      <div className="mb-4">
                        <Label htmlFor="orcid-indexee">ORCID</Label>
                        <Input id="orcid-indexee" placeholder="0000-0000-0000-0000" className="h-11 rounded-lg text-base" />
                      </div>
                    </>
                  )}
                  <div className="mb-4">
                    <Label htmlFor="annee-indexee">
                      Année de publication <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="annee-indexee"
                      type="number"
                      min="1900"
                      max={getCurrentYear()}
                      placeholder={getCurrentYear().toString()}
                      className={`h-11 rounded-lg text-base ${yearError || indexeeErrors.annee ? 'border-red-500' : ''}`}
                      value={indexeeValues.annee}
                      onChange={(e) => {
                        setIndexeeValues(v => ({ ...v, annee: e.target.value }))
                        if (e.target.value) setIndexeeErrors(err => ({ ...err, annee: false }))
                        const year = parseInt(e.target.value)
                        if (year > getCurrentYear()) {
                          setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                        } else {
                          setYearError("")
                        }
                      }}
                    />
                    {(indexeeErrors.annee || yearError) && (
                      <p className="text-xs text-red-600 mt-1">{yearError || 'Ce champ est obligatoire'}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lien-revue">
                      Lien vers la revue
                      <span className={`ml-1 ${!manualFormData.lien && !manualFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!manualFormData.lien && !manualFormData.justificatif ? '*' : (!manualFormData.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien-revue" 
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base"
                      value={manualFormData.lien}
                      onChange={(e) => {
                        setManualFormData({ ...manualFormData, lien: e.target.value })
                        if (e.target.value || manualFormData.justificatif) {
                          setLienJustificatifError("")
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="justif-indexee">
                      Justificatif 
                      <span className={`ml-1 ${!manualFormData.lien && !manualFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!manualFormData.lien && !manualFormData.justificatif ? '*' : (!manualFormData.justificatif ? '(optionnel)' : '')}
                      </span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!manualFormData.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setManualFormData({ ...manualFormData, justificatif: file })
                            if (file || manualFormData.lien) {
                              setLienJustificatifError("")
                            }
                          }}
                          className="hidden"
                          id="justif-indexee"
                        />
                        <label htmlFor="justif-indexee" className="cursor-pointer">
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
                          {manualFormData.justificatif.name}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setManualFormData({ ...manualFormData, justificatif: null })
                            // Reset the file input
                            const fileInput = document.getElementById('justif-indexee') as HTMLInputElement
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
                  <div className="flex justify-end p-2 md:p-4">
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700 text-white mx-auto block w-full md:w-1/2 mt-6"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation de tous les champs obligatoires
                        let errors = { titre: false, journal: false, issn: false, base: false, annee: false }
                        if (!indexeeValues.titre) errors.titre = true
                        if (!indexeeValues.journal) errors.journal = true
                        if (!indexeeValues.issn) errors.issn = true
                        if (!indexeeValues.base) errors.base = true
                        if (!indexeeValues.annee) errors.annee = true
                        setIndexeeErrors(errors)
                        
                        // Validation d'année
                        const yearInput = document.getElementById('annee-indexee') as HTMLInputElement
                        if (yearInput && parseInt(yearInput.value) > getCurrentYear()) {
                          setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          return
                        }
                        
                        // Validation lien OU justificatif
                        if (!manualFormData.lien && !manualFormData.justificatif) {
                          setLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                          return
                        }
                        
                        // Si il y a des erreurs, ne pas continuer
                        if (Object.values(errors).some(Boolean)) {
                          return
                        }
                        
                        console.log("Publication ajoutée manuellement", { 
                          category: selectedCategory,
                          subCategory: selectedSubCategory,
                          manualFormData,
                          indexeeValues
                        })
                        
                        // Reset form
                        setManualFormData({ lien: "", justificatif: null })
                        setLienJustificatifError("")
                        setYearError("")
                        setIndexeeErrors({ titre: false, journal: false, issn: false, base: false, annee: false })
                        setIndexeeValues({ titre: '', journal: '', issn: '', base: '', annee: '' })
                      }}
                    >
                      Enregistrer
                    </Button>
                  </div>
                </form>
              ) : selectedSubCategory === "Communication nationale" ? (
                <form className="space-y-8 rounded-lg shadow-md bg-white border p-6">
                  <div className="mb-4">
                    <Label htmlFor="intitule-comm" className={commErrors.intitule ? 'text-red-600' : ''}>
                      Intitulé <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="intitule-comm" 
                      required 
                      placeholder="Intitulé de la communication" 
                      className={`h-11 rounded-lg text-base ${commErrors.intitule ? 'border-red-500' : ''}`}
                      value={commValues.intitule}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, intitule: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, intitule: false }))
                      }}
                    />
                    {commErrors.intitule && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="manifestation-comm" className={commErrors.manifestation ? 'text-red-600' : ''}>
                      Manifestation <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="manifestation-comm" 
                      required 
                      placeholder="Nom de la manifestation" 
                      className={`h-11 rounded-lg text-base ${commErrors.manifestation ? 'border-red-500' : ''}`}
                      value={commValues.manifestation}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, manifestation: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, manifestation: false }))
                      }}
                    />
                    {commErrors.manifestation && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-2 grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="jour-comm" className={commErrors.jour ? 'text-red-600' : ''}>Date <span className="text-red-600">*</span></Label>
                      <Select 
                        required
                        value={commValues.jour}
                        onValueChange={(value) => {
                          setCommValues(v => ({ ...v, jour: value }))
                          if (value) setCommErrors(err => ({ ...err, jour: false }))
                        }}
                      >
                        <SelectTrigger className={`h-11 rounded-lg text-base ${commErrors.jour ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Jour" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(31)].map((_, i) => (
                            <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {commErrors.jour && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div>
                      <Label htmlFor="mois-comm" className={`invisible ${commErrors.mois ? 'text-red-600' : ''}`}>Mois</Label>
                      <Select 
                        required
                        value={commValues.mois}
                        onValueChange={(value) => {
                          setCommValues(v => ({ ...v, mois: value }))
                          if (value) setCommErrors(err => ({ ...err, mois: false }))
                        }}
                      >
                        <SelectTrigger className={`h-11 rounded-lg text-base ${commErrors.mois ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Mois" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"].map((mois, i) => (
                            <SelectItem key={mois} value={mois}>{mois}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {commErrors.mois && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div>
                      <Label htmlFor="annee-comm" className={`invisible ${commErrors.annee ? 'text-red-600' : ''}`}>Année</Label>
                      <Input
                        id="annee-comm"
                        type="number"
                        min="1900"
                        max={getCurrentYear()}
                        placeholder={getCurrentYear().toString()}
                        className={`h-11 rounded-lg text-base ${yearError || commErrors.annee ? 'border-red-500' : ''}`}
                        value={commValues.annee}
                        onChange={(e) => {
                          setCommValues(v => ({ ...v, annee: e.target.value }))
                          if (e.target.value) setCommErrors(err => ({ ...err, annee: false }))
                          const year = parseInt(e.target.value)
                          if (year > getCurrentYear()) {
                            setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          } else {
                            setYearError("")
                          }
                        }}
                      />
                      {(commErrors.annee || yearError) && (
                        <p className="text-xs text-red-600 mt-1">{yearError || 'Ce champ est obligatoire'}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="ville-comm" className={commErrors.ville ? 'text-red-600' : ''}>
                      Ville <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="ville-comm" 
                      required 
                      placeholder="Ville" 
                      className={`h-11 rounded-lg text-base ${commErrors.ville ? 'border-red-500' : ''}`}
                      value={commValues.ville}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, ville: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, ville: false }))
                      }}
                    />
                    {commErrors.ville && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lien-manif-comm">
                      Lien vers la manifestation
                      <span className="text-gray-500 ml-1">(optionnel)</span>
                    </Label>
                    <Input 
                      id="lien-manif-comm" 
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base"
                      value={commFormData.lien}
                      onChange={(e) => {
                        setCommFormData({ ...commFormData, lien: e.target.value })
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="base-indexation-comm" className={commErrors.base ? 'text-red-600' : ''}>
                      Bases d'indexation <span className="text-red-600">*</span>
                    </Label>
                    <Select 
                      required
                      value={commValues.base}
                      onValueChange={(value) => {
                        setCommValues(v => ({ ...v, base: value }))
                        if (value) setCommErrors(err => ({ ...err, base: false }))
                      }}
                    >
                      <SelectTrigger className={`h-11 rounded-lg text-base ${commErrors.base ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Choisir une base d'indexation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scopus">Scopus</SelectItem>
                        <SelectItem value="WOS">WOS</SelectItem>
                        <SelectItem value="ORCID">ORCID</SelectItem>
                        <SelectItem value="DOI">DOI</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    {commErrors.base && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="doi-comm">DOI</Label>
                    <Input id="doi-comm" placeholder="10.1234/abcd.2024.001" className="h-11 rounded-lg text-base" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="orcid-comm">ORCID</Label>
                    <Input id="orcid-comm" placeholder="0000-0000-0000-0000" className="h-11 rounded-lg text-base" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="justif-comm" className={commErrors.justificatif ? 'text-red-600' : ''}>
                      Justificatif <span className="text-red-600">*</span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!commFormData.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setCommFormData({ ...commFormData, justificatif: file })
                            if (file) setCommErrors(err => ({ ...err, justificatif: false }))
                          }}
                          className="hidden"
                          id="justif-comm"
                        />
                        <label htmlFor="justif-comm" className="cursor-pointer">
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
                          {commFormData.justificatif.name}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCommFormData({ ...commFormData, justificatif: null })
                            setCommErrors(err => ({ ...err, justificatif: true }))
                            // Reset the file input
                            const fileInput = document.getElementById('justif-comm') as HTMLInputElement
                            if (fileInput) fileInput.value = ''
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {commErrors.justificatif && (
                      <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>
                    )}
                  </div>
                  <div className="flex justify-end p-2 md:p-4">
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700 text-white mx-auto block w-full md:w-1/2 mt-6"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation des champs obligatoires
                        const errors = {
                          intitule: !commValues.intitule,
                          manifestation: !commValues.manifestation,
                          jour: !commValues.jour,
                          mois: !commValues.mois,
                          annee: !commValues.annee,
                          ville: !commValues.ville,
                          base: !commValues.base,
                          pays: !commValues.pays,
                          justificatif: !commFormData.justificatif
                        }
                        
                        if (Object.values(errors).some(Boolean)) {
                          setCommErrors(errors)
                          return
                        }
                        
                        // Validation d'année
                        if (commValues.annee && parseInt(commValues.annee) > getCurrentYear()) {
                          setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          return
                        }
                        
                        // Validation lien OU justificatif
                        if (!commFormData.lien && !commFormData.justificatif) {
                          setCommLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                          return
                        }
                        
                        console.log("Communication nationale ajoutée manuellement", { 
                          category: selectedCategory,
                          subCategory: selectedSubCategory,
                          commValues,
                          commFormData
                        })
                        
                        // Reset form
                        setCommFormData({ lien: "", justificatif: null })
                        setCommLienJustificatifError("")
                        setYearError("")
                        setCommErrors({ intitule: false, manifestation: false, jour: false, mois: false, annee: false, ville: false, base: false, pays: false, justificatif: false })
                        setCommValues({ intitule: '', manifestation: '', jour: '', mois: '', annee: '', ville: '', base: '', pays: '' })
                      }}
                    >
                      Enregistrer
                    </Button>
                  </div>
                </form>
              ) : selectedSubCategory === "Communication internationale" ? (
                <form className="space-y-8 rounded-lg shadow-md bg-white border p-6">
                  <div className="mb-4">
                    <Label htmlFor="intitule-comm-inter" className={commErrors.intitule ? 'text-red-600' : ''}>
                      Intitulé <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="intitule-comm-inter" 
                      required 
                      placeholder="Intitulé de la communication" 
                      className={`h-11 rounded-lg text-base ${commErrors.intitule ? 'border-red-500' : ''}`}
                      value={commValues.intitule}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, intitule: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, intitule: false }))
                      }}
                    />
                    {commErrors.intitule && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="manifestation-comm-inter" className={commErrors.manifestation ? 'text-red-600' : ''}>
                      Manifestation <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="manifestation-comm-inter" 
                      required 
                      placeholder="Nom de la manifestation" 
                      className={`h-11 rounded-lg text-base ${commErrors.manifestation ? 'border-red-500' : ''}`}
                      value={commValues.manifestation}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, manifestation: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, manifestation: false }))
                      }}
                    />
                    {commErrors.manifestation && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-2 grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="jour-comm-inter" className={commErrors.jour ? 'text-red-600' : ''}>Date <span className="text-red-600">*</span></Label>
                      <Select 
                        required
                        value={commValues.jour}
                        onValueChange={(value) => {
                          setCommValues(v => ({ ...v, jour: value }))
                          if (value) setCommErrors(err => ({ ...err, jour: false }))
                        }}
                      >
                        <SelectTrigger className={`h-11 rounded-lg text-base ${commErrors.jour ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Jour" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(31)].map((_, i) => (
                            <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {commErrors.jour && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div>
                      <Label htmlFor="mois-comm-inter" className={`invisible ${commErrors.mois ? 'text-red-600' : ''}`}>Mois</Label>
                      <Select 
                        required
                        value={commValues.mois}
                        onValueChange={(value) => {
                          setCommValues(v => ({ ...v, mois: value }))
                          if (value) setCommErrors(err => ({ ...err, mois: false }))
                        }}
                      >
                        <SelectTrigger className={`h-11 rounded-lg text-base ${commErrors.mois ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Mois" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"].map((mois, i) => (
                            <SelectItem key={mois} value={mois}>{mois}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {commErrors.mois && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div>
                      <Label htmlFor="annee-comm-inter" className={`invisible ${commErrors.annee ? 'text-red-600' : ''}`}>Année</Label>
                      <Input
                        id="annee-comm-inter"
                        type="number"
                        min="1900"
                        max={getCurrentYear()}
                        placeholder={getCurrentYear().toString()}
                        className={`h-11 rounded-lg text-base ${yearError || commErrors.annee ? 'border-red-500' : ''}`}
                        value={commValues.annee}
                        onChange={(e) => {
                          setCommValues(v => ({ ...v, annee: e.target.value }))
                          if (e.target.value) setCommErrors(err => ({ ...err, annee: false }))
                          const year = parseInt(e.target.value)
                          if (year > getCurrentYear()) {
                            setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          } else {
                            setYearError("")
                          }
                        }}
                      />
                      {(commErrors.annee || yearError) && (
                        <p className="text-xs text-red-600 mt-1">{yearError || 'Ce champ est obligatoire'}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="ville-comm-inter" className={commErrors.ville ? 'text-red-600' : ''}>
                      Ville <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="ville-comm-inter" 
                      required 
                      placeholder="Ville" 
                      className={`h-11 rounded-lg text-base ${commErrors.ville ? 'border-red-500' : ''}`}
                      value={commValues.ville}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, ville: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, ville: false }))
                      }}
                    />
                    {commErrors.ville && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="pays-comm-inter" className={commErrors.pays ? 'text-red-600' : ''}>
                      Pays <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="pays-comm-inter" 
                      required 
                      placeholder="Pays" 
                      className={`h-11 rounded-lg text-base ${commErrors.pays ? 'border-red-500' : ''}`}
                      value={commValues.pays}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, pays: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, pays: false }))
                      }}
                    />
                    {commErrors.pays && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lien-manif-comm-inter">
                      Lien vers la manifestation
                      <span className={`ml-1 ${!commFormData.lien && !commFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!commFormData.lien && !commFormData.justificatif ? '*' : (!commFormData.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien-manif-comm-inter" 
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base"
                      value={commFormData.lien}
                      onChange={(e) => {
                        setCommFormData({ ...commFormData, lien: e.target.value })
                        if (e.target.value || commFormData.justificatif) {
                          setCommLienJustificatifError("")
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="base-indexation-comm-inter" className={commErrors.base ? 'text-red-600' : ''}>
                      Bases d'indexation <span className="text-red-600">*</span>
                    </Label>
                    <Select 
                      required
                      value={commValues.base}
                      onValueChange={(value) => {
                        setCommValues(v => ({ ...v, base: value }))
                        if (value) setCommErrors(err => ({ ...err, base: false }))
                      }}
                    >
                      <SelectTrigger className={`h-11 rounded-lg text-base ${commErrors.base ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Choisir une base d'indexation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scopus">Scopus</SelectItem>
                        <SelectItem value="WOS">WOS</SelectItem>
                        <SelectItem value="ORCID">ORCID</SelectItem>
                        <SelectItem value="DOI">DOI</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    {commErrors.base && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="doi-comm-inter">DOI</Label>
                    <Input id="doi-comm-inter" placeholder="10.1234/abcd.2024.001" className="h-11 rounded-lg text-base" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="orcid-comm-inter">ORCID</Label>
                    <Input id="orcid-comm-inter" placeholder="0000-0000-0000-0000" className="h-11 rounded-lg text-base" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="justif-comm-inter">
                      Justificatif 
                      <span className={`ml-1 ${!commFormData.lien && !commFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!commFormData.lien && !commFormData.justificatif ? '*' : (!commFormData.justificatif ? '(optionnel)' : '')}
                      </span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!commFormData.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setCommFormData({ ...commFormData, justificatif: file })
                            if (file) setCommErrors(err => ({ ...err, justificatif: false }))
                          }}
                          className="hidden"
                          id="justif-comm-inter"
                        />
                        <label htmlFor="justif-comm-inter" className="cursor-pointer">
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
                          {commFormData.justificatif.name}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCommFormData({ ...commFormData, justificatif: null })
                            // Reset the file input
                            const fileInput = document.getElementById('justif-comm-inter') as HTMLInputElement
                            if (fileInput) fileInput.value = ''
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                  </div>
                    )}
                    
                    {commLienJustificatifError && (
                      <p className="text-xs text-red-600 mt-1">{commLienJustificatifError}</p>
                    )}
                  </div>
                  <div className="flex justify-end p-2 md:p-4">
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700 text-white mx-auto block w-full md:w-1/2 mt-6"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation des champs obligatoires
                        const errors = {
                          intitule: !commValues.intitule,
                          manifestation: !commValues.manifestation,
                          jour: !commValues.jour,
                          mois: !commValues.mois,
                          annee: !commValues.annee,
                          ville: !commValues.ville,
                          pays: !commValues.pays,
                          base: !commValues.base
                        }
                        
                        if (Object.values(errors).some(Boolean)) {
                          setCommErrors(errors)
                          return
                        }
                        
                        // Validation d'année
                        if (commValues.annee && parseInt(commValues.annee) > getCurrentYear()) {
                          setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          return
                        }
                        
                        // Validation lien OU justificatif
                        if (!commFormData.lien && !commFormData.justificatif) {
                          setCommLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                          return
                        }
                        
                        console.log("Communication internationale ajoutée manuellement", { 
                          category: selectedCategory,
                          subCategory: selectedSubCategory,
                          commValues,
                          commFormData
                        })
                        
                        // Reset form
                        setCommFormData({ lien: "", justificatif: null })
                        setCommLienJustificatifError("")
                        setYearError("")
                        setCommErrors({ intitule: false, manifestation: false, jour: false, mois: false, annee: false, ville: false, pays: false, base: false, justificatif: false })
                        setCommValues({ intitule: '', manifestation: '', jour: '', mois: '', annee: '', ville: '', pays: '', base: '' })
                      }}
                    >
                      Enregistrer
                    </Button>
                  </div>
                </form>
              ) : selectedCategory === "Ouvrages" ? (
                <form className="space-y-8 rounded-lg shadow-md bg-white border p-6">
                  <div className="mb-4">
                    <Label htmlFor="intitule-ouvrage" className={ouvrageErrors.intitule ? 'text-red-600' : ''}>
                      Intitulé <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="intitule-ouvrage" 
                      required 
                      placeholder="Intitulé de l'ouvrage" 
                      className={`h-11 rounded-lg text-base ${ouvrageErrors.intitule ? 'border-red-500' : ''}`}
                      value={ouvrageValues.intitule}
                      onChange={(e) => {
                        setOuvrageValues(v => ({ ...v, intitule: e.target.value }))
                        if (e.target.value) setOuvrageErrors(err => ({ ...err, intitule: false }))
                      }}
                    />
                    {ouvrageErrors.intitule && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="maison-edition-ouvrage" className={ouvrageErrors.maisonEdition ? 'text-red-600' : ''}>
                      Maison d'édition <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="maison-edition-ouvrage" 
                      required 
                      placeholder="Maison d'édition" 
                      className={`h-11 rounded-lg text-base ${ouvrageErrors.maisonEdition ? 'border-red-500' : ''}`}
                      value={ouvrageValues.maisonEdition}
                      onChange={(e) => {
                        setOuvrageValues(v => ({ ...v, maisonEdition: e.target.value }))
                        if (e.target.value) setOuvrageErrors(err => ({ ...err, maisonEdition: false }))
                      }}
                    />
                    {ouvrageErrors.maisonEdition && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="annee-ouvrage" className={ouvrageErrors.annee ? 'text-red-600' : ''}>
                      Année <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="annee-ouvrage"
                      type="number"
                      min="1900"
                      max={getCurrentYear()}
                      placeholder={getCurrentYear().toString()}
                      className={`h-11 rounded-lg text-base ${yearError || ouvrageErrors.annee ? 'border-red-500' : ''}`}
                      value={ouvrageValues.annee}
                      onChange={(e) => {
                        setOuvrageValues(v => ({ ...v, annee: e.target.value }))
                        if (e.target.value) setOuvrageErrors(err => ({ ...err, annee: false }))
                        const year = parseInt(e.target.value)
                        if (year > getCurrentYear()) {
                          setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                        } else {
                          setYearError("")
                        }
                      }}
                    />
                    {(ouvrageErrors.annee || yearError) && (
                      <p className="text-xs text-red-600 mt-1">{yearError || 'Ce champ est obligatoire'}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="issn-ouvrage">ISSN</Label>
                    <Input id="issn-ouvrage" placeholder="ISSN" className="h-11 rounded-lg text-base" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="isbn-ouvrage">ISBN</Label>
                    <Input id="isbn-ouvrage" placeholder="ISBN" className="h-11 rounded-lg text-base" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="doi-ouvrage">DOI</Label>
                    <Input id="doi-ouvrage" placeholder="10.1234/abcd.2024.001" className="h-11 rounded-lg text-base" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="orcid-ouvrage">ORCID</Label>
                    <Input id="orcid-ouvrage" placeholder="0000-0000-0000-0000" className="h-11 rounded-lg text-base" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lien-ouvrage">
                      Lien
                      <span className={`ml-1 ${!ouvrageFormData.lien && !ouvrageFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!ouvrageFormData.lien && !ouvrageFormData.justificatif ? '*' : (!ouvrageFormData.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien-ouvrage" 
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base"
                      value={ouvrageFormData.lien}
                      onChange={(e) => {
                        setOuvrageFormData({ ...ouvrageFormData, lien: e.target.value })
                        if (e.target.value || ouvrageFormData.justificatif) {
                          setOuvrageLienJustificatifError("")
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="justif-ouvrage">
                      Justificatif 
                      <span className={`ml-1 ${!ouvrageFormData.lien && !ouvrageFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!ouvrageFormData.lien && !ouvrageFormData.justificatif ? '*' : (!ouvrageFormData.justificatif ? '(optionnel)' : '')}
                      </span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!ouvrageFormData.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setOuvrageFormData({ ...ouvrageFormData, justificatif: file })
                            if (file || ouvrageFormData.lien) {
                              setOuvrageLienJustificatifError("")
                            }
                          }}
                          className="hidden"
                          id="justif-ouvrage"
                        />
                        <label htmlFor="justif-ouvrage" className="cursor-pointer">
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
                          {ouvrageFormData.justificatif.name}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setOuvrageFormData({ ...ouvrageFormData, justificatif: null })
                            // Reset the file input
                            const fileInput = document.getElementById('justif-ouvrage') as HTMLInputElement
                            if (fileInput) fileInput.value = ''
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                  </div>
                    )}
                    
                    {ouvrageLienJustificatifError && (
                      <p className="text-xs text-red-600 mt-1">{ouvrageLienJustificatifError}</p>
                    )}
                  </div>
                  <div className="flex justify-end p-2 md:p-4">
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700 text-white mx-auto block w-full md:w-1/2 mt-6"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation des champs obligatoires
                        const errors = {
                          intitule: !ouvrageValues.intitule,
                          maisonEdition: !ouvrageValues.maisonEdition,
                          annee: !ouvrageValues.annee
                        }
                        
                        if (Object.values(errors).some(Boolean)) {
                          setOuvrageErrors(errors)
                          return
                        }
                        
                        // Validation d'année
                        if (ouvrageValues.annee && parseInt(ouvrageValues.annee) > getCurrentYear()) {
                          setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          return
                        }
                        
                        // Validation lien OU justificatif
                        if (!ouvrageFormData.lien && !ouvrageFormData.justificatif) {
                          setOuvrageLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                          return
                        }
                        
                        console.log("Ouvrage ajouté manuellement", { 
                          category: selectedCategory,
                          subCategory: selectedSubCategory,
                          ouvrageValues,
                          ouvrageFormData
                        })
                        
                        // Reset form
                        setOuvrageFormData({ lien: "", justificatif: null })
                        setOuvrageLienJustificatifError("")
                        setYearError("")
                        setOuvrageErrors({ intitule: false, maisonEdition: false, annee: false })
                        setOuvrageValues({ intitule: '', maisonEdition: '', annee: '' })
                      }}
                    >
                      Enregistrer
                    </Button>
                  </div>
                </form>
              ) : (
                // Formulaire classique pour les autres cas
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Label htmlFor="title" className={genericErrors.title ? 'text-red-600' : ''}>
                        Titre de la publication <span className="text-red-600">*</span>
                      </Label>
                      <Input 
                        id="title" 
                        required 
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ ...formData, title: e.target.value })
                          if (e.target.value) setGenericErrors(err => ({ ...err, title: false }))
                        }}
                        placeholder="Entrez le titre..." 
                        className={`h-11 rounded-lg text-base ${genericErrors.title ? 'border-red-500' : ''}`}
                      />
                      {genericErrors.title && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="authors" className={genericErrors.authors ? 'text-red-600' : ''}>
                        Auteurs <span className="text-red-600">*</span>
                      </Label>
                      <Input 
                        id="authors" 
                        required 
                        value={formData.authors}
                        onChange={(e) => {
                          setFormData({ ...formData, authors: e.target.value })
                          if (e.target.value) setGenericErrors(err => ({ ...err, authors: false }))
                        }}
                        placeholder="Entrez les auteurs..." 
                        className={`h-11 rounded-lg text-base ${genericErrors.authors ? 'border-red-500' : ''}`}
                      />
                      {genericErrors.authors && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Label htmlFor="year" className={genericErrors.year ? 'text-red-600' : ''}>
                        Année <span className="text-red-600">*</span>
                      </Label>
                      <Input 
                        id="year" 
                        type="number" 
                        min="1900" 
                        max={getCurrentYear()} 
                        required 
                        value={formData.year}
                        onChange={(e) => {
                          setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })
                          if (e.target.value) setGenericErrors(err => ({ ...err, year: false }))
                          const year = parseInt(e.target.value)
                          if (year > getCurrentYear()) {
                            setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          } else {
                            setYearError("")
                          }
                        }}
                        placeholder={getCurrentYear().toString()} 
                        className={`h-11 rounded-lg text-base ${yearError || genericErrors.year ? 'border-red-500' : ''}`}
                      />
                      {(genericErrors.year || yearError) && (
                        <p className="text-xs text-red-600 mt-1">{yearError || 'Ce champ est obligatoire'}</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="journal">
                        Journal/Revue
                      </Label>
                      <Input 
                        id="journal" 
                        value={formData.journal}
                        onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                        placeholder="Nom du journal..." 
                        className="h-11 rounded-lg text-base" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Label htmlFor="doi">DOI</Label>
                      <Input 
                        id="doi" 
                        value={formData.doi}
                        onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                        placeholder="10.1234/abcd.2024.001" 
                        className="h-11 rounded-lg text-base" 
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="orcid">ORCID</Label>
                      <Input 
                        id="orcid" 
                        value={formData.orcid}
                        onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
                        placeholder="0000-0000-0000-0000" 
                        className="h-11 rounded-lg text-base" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Label htmlFor="source" className={genericErrors.source ? 'text-red-600' : ''}>
                        Source <span className="text-red-600">*</span>
                      </Label>
                      <Select 
                        value={formData.source} 
                        onValueChange={(value) => {
                          setFormData({ ...formData, source: value })
                          if (value) setGenericErrors(err => ({ ...err, source: false }))
                        }}
                      >
                        <SelectTrigger className={`h-11 rounded-lg text-base ${genericErrors.source ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Sélectionnez une source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Scopus">Scopus</SelectItem>
                          <SelectItem value="WOS">WOS</SelectItem>
                          <SelectItem value="ORCID">ORCID</SelectItem>
                          <SelectItem value="DOI">DOI</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      {genericErrors.source && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="abstract">Résumé</Label>
                      <Textarea 
                        id="abstract" 
                        value={formData.abstract}
                        onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                        placeholder="Entrez le résumé de la publication..." 
                        rows={4} 
                        className="h-11 rounded-lg text-base" 
                      />
                    </div>
                  </div>

                  {/* Lien */}
                  <div className="mb-4">
                    <Label htmlFor="lien">
                      Lien 
                      <span className={`ml-1 ${!formData.lien && formData.justificatifs.length === 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {!formData.lien && formData.justificatifs.length === 0 ? '*' : (!formData.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien" 
                      type="url"
                      value={formData.lien}
                      onChange={(e) => {
                        setFormData({ ...formData, lien: e.target.value })
                        setLienJustificatifError("")
                      }}
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base" 
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>

                  {/* Justificatifs */}
                  <div className="mb-4">
                    <Label htmlFor="justificatifs">
                      Justificatifs 
                      <span className={`ml-1 ${!formData.lien && formData.justificatifs.length === 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {!formData.lien && formData.justificatifs.length === 0 ? '*' : (!formData.justificatifs.length ? '(optionnels)' : '')}
                      </span>
                    </Label>
                    
                    {formData.justificatifs.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files) {
                              setFormData({ ...formData, justificatifs: Array.from(e.target.files || []) })
                              setLienJustificatifError("")
                            }
                          }}
                          className="hidden"
                          id="justificatifs"
                        />
                        <label htmlFor="justificatifs" className="cursor-pointer">
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
                      <div className="space-y-2">
                        {formData.justificatifs.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <span className="flex-1 text-sm text-gray-700 truncate">
                              {file.name}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newFiles = formData.justificatifs.filter((_, i) => i !== index)
                                setFormData({ ...formData, justificatifs: newFiles })
                                // Reset the file input if no files left
                                if (newFiles.length === 0) {
                                  const fileInput = document.getElementById('justificatifs') as HTMLInputElement
                                  if (fileInput) fileInput.value = ''
                                }
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {lienJustificatifError && (
                      <p className="text-xs text-red-600 mt-1">{lienJustificatifError}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 p-2 md:p-4">
                    <Button variant="outline" onClick={() => {
                      setAddManualDialogOpen(false)
                      setSelectedCategory("")
                      setSelectedSubCategory("")
                    }}>
                      Annuler
                    </Button>
                    <Button onClick={() => {
                      // Validation des champs obligatoires
                      const errors = {
                        title: !formData.title,
                        authors: !formData.authors,
                        year: !formData.year,
                        source: !formData.source
                      }
                      
                      if (Object.values(errors).some(Boolean)) {
                        setGenericErrors(errors)
                        return
                      }
                      
                      // Validation d'année
                      if (formData.year > getCurrentYear()) {
                        setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                        return
                      }
                      
                      // Validation conditionnelle : lien OU justificatifs obligatoire
                      if (!formData.lien && formData.justificatifs.length === 0) {
                        setLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                        return
                      }
                      
                      console.log("Publication ajoutée manuellement", { 
                        category: selectedCategory,
                        subCategory: selectedSubCategory,
                        formData
                      })
                      setAddManualDialogOpen(false)
                      setSelectedCategory("")
                      setSelectedSubCategory("")
                      setFormData({
                        title: "",
                        authors: "",
                        year: new Date().getFullYear(),
                        journal: "",
                        doi: "",
                        orcid: "",
                        source: "",
                        abstract: "",
                        lien: "",
                        justificatifs: []
                      })
                      setLienJustificatifError("")
                      setYearError("")
                      setGenericErrors({ title: false, authors: false, year: false, source: false })
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter la publication
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}