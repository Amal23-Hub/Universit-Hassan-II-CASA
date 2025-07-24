"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, FileText, DollarSign, Plus, Trash2, Filter, Download, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { useRouter, useSearchParams } from "next/navigation"
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
  anneeFin: number
  organismesPartenaires: string
  budgetTotal: number
  tranches: Array<{ 
    id: string, 
    montant: number, 
    description: string,
    recu?: boolean,
    dateReception?: string,
    envoye?: boolean,
    dateEnvoi?: string
  }>
  nombreDoctorants: number
  bourse: number
  mobilite: number
  phaseSoumission?: string
  phaseConvention?: string
  lien?: string
  justificatifs?: string
  membres?: string[]
  programme?: string
  typologie?: string
  sousProgramme?: string
  statutRetenu?: "Retenu" | "Non retenu" | "En attente"
  convention?: string
  versements?: Array<{ id: string, montant: number, date: string, description: string }>
}

function VersementsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projetId = searchParams.get('projetId')

  const [projet, setProjet] = useState<ProjetContrat | null>(null)
  const [showAddVersementModal, setShowAddVersementModal] = useState(false)
  const [newVersement, setNewVersement] = useState({
    montant: "",
    date: "",
    description: ""
  })
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Données simulées du projet
  const projetData: ProjetContrat = {
    id: "1",
    typeProjetContrat: "Projet de recherche financé",
    typeProjet: "National",
    coordonnateur: "Dr. Ahmed BENALI",
    intitule: "Développement de technologies vertes pour la transition énergétique",
    thematique: "Énergie renouvelable",
    organismeContractant: "Ministère de l'Énergie",
    codeReference: "PR-2024-001",
    anneeDebut: 2024,
    anneeFin: 2026,
    organismesPartenaires: "Université Hassan II, CNRS",
    budgetTotal: 1500000,
      tranches: [
        {
        id: "1", 
        montant: 500000, 
        description: "Première tranche",
          recu: true,
        dateReception: "2024-01-15",
          envoye: true,
        dateEnvoi: "2024-01-10"
      },
      { 
        id: "2", 
        montant: 1000000, 
        description: "Deuxième tranche",
          recu: false,
          envoye: false
        }
    ],
    nombreDoctorants: 3,
    bourse: 120000,
    mobilite: 50000,
    statutRetenu: "Retenu",
    convention: "convention-projet-1.pdf",
    versements: [
      { id: "1", montant: 500000, date: "2024-01-15", description: "Premier versement" },
      { id: "2", montant: 300000, date: "2024-06-20", description: "Deuxième versement" }
    ]
  }

  useEffect(() => {
    // Simuler le chargement du projet basé sur l'ID
    setProjet(projetData)
  }, [projetId])

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddVersement = () => {
    if (newVersement.montant && newVersement.date && newVersement.description) {
      const versement = {
        id: Date.now().toString(),
        montant: parseFloat(newVersement.montant),
        date: newVersement.date,
        description: newVersement.description
      }
      
      setProjet(prev => prev ? {
        ...prev,
        versements: [...(prev.versements || []), versement]
      } : null)
      
      setNewVersement({ montant: "", date: "", description: "" })
      setShowAddVersementModal(false)
    }
  }

  const handleRemoveVersement = (versementId: string) => {
    setProjet(prev => prev ? {
      ...prev,
      versements: (prev.versements || []).filter(v => v.id !== versementId)
    } : null)
  }

  const handleSortByTranches = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  if (!projet) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
            <div className="text-center py-8">
              <p className="text-gray-500">Chargement...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto max-w-7xl">
            {/* Header avec bouton retour */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux projets
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des versements</h1>
              <p className="text-gray-600 mt-1">Projet : {projet.intitule}</p>
            </div>

            {/* Informations du projet */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Informations du projet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                    <Label className="text-sm font-medium text-gray-600">Code référence</Label>
                    <p className="text-gray-900">{projet.codeReference}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Coordonnateur</Label>
                    <p className="text-gray-900">{projet.coordonnateur}</p>
                  </div>
                    <div>
                    <Label className="text-sm font-medium text-gray-600">Budget total</Label>
                    <p className="text-gray-900 font-semibold">{formatBudget(projet.budgetTotal)}</p>
                  </div>
                    <div>
                    <Label className="text-sm font-medium text-gray-600">Organisme contractant</Label>
                    <p className="text-gray-900">{projet.organismeContractant}</p>
                  </div>
                    <div>
                    <Label className="text-sm font-medium text-gray-600">Période</Label>
                    <p className="text-gray-900">{projet.anneeDebut} - {projet.anneeFin}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Statut</Label>
                    <Badge className={
                      projet.statutRetenu === "Retenu" 
                        ? "bg-green-100 text-green-800 whitespace-nowrap" 
                        : projet.statutRetenu === "Non retenu"
                        ? "bg-red-100 text-red-800 whitespace-nowrap"
                        : "bg-yellow-100 text-yellow-800 whitespace-nowrap"
                    }>
                      {projet.statutRetenu}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestion des versements */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Gestion des versements</CardTitle>
                <Button
                  onClick={() => setShowAddVersementModal(true)}
                  className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un versement
                </Button>
              </CardHeader>
              <CardContent>
                {projet.versements && projet.versements.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-medium text-gray-700">Date</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-700">Description</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-700">Montant</th>
                          <th className="text-center py-2 px-3 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projet.versements
                          .sort((a, b) => sortOrder === 'asc' 
                            ? new Date(a.date).getTime() - new Date(b.date).getTime()
                            : new Date(b.date).getTime() - new Date(a.date).getTime()
                          )
                          .map((versement) => (
                          <tr key={versement.id} className="border-b border-gray-100">
                            <td className="py-2 px-3 text-gray-900">
                              {new Date(versement.date).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="py-2 px-3 text-gray-900">{versement.description}</td>
                            <td className="py-2 px-3 text-right font-medium text-gray-900">
                              {formatBudget(versement.montant)}
                            </td>
                            <td className="py-2 px-3 text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                onClick={() => handleRemoveVersement(versement.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Supprimer le versement"
                                >
                                <Trash2 className="h-3 w-3" />
                                </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Aucun versement enregistré</p>
                    <p className="text-sm text-gray-400">Ajoutez votre premier versement</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gestion des tranches */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Gestion des tranches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Description</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-700">Montant</th>
                        <th className="text-center py-2 px-3 font-medium text-gray-700">Envoyé</th>
                        <th className="text-center py-2 px-3 font-medium text-gray-700">Reçu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projet.tranches.map((tranche) => (
                        <tr key={tranche.id} className="border-b border-gray-100">
                          <td className="py-2 px-3 text-gray-900">{tranche.description}</td>
                          <td className="py-2 px-3 text-right font-medium text-gray-900">
                            {formatBudget(tranche.montant)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <Badge className={tranche.envoye ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                              {tranche.envoye ? "Oui" : "Non"}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <Badge className={tranche.recu ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                              {tranche.recu ? "Oui" : "Non"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            </div>
        </main>
      </div>

      {/* Modal pour ajouter un versement */}
      <Dialog open={showAddVersementModal} onOpenChange={setShowAddVersementModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un versement</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau versement pour ce projet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="montant">Montant (MAD)</Label>
              <Input
                id="montant"
                type="number"
                placeholder="0"
                value={newVersement.montant}
                onChange={(e) => setNewVersement(prev => ({ ...prev, montant: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newVersement.date}
                onChange={(e) => setNewVersement(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Description du versement"
                value={newVersement.description}
                onChange={(e) => setNewVersement(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowAddVersementModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddVersement} className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white">
              Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function VersementsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
            <div className="text-center py-8">
              <p className="text-gray-500">Chargement...</p>
            </div>
          </main>
        </div>
      </div>
    }>
      <VersementsContent />
    </Suspense>
  )
} 