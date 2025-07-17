"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { 
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
  Building,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Upload,
  FileSignature,
  Download
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import React from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface ProjectRequest {
  id: string
  title: string
  researcher: string
  laboratory: string
  program: string
  budget: number
  duration: string
  status: "pending" | "approved" | "rejected" | "under_review"
  submissionDate: string
  description: string
  objectives: string
  methodology: string
  expectedResults: string
  teamMembers: string[]
  documents: string[]
  approvalDate?: string
  approvalComments?: string
  signatureFile?: string
  approvalDocumentSize?: string
}

export default function DemandesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // États pour l'approbation avec signature
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [approvalRequest, setApprovalRequest] = useState<ProjectRequest | null>(null)
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [approvalComments, setApprovalComments] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  
  // État pour les notifications
  const [notifications, setNotifications] = useState<Array<{
    id: string
    to: string
    projectId: string
    projectTitle: string
    action: "approved" | "rejected"
    date: string
    comments?: string
    status: string
  }>>([])

  // Données des demandes de projets (simulation de dizaines de projets)
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([
    {
      id: "PR001",
      title: "Développement d'algorithmes d'IA pour l'éducation",
      researcher: "Dr. Ahmed Benali",
      laboratory: "MINDLab",
      program: "Programme National de Recherche en IA",
      budget: 500000,
      duration: "24 mois",
      status: "pending",
      submissionDate: "2024-01-15",
      description: "Ce projet vise à développer des algorithmes d'intelligence artificielle innovants pour améliorer l'expérience d'apprentissage dans l'éducation supérieure.",
      objectives: "Créer des outils d'IA pour l'évaluation automatique, l'adaptation du contenu pédagogique et le suivi des progrès des étudiants.",
      methodology: "Approche hybride combinant machine learning, deep learning et analyse de données éducatives.",
      expectedResults: "Plateforme d'IA éducative, algorithmes d'évaluation automatique, système de recommandation de contenu.",
      teamMembers: ["Dr. Ahmed Benali", "Dr. Sara El Harti", "Dr. Mohamed Lahby"],
      documents: ["Projet_IA_Education.pdf", "Budget_detaille.xlsx", "CV_equipe.pdf"]
    },
    {
      id: "PR002",
      title: "Systèmes d'IA pour la santé préventive",
      researcher: "Dr. Fatima Zahra",
      laboratory: "LISFA",
      program: "Programme de Recherche en Santé Numérique",
      budget: 750000,
      duration: "36 mois",
      status: "under_review",
      submissionDate: "2024-01-10",
      description: "Développement de systèmes d'intelligence artificielle pour la détection précoce et la prévention des maladies chroniques.",
      objectives: "Créer des modèles prédictifs pour identifier les risques de maladies chroniques et proposer des interventions préventives personnalisées.",
      methodology: "Analyse de données médicales, machine learning, validation clinique.",
      expectedResults: "Système de prédiction des risques, application mobile de suivi santé, base de données médicales sécurisée.",
      teamMembers: ["Dr. Fatima Zahra", "Dr. Karim Alami", "Dr. Youssef Alami"],
      documents: ["Projet_Sante_IA.pdf", "Protocole_etude.pdf", "Budget_justifie.pdf"]
    },
    {
      id: "PR003",
      title: "IA pour l'optimisation énergétique",
      researcher: "Dr. Sara El Harti",
      laboratory: "MINDLab",
      program: "Programme de Recherche en Énergies Renouvelables",
      budget: 600000,
      duration: "30 mois",
      status: "approved",
      submissionDate: "2024-01-20",
      description: "Application de l'intelligence artificielle pour optimiser la production et la distribution d'énergie renouvelable.",
      objectives: "Développer des algorithmes d'optimisation pour maximiser l'efficacité des systèmes d'énergie renouvelable.",
      methodology: "Modélisation mathématique, optimisation multi-objectif, simulation numérique.",
      expectedResults: "Système d'optimisation énergétique, logiciel de gestion intelligente, rapport d'impact environnemental.",
      teamMembers: ["Dr. Sara El Harti", "Dr. Ahmed Benali", "Dr. Hassan Alami"],
      documents: ["Projet_Energie_IA.pdf", "Etude_impact.pdf", "Planning_detaille.pdf"]
    },
    {
      id: "PR004",
      title: "Intelligence artificielle pour la cybersécurité",
      researcher: "Dr. Mohamed Lahby",
      laboratory: "LISFA",
      program: "Programme de Recherche en Cybersécurité",
      budget: 800000,
      duration: "24 mois",
      status: "rejected",
      submissionDate: "2024-01-05",
      description: "Développement de solutions d'IA pour détecter et prévenir les cyberattaques en temps réel.",
      objectives: "Créer des systèmes de détection d'intrusion basés sur l'IA et des outils de réponse automatique aux menaces.",
      methodology: "Deep learning, analyse comportementale, tests de pénétration.",
      expectedResults: "Système de détection d'intrusion, plateforme de réponse aux incidents, outils de formation.",
      teamMembers: ["Dr. Mohamed Lahby", "Dr. Fatima Zahra", "Dr. Karim Alami"],
      documents: ["Projet_Cybersecurite.pdf", "Analyse_risques.pdf", "Budget_propose.pdf"]
    },
    {
      id: "PR005",
      title: "IA pour l'agriculture intelligente",
      researcher: "Dr. Youssef Alami",
      laboratory: "MINDLab",
      program: "Programme National de Recherche en IA",
      budget: 450000,
      duration: "18 mois",
      status: "pending",
      submissionDate: "2024-01-25",
      description: "Application de l'IA pour optimiser les pratiques agricoles et améliorer la productivité des cultures.",
      objectives: "Développer des systèmes d'IA pour la surveillance des cultures, la gestion de l'irrigation et la prédiction des rendements.",
      methodology: "Vision par ordinateur, IoT, machine learning, validation sur terrain.",
      expectedResults: "Système de surveillance agricole, application mobile pour agriculteurs, base de données agricole.",
      teamMembers: ["Dr. Youssef Alami", "Dr. Sara El Harti", "Dr. Ahmed Benali"],
      documents: ["Projet_Agriculture_IA.pdf", "Etude_faisabilite.pdf", "Budget_detaille.pdf"]
    },
    // Ajout de plus de projets pour simuler des dizaines
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `PR${String(i + 6).padStart(3, "0")}`,
      title: `Projet de recherche ${i + 6} - ${["IA", "Cybersécurité", "Santé", "Énergie", "Agriculture"][i % 5]}`,
      researcher: `Dr. ${["Benali", "Zahra", "El Harti", "Lahby", "Alami"][i % 5]} ${["Ahmed", "Fatima", "Sara", "Mohamed", "Youssef"][i % 5]}`,
      laboratory: ["MINDLab", "LISFA", "LISFA", "MINDLab", "MINDLab"][i % 5],
      program: ["Programme National de Recherche en IA", "Programme de Recherche en Cybersécurité", "Programme de Recherche en Santé Numérique", "Programme de Recherche en Énergies Renouvelables", "Programme National de Recherche en IA"][i % 5],
      budget: [500000, 750000, 600000, 800000, 450000][i % 5] + (i * 10000),
      duration: ["24 mois", "36 mois", "30 mois", "24 mois", "18 mois"][i % 5],
      status: ["pending", "under_review", "approved", "rejected", "pending"][i % 4] as "pending" | "approved" | "rejected" | "under_review",
      submissionDate: new Date(2024, 0, 15 + i).toISOString().split('T')[0],
      description: `Description du projet ${i + 6} - Ce projet vise à développer des solutions innovantes dans le domaine de la recherche.`,
      objectives: `Objectifs du projet ${i + 6} - Créer des outils et systèmes innovants.`,
      methodology: `Méthodologie du projet ${i + 6} - Approche scientifique rigoureuse.`,
      expectedResults: `Résultats attendus du projet ${i + 6} - Systèmes et outils fonctionnels.`,
      teamMembers: [`Dr. ${["Benali", "Zahra", "El Harti", "Lahby", "Alami"][i % 5]}`, "Dr. Sara El Harti", "Dr. Mohamed Lahby"],
      documents: [`Projet_${i + 6}.pdf`, `Budget_${i + 6}.xlsx`, `CV_equipe_${i + 6}.pdf`]
    }))
  ])

  const getStatusBadge = (status: ProjectRequest["status"]) => {
    const statusConfig = {
      pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      under_review: { label: "En révision", color: "bg-blue-100 text-blue-800 border-blue-200" },
      approved: { label: "Approuvé", color: "bg-green-100 text-green-800 border-green-200" },
      rejected: { label: "Rejeté", color: "bg-red-100 text-red-800 border-red-200" }
    }
    const config = statusConfig[status]
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getStatusIcon = (status: ProjectRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "under_review":
        return <Eye className="h-4 w-4 text-blue-600" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const handleViewRequest = (request: ProjectRequest) => {
    setSelectedRequest(request)
    setIsDialogOpen(true)
  }

  const handleApprove = (requestId: string) => {
    // Trouver la demande à approuver
    const request = projectRequests.find(r => r.id === requestId)
    if (request) {
      setApprovalRequest(request)
      setIsApprovalDialogOpen(true)
    }
  }

  const handleApproveWithSignature = async () => {
    if (!approvalRequest) {
      alert("Erreur: Demande non trouvée")
      return
    }

    setIsUploading(true)
    
    try {
      // Simulation de traitement
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mise à jour du statut de la demande
      setProjectRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === approvalRequest.id 
            ? { 
                ...request, 
                status: "approved" as const,
                approvalDate: new Date().toISOString(),
                approvalComments: approvalComments
              }
            : request
        )
      )
      
      // Fermer les dialogs
      setIsApprovalDialogOpen(false)
      setApprovalRequest(null)
      setSignatureFile(null)
      setApprovalComments("")
      
      if (selectedRequest?.id === approvalRequest.id) {
        setIsDialogOpen(false)
        setSelectedRequest(null)
      }
      
      // Générer et télécharger la fiche du projet
      generateAndDownloadProjectSheet(approvalRequest)
      
      // Envoyer notification à l'enseignant-chercheur
      sendNotificationToResearcher(approvalRequest, "approved", approvalComments)
      
    } catch (error) {
      alert("❌ Erreur lors de l'approbation")
    } finally {
      setIsUploading(false)
    }
  }

  const sendNotificationToResearcher = async (project: ProjectRequest, action: "approved" | "rejected", comments?: string) => {
    try {
      // Simulation d'envoi de notification
      console.log(`📧 Notification envoyée à ${project.researcher}`)
      
      const notificationData = {
        id: `notif_${Date.now()}`,
        to: project.researcher,
        projectId: project.id,
        projectTitle: project.title,
        action: action,
        date: new Date().toISOString(),
        comments: comments,
        status: action === "approved" ? "APPROUVÉ" : "REJETÉ"
      }
      
      // Ajouter la notification à l'état
      setNotifications(prev => [notificationData, ...prev])
      
      // Ici vous pouvez intégrer avec votre système de notification
      // Par exemple : email, SMS, notification push, etc.
      
      // Simulation d'envoi d'email
      await simulateEmailNotification(notificationData)
      
      // Afficher confirmation
      const actionText = action === "approved" ? "approuvé" : "rejeté"
      console.log(`✅ Notification de ${actionText} envoyée avec succès à ${project.researcher}`)
      
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de la notification:", error)
    }
  }

  const simulateEmailNotification = async (data: any) => {
    // Simulation d'envoi d'email
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const emailContent = `
      Objet: ${data.action === "approved" ? "APPROBATION" : "REJET"} - Projet ${data.projectId}
      
      Cher(e) ${data.to},
      
      Nous avons le plaisir de vous informer que votre projet de recherche a été ${data.action === "approved" ? "APPROUVÉ" : "REJETÉ"}.
      
      Détails du projet :
      - ID: ${data.projectId}
      - Titre: ${data.projectTitle}
      - Statut: ${data.status}
      - Date de décision: ${formatDate(data.date)}
      ${data.comments ? `- Commentaires: ${data.comments}` : ''}
      
      ${data.action === "approved" ? 
        "Votre projet peut maintenant démarrer. Veuillez contacter l'administration pour les prochaines étapes." :
        "Si vous avez des questions concernant cette décision, n'hésitez pas à nous contacter."
      }
      
      Cordialement,
      L'équipe du Pôle de Recherche
      Université Hassan II
    `
    
    console.log("📧 Email simulé envoyé:", emailContent)
  }

  const generateAndDownloadProjectSheet = async (project: ProjectRequest) => {
    // Créer un élément HTML temporaire pour le PDF
    const pdfContent = document.createElement('div')
    pdfContent.style.position = 'absolute'
    pdfContent.style.left = '-9999px'
    pdfContent.style.top = '0'
    pdfContent.style.width = '800px'
    pdfContent.style.padding = '40px'
    pdfContent.style.fontFamily = 'Arial, sans-serif'
    pdfContent.style.fontSize = '12px'
    pdfContent.style.lineHeight = '1.4'
    pdfContent.style.color = '#333'
    pdfContent.style.backgroundColor = 'white'
    
    pdfContent.innerHTML = `
      <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 24px; margin: 0; font-weight: bold;">FICHE D'APPROBATION DE PROJET DE RECHERCHE</h1>
        <p style="margin: 10px 0 0 0;">Université Hassan II - Pôle de Recherche</p>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">INFORMATIONS DU PROJET</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div><strong>ID du projet:</strong> ${project.id}</div>
          <div><strong>Titre:</strong> ${project.title}</div>
          <div><strong>Chercheur principal:</strong> ${project.researcher}</div>
          <div><strong>Laboratoire:</strong> ${project.laboratory}</div>
          <div><strong>Programme:</strong> ${project.program}</div>
          <div><strong>Budget demandé:</strong> ${formatBudget(project.budget)}</div>
          <div><strong>Durée:</strong> ${project.duration}</div>
          <div><strong>Date de soumission:</strong> ${formatDate(project.submissionDate)}</div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">DESCRIPTION</h2>
        <p>${project.description}</p>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">OBJECTIFS</h2>
        <p>${project.objectives}</p>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">MÉTHODOLOGIE</h2>
        <p>${project.methodology}</p>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">RÉSULTATS ATTENDUS</h2>
        <p>${project.expectedResults}</p>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">ÉQUIPE DE RECHERCHE</h2>
        <ol style="margin-left: 20px;">
          ${project.teamMembers.map(member => `<li>${member}</li>`).join('')}
        </ol>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">DOCUMENTS JOINTS</h2>
        <ol style="margin-left: 20px;">
          ${project.documents.map(doc => `<li>${doc}</li>`).join('')}
        </ol>
      </div>

      <div style="margin-top: 40px; border-top: 2px solid #333; padding-top: 20px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">APPROBATION</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <div><strong>Statut:</strong> APPROUVÉ</div>
          <div><strong>Date d'approbation:</strong> ${formatDate(new Date().toISOString())}</div>
        </div>
        ${approvalComments ? `<div><strong>Commentaires:</strong> ${approvalComments}</div>` : ''}
      </div>

      <div style="margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
        <div style="border-top: 1px solid #333; padding-top: 10px; text-align: center;">
          <p><strong>DIRECTEUR DU PÔLE DE RECHERCHE</strong></p>
          <p>Nom: Dr. [Nom du Directeur]</p>
          <div style="border-top: 1px solid #333; margin-top: 40px; padding-top: 5px;">
            <p>Signature</p>
          </div>
          <p>Date: ${formatDate(new Date().toISOString())}</p>
        </div>
        
        <div style="border-top: 1px solid #333; padding-top: 10px; text-align: center;">
          <p><strong>CHERCHEUR PRINCIPAL</strong></p>
          <p>Nom: ${project.researcher}</p>
          <div style="border-top: 1px solid #333; margin-top: 40px; padding-top: 5px;">
            <p>Signature</p>
          </div>
          <p>Date: ${formatDate(new Date().toISOString())}</p>
        </div>
      </div>

      <div style="margin-top: 50px; text-align: center; font-size: 10px; color: #666;">
        <p>Ce document certifie l'approbation officielle du projet de recherche.</p>
        <p>Document généré automatiquement le ${formatDate(new Date().toISOString())}</p>
      </div>
    `

    // Ajouter l'élément au DOM temporairement
    document.body.appendChild(pdfContent)

    try {
      // Convertir en canvas
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // Créer le PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Télécharger le PDF
      pdf.save(`Fiche_Projet_${project.id}_${formatDate(new Date().toISOString()).replace(/\//g, '-')}.pdf`)

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      alert('Erreur lors de la génération du PDF')
    } finally {
      // Nettoyer
      document.body.removeChild(pdfContent)
    }
  }

  const handleReject = (requestId: string) => {
    // Mise à jour du statut de la demande
    setProjectRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: "rejected" as const }
          : request
      )
    )
    
    // Fermer le dialog si ouvert
    if (selectedRequest?.id === requestId) {
      setIsDialogOpen(false)
      setSelectedRequest(null)
    }
    
    // Trouver la demande pour la notification
    const rejectedRequest = projectRequests.find(r => r.id === requestId)
    if (rejectedRequest) {
      // Envoyer notification de rejet
      sendNotificationToResearcher(rejectedRequest, "rejected")
    }
    
    // Feedback utilisateur
    console.log(`❌ Demande ${requestId} rejetée`)
    alert(`❌ Demande ${requestId} rejetée`)
  }

  const handlePutUnderReview = (requestId: string) => {
    // Mise à jour du statut de la demande
    setProjectRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: "under_review" as const }
          : request
      )
    )
    
    // Fermer le dialog si ouvert
    if (selectedRequest?.id === requestId) {
      setIsDialogOpen(false)
      setSelectedRequest(null)
    }
    
    // Feedback utilisateur
    console.log(`👁️ Demande ${requestId} mise en révision`)
    alert(`👁️ Demande ${requestId} mise en révision`)
  }

  const filteredRequests = projectRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.researcher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.laboratory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.program.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRequests = filteredRequests.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToFirstPage = () => goToPage(1)
  const goToLastPage = () => goToPage(totalPages)
  const goToPreviousPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Demandes de Projets</h1>
              <p className="text-gray-600 mt-2">Consultez et validez les demandes de projets soumises par les enseignants-chercheurs</p>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <Card className="bg-white border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Total</p>
                      <p className="text-lg font-bold text-gray-900">{filteredRequests.length}</p>
                    </div>
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">En attente</p>
                      <p className="text-lg font-bold text-gray-900">{filteredRequests.filter(r => r.status === "pending").length}</p>
                    </div>
                    <div className="p-1.5 bg-yellow-100 rounded-lg">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">En révision</p>
                      <p className="text-lg font-bold text-gray-900">{filteredRequests.filter(r => r.status === "under_review").length}</p>
                    </div>
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Approuvés</p>
                      <p className="text-lg font-bold text-gray-900">{filteredRequests.filter(r => r.status === "approved").length}</p>
                    </div>
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notifications récentes */}
            {notifications.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Notifications récentes</CardTitle>
                  <CardDescription>
                    Notifications envoyées aux enseignants-chercheurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            notification.action === "approved" ? "bg-green-100" : "bg-red-100"
                          }`}>
                            {notification.action === "approved" ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {notification.action === "approved" ? "Approbation" : "Rejet"} - {notification.projectId}
                            </p>
                            <p className="text-sm text-gray-600">
                              Envoyé à {notification.to} le {formatDate(notification.date)}
                            </p>
                            {notification.comments && (
                              <p className="text-xs text-gray-500 mt-1">
                                Commentaire: {notification.comments}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          notification.action === "approved" 
                            ? "text-green-600 border-green-200" 
                            : "text-red-600 border-red-200"
                        }>
                          {notification.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filtres */}
            <Card className="mb-6 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher par titre, chercheur, laboratoire ou programme..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={statusFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("all")}
                    >
                      Toutes
                    </Button>
                    <Button
                      variant={statusFilter === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("pending")}
                    >
                      En attente
                    </Button>
                    <Button
                      variant={statusFilter === "under_review" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("under_review")}
                    >
                      En révision
                    </Button>
                    <Button
                      variant={statusFilter === "approved" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("approved")}
                    >
                      Approuvées
                    </Button>
                    <Button
                      variant={statusFilter === "rejected" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("rejected")}
                    >
                      Rejetées
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations de pagination */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredRequests.length)} sur {filteredRequests.length} demandes
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Projets par page:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Liste des demandes */}
            {currentRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    {projectRequests.length === 0 
                      ? "Aucune demande de projet n'a été soumise pour le moment."
                      : "Aucune demande ne correspond à vos critères de recherche."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                                <div className="grid gap-3">
                  {currentRequests.map((request) => {
                    const getStatusBorderColor = (status: ProjectRequest["status"]) => {
                      switch (status) {
                        case "pending": return "border-l-yellow-500"
                        case "under_review": return "border-l-blue-500"
                        case "approved": return "border-l-green-500"
                        case "rejected": return "border-l-red-500"
                        default: return "border-l-gray-300"
                      }
                    }
                    
                    return (
                      <Card key={request.id} className={`hover:shadow-md transition-all duration-300 border-l-4 ${getStatusBorderColor(request.status)} border-r border-t border-b border-gray-200 overflow-hidden bg-white`}>
                        <div className="relative">
                          {/* Status indicator bar */}
                          <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                            request.status === "pending" ? "bg-yellow-400" :
                            request.status === "under_review" ? "bg-blue-400" :
                            request.status === "approved" ? "bg-green-400" :
                            request.status === "rejected" ? "bg-red-400" :
                            "bg-gray-300"
                          }`} />
                          
                          <CardHeader className="pb-1">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                {/* Header with status */}
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="p-0.5 rounded-full bg-gray-100">
                                    {getStatusIcon(request.status)}
                                  </div>
                                  <div className="flex-1">
                                    <CardTitle className="text-sm text-gray-900 mb-0.5">{request.title}</CardTitle>
                                    <div className="flex items-center gap-2">
                                      {getStatusBadge(request.status)}
                                      <span className="text-xs text-gray-500">ID: {request.id}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Description */}
                                <CardDescription className="text-gray-700 mb-1 leading-relaxed text-xs line-clamp-1">
                                  {request.description}
                                </CardDescription>
                                
                                {/* Key information grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-1">
                                  <div className="bg-gray-50 p-1 rounded">
                                    <div className="flex items-center gap-1 mb-0.5">
                                      <User className="h-3 w-3 text-gray-600" />
                                      <span className="text-xs font-medium text-gray-600">Chercheur</span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-900 truncate">{request.researcher}</p>
                                  </div>
                                  <div className="bg-gray-50 p-1 rounded">
                                    <div className="flex items-center gap-1 mb-0.5">
                                      <Building className="h-3 w-3 text-gray-600" />
                                      <span className="text-xs font-medium text-gray-600">Laboratoire</span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-900 truncate">{request.laboratory}</p>
                                  </div>
                                  <div className="bg-gray-50 p-1 rounded">
                                    <div className="flex items-center gap-1 mb-0.5">
                                      <DollarSign className="h-3 w-3 text-gray-600" />
                                      <span className="text-xs font-medium text-gray-600">Budget</span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-900">{formatBudget(request.budget)}</p>
                                  </div>
                                  <div className="bg-gray-50 p-1 rounded">
                                    <div className="flex items-center gap-1 mb-0.5">
                                      <Calendar className="h-3 w-3 text-gray-600" />
                                      <span className="text-xs font-medium text-gray-600">Soumis le</span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-900">{formatDate(request.submissionDate)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0 pb-1">
                            {/* Additional details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-1">
                              <div className="bg-gray-50 p-1 rounded border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-0.5 text-xs">Programme</h4>
                                <p className="text-xs text-gray-700 truncate">{request.program}</p>
                              </div>
                              <div className="bg-gray-50 p-1 rounded border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-0.5 text-xs">Durée</h4>
                                <p className="text-xs text-gray-700">{request.duration}</p>
                              </div>
                              <div className="bg-gray-50 p-1 rounded border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-0.5 text-xs">Équipe</h4>
                                <p className="text-xs text-gray-700">{request.teamMembers.length} membres</p>
                              </div>
                            </div>
                            
                            {/* Action buttons */}
                            <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  Documents: {request.documents.length} fichier(s)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewRequest(request)}
                                  className="bg-blue-50 hover:bg-blue-100 h-7 px-2 text-xs border-blue-200 text-blue-700 hover:text-blue-800"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Consulter
                                </Button>
                                {request.status === "pending" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handlePutUnderReview(request.id)}
                                      className="bg-blue-50 hover:bg-blue-100 h-7 px-2 text-xs border-blue-200 text-blue-700 hover:text-blue-800"
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      Réviser
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleApprove(request.id)}
                                      className="bg-green-50 hover:bg-green-100 h-7 px-2 text-xs border-green-200 text-green-700 hover:text-green-800"
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Approuver
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleReject(request.id)}
                                      className="bg-red-50 hover:bg-red-100 h-7 px-2 text-xs border-red-200 text-red-700 hover:text-red-800"
                                    >
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Rejeter
                                    </Button>
                                  </>
                                )}
                                {request.status === "under_review" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleApprove(request.id)}
                                      className="bg-green-50 hover:bg-green-100 h-7 px-2 text-xs border-green-200 text-green-700 hover:text-green-800"
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Approuver
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleReject(request.id)}
                                      className="bg-red-50 hover:bg-red-100 h-7 px-2 text-xs border-red-200 text-red-700 hover:text-red-800"
                                    >
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Rejeter
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(pageNumber)}
                            className="w-8 h-8"
                          >
                            {pageNumber}
                          </Button>
                        )
                      })}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Dialog pour consulter les détails */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la demande de projet</DialogTitle>
            <DialogDescription>
              Consultez les informations complètes du projet soumis
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6 py-4">
              {/* Informations générales */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Informations générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Titre du projet</p>
                    <p className="text-sm text-gray-900">{selectedRequest.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Chercheur principal</p>
                    <p className="text-sm text-gray-900">{selectedRequest.researcher}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Laboratoire</p>
                    <p className="text-sm text-gray-900">{selectedRequest.laboratory}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Programme</p>
                    <p className="text-sm text-gray-900">{selectedRequest.program}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Budget demandé</p>
                    <p className="text-sm text-gray-900">{formatBudget(selectedRequest.budget)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Durée</p>
                    <p className="text-sm text-gray-900">{selectedRequest.duration}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description du projet</h3>
                <p className="text-sm text-gray-700">{selectedRequest.description}</p>
              </div>

              {/* Objectifs */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Objectifs</h3>
                <p className="text-sm text-gray-700">{selectedRequest.objectives}</p>
              </div>

              {/* Méthodologie */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Méthodologie</h3>
                <p className="text-sm text-gray-700">{selectedRequest.methodology}</p>
              </div>

              {/* Résultats attendus */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Résultats attendus</h3>
                <p className="text-sm text-gray-700">{selectedRequest.expectedResults}</p>
              </div>

              {/* Équipe */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Membres de l'équipe</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {selectedRequest.teamMembers.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Documents joints</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {selectedRequest.documents.map((document, index) => (
                    <li key={index}>{document}</li>
                  ))}
                </ul>
              </div>

              {/* Document d'approbation (si approuvé) */}
              {selectedRequest.status === "approved" && selectedRequest.signatureFile && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FileSignature className="h-4 w-4" />
                    Document d'approbation
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Fichier:</span>
                      <span className="text-sm text-gray-600">{selectedRequest.signatureFile}</span>
                    </div>
                    {selectedRequest.approvalDocumentSize && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Taille:</span>
                        <span className="text-sm text-gray-600">{selectedRequest.approvalDocumentSize}</span>
                      </div>
                    )}
                    {selectedRequest.approvalDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Date d'approbation:</span>
                        <span className="text-sm text-gray-600">{formatDate(selectedRequest.approvalDate)}</span>
                      </div>
                    )}
                    {selectedRequest.approvalComments && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-700">Commentaires:</span>
                        <p className="text-sm text-gray-600 mt-1 bg-white p-2 rounded border">
                          {selectedRequest.approvalComments}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-end mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 hover:text-gray-700 border-gray-300 hover:bg-gray-50"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedRequest.status === "pending" && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handlePutUnderReview(selectedRequest.id)}
                    className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Mettre en révision
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedRequest.id)}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter la demande
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver la demande
                  </Button>
                </div>
              )}
              {selectedRequest.status === "under_review" && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedRequest.id)}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter la demande
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver la demande
                  </Button>
                </div>
              )}
              {(selectedRequest.status === "approved" || selectedRequest.status === "rejected") && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Statut final :</span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour l'approbation avec signature */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Approbation du projet</DialogTitle>
            <DialogDescription>
              Approuvez la demande de projet en uploadant le document d'approbation.
            </DialogDescription>
          </DialogHeader>
          
          {approvalRequest && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Informations de la demande</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Titre du projet</p>
                    <p className="text-sm text-gray-900">{approvalRequest.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Chercheur principal</p>
                    <p className="text-sm text-gray-900">{approvalRequest.researcher}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Laboratoire</p>
                    <p className="text-sm text-gray-900">{approvalRequest.laboratory}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Programme</p>
                    <p className="text-sm text-gray-900">{approvalRequest.program}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Budget demandé</p>
                    <p className="text-sm text-gray-900">{formatBudget(approvalRequest.budget)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Durée</p>
                    <p className="text-sm text-gray-900">{approvalRequest.duration}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="approval-comments" className="text-sm font-medium text-gray-700">
                  Commentaires d'approbation (optionnel)
                </Label>
                <Textarea
                  id="approval-comments"
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  placeholder="Ajoutez des commentaires d'approbation ici (ex: 'Projet approuvé avec modifications mineures')"
                  className="mt-1"
                  rows={3}
                />
              </div>



              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsApprovalDialogOpen(false)
                    setSignatureFile(null)
                    setApprovalComments("")
                  }}
                  disabled={isUploading}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleApproveWithSignature}
                  disabled={isUploading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Génération de la fiche...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approuver et télécharger la fiche
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 