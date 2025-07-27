"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, DollarSign, Plus, Trash2, Filter, Download, ArrowLeft, Send, CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { useRouter } from "next/navigation"
import { Users, BarChart3, CreditCard, Send as SendIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProjetVersement {
  id: string
  programme: string
  projet: string
  nomCoordonnateur: string
  prenomCoordonnateur: string
  etablissement: string
  budgetAlloue: number
  tranches: Array<{
    id: string
    montant: number
    recu: boolean
    dateReception?: string
    montantRecu?: number
    envoye: boolean
    dateEnvoi?: string
  }>
}

export default function VersementsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgramme, setFilterProgramme] = useState("all")
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showRecuModal, setShowRecuModal] = useState(false)
  const [selectedTranche, setSelectedTranche] = useState<{projetId: string, trancheId: string} | null>(null)
  const [recuData, setRecuData] = useState({
    dateReception: "",
    montantRecu: 0
  })

  const [projets, setProjets] = useState<ProjetVersement[]>([
    {
      id: "1",
      programme: "Programme National de Recherche en IA",
      projet: "IA pour la santé préventive",
      nomCoordonnateur: "Benali",
      prenomCoordonnateur: "Ahmed",
      etablissement: "Université Hassan II",
      budgetAlloue: 420000,
      tranches: [
        {
          id: "1",
          montant: 168000,
          recu: true,
          dateReception: "2024-02-20",
          envoye: true,
          dateEnvoi: "2024-02-18"
        },
        {
          id: "2",
          montant: 126000,
          recu: false,
          envoye: false
        },
        {
          id: "3",
          montant: 126000,
          recu: false,
          envoye: false
        }
      ]
    },
    {
      id: "2",
      programme: "Programme National de Recherche en IA",
      projet: "Cybersécurité avancée",
      nomCoordonnateur: "El Mansouri",
      prenomCoordonnateur: "Fatima",
      etablissement: "Université Mohammed V",
      budgetAlloue: 300000,
      tranches: [
        {
    id: "1",
          montant: 120000,
          recu: true,
          dateReception: "2024-02-22",
          envoye: true,
          dateEnvoi: "2024-02-19"
        },
        {
          id: "2",
          montant: 90000,
          recu: false,
          envoye: false
        },
        {
          id: "3",
          montant: 90000,
          recu: false,
          envoye: false
        }
      ]
    },
    {
      id: "3",
      programme: "Programme Energies Renouvelables",
      projet: "Optimisation des panneaux solaires",
      nomCoordonnateur: "Alami",
      prenomCoordonnateur: "Karim",
      etablissement: "Université Ibn Zohr",
      budgetAlloue: 650000,
      tranches: [
        {
        id: "1", 
          montant: 162500,
          recu: true,
          dateReception: "2024-03-25",
          envoye: true,
          dateEnvoi: "2024-03-22"
      },
      { 
        id: "2", 
          montant: 162500,
          recu: false,
          envoye: false
        },
        {
          id: "3",
          montant: 162500,
          recu: false,
          envoye: false
        }
      ]
    }
  ])

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const handleTrancheRecu = (projetId: string, trancheId: string, recu: boolean) => {
    setProjets(prev => prev.map(projet => {
      if (projet.id === projetId) {
        return {
          ...projet,
          tranches: projet.tranches.map(tranche => {
            if (tranche.id === trancheId) {
              return {
                ...tranche,
                recu,
                dateReception: recu ? new Date().toISOString().split('T')[0] : undefined,
                montantRecu: recu ? tranche.montant : undefined
              }
            }
            return tranche
          })
        }
      }
      return projet
    }))
  }

  const handleTrancheRecuWithDetails = (projetId: string, trancheId: string) => {
    setSelectedTranche({ projetId, trancheId })
    setRecuData({
      dateReception: new Date().toISOString().split('T')[0],
      montantRecu: 0
    })
    setShowRecuModal(true)
  }

  const handleConfirmRecu = () => {
    if (!selectedTranche) return

    setProjets(prev => prev.map(projet => {
      if (projet.id === selectedTranche.projetId) {
        return {
          ...projet,
          tranches: projet.tranches.map(tranche => {
            if (tranche.id === selectedTranche.trancheId) {
              return {
                ...tranche,
                recu: true,
                dateReception: recuData.dateReception,
                montantRecu: recuData.montantRecu
              }
            }
            return tranche
          })
        }
      }
      return projet
    }))

    setShowRecuModal(false)
    setSelectedTranche(null)
    setRecuData({ dateReception: "", montantRecu: 0 })
  }

  const handleTrancheEnvoye = (projetId: string, trancheId: string, envoye: boolean) => {
    setProjets(prev => prev.map(projet => {
      if (projet.id === projetId) {
        return {
          ...projet,
          tranches: projet.tranches.map(tranche => {
            if (tranche.id === trancheId) {
              return {
                ...tranche,
                envoye,
                dateEnvoi: envoye ? new Date().toISOString().split('T')[0] : undefined
              }
            }
            return tranche
          })
        }
      }
      return projet
    }))
  }

  const filteredProjets = projets.filter(projet => {
    const matchesSearch = searchTerm === "" || 
      projet.projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.nomCoordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.prenomCoordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.etablissement.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesProgramme = filterProgramme === "all" || projet.programme === filterProgramme
    
    return matchesSearch && matchesProgramme
  })

  const programmes = [...new Set(projets.map(p => p.programme))]

  // Calcul des statistiques
  const totalProjets = projets.length
  const budgetTotal = projets.reduce((sum, projet) => sum + projet.budgetAlloue, 0)
  const totalTranches = projets.reduce((sum, projet) => sum + projet.tranches.length, 0)
  const tranchesRecues = projets.reduce((sum, projet) => 
    sum + projet.tranches.filter(t => t.recu).length, 0
  )
  const tranchesEnvoyees = projets.reduce((sum, projet) => 
    sum + projet.tranches.filter(t => t.envoye).length, 0
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            {/* Header avec titre */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Service Budget & Division Recherche</h1>
                  <p className="text-gray-600 mt-1">Gérez les versements et le suivi des projets</p>
                </div>
              </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              {/* Total Projets */}
              <Card className="p-3">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Total Projets</p>
                      <p className="text-xl font-bold text-gray-900">{totalProjets}</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Total */}
              <Card className="p-3">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Budget Total</p>
                      <p className="text-lg font-bold text-gray-900">{formatBudget(budgetTotal)}</p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Tranches */}
              <Card className="p-3">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Total Tranches</p>
                      <p className="text-xl font-bold text-gray-900">{totalTranches}</p>
                    </div>
                    <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tranches Reçues */}
              <Card className="p-3">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Tranches Reçues</p>
                      <p className="text-xl font-bold text-gray-900">{tranchesRecues}</p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tranches Envoyées */}
              <Card className="p-3">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Tranches Envoyées</p>
                      <p className="text-xl font-bold text-gray-900">{tranchesEnvoyees}</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <SendIcon className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Barre de recherche et filtres */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres et Recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Recherche</Label>
                    <Input
                      placeholder="Rechercher par projet, coordonnateur, établissement..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="w-full md:w-64">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Programme</Label>
                    <Select value={filterProgramme} onValueChange={setFilterProgramme}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les programmes</SelectItem>
                        {programmes.map((programme) => (
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
            <Card>
              <CardHeader className="bg-green-50 border-b border-green-200">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <DollarSign className="h-5 w-5" />
                  Liste des Projets - Gestion des Versements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Programme</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Projet</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Nom Coordonnateur</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Prénom</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Établissement</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Budget Alloué</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Numéro de tranche</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Montant</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Statut</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjets.map((projet) => 
                        projet.tranches.map((tranche, index) => (
                          <tr key={`${projet.id}-${tranche.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700">{projet.programme}</td>
                            <td className="py-3 px-4 font-medium text-gray-900">{projet.projet}</td>
                            <td className="py-3 px-4 text-gray-700">{projet.nomCoordonnateur}</td>
                            <td className="py-3 px-4 text-gray-700">{projet.prenomCoordonnateur}</td>
                            <td className="py-3 px-4 text-gray-700">{projet.etablissement}</td>
                            <td className="py-3 px-4 text-center font-medium text-gray-900">
                              {formatBudget(projet.budgetAlloue)}
                            </td>
                            <td className="py-3 px-4 text-center font-medium text-gray-900">
                              Tranche {index + 1}
                            </td>
                            <td className="py-3 px-4 text-center font-medium text-gray-900">
                              {formatBudget(tranche.montant)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="space-y-2">
                                {!tranche.recu ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleTrancheRecuWithDetails(projet.id, tranche.id)}
                                    className="text-xs text-green-600 hover:text-green-700 border-green-300"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Marquer comme reçu
                                  </Button>
                                ) : (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-center space-x-2">
                                      <CheckCircle className="h-3 w-3 text-green-600" />
                                      <span className="text-xs text-green-600 font-medium">Reçu</span>
                                    </div>
                                    <div className="text-xs text-green-600">
                                      {formatDate(tranche.dateReception || '')}
                                    </div>
                                    {tranche.montantRecu && (
                                      <div className="text-xs text-gray-600">
                                        Reçu: {formatBudget(tranche.montantRecu)}
                                        {tranche.montantRecu !== tranche.montant && (
                                          <span className="text-orange-600 ml-1">
                                            (différence: {formatBudget(tranche.montantRecu - tranche.montant)})
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {tranche.envoye && (
                                  <div className="text-xs text-blue-600">
                                    Envoyé: {formatDate(tranche.dateEnvoi || '')}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {!tranche.envoye && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleTrancheEnvoye(projet.id, tranche.id, true)}
                                  className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  Envoyer
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Modal pour saisir les détails de réception */}
      <Dialog open={showRecuModal} onOpenChange={setShowRecuModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Confirmer la réception
            </DialogTitle>
            <DialogDescription>
              Saisissez la date de réception et le montant effectivement reçu
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dateReception" className="text-sm font-medium text-gray-700">Date de réception *</Label>
              <Input
                id="dateReception"
                type="date"
                value={recuData.dateReception}
                onChange={(e) => setRecuData({ ...recuData, dateReception: e.target.value })}
                className="h-10"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="montantRecu" className="text-sm font-medium text-gray-700">Montant reçu (MAD) *</Label>
              <Input
                id="montantRecu"
                type="number"
                min="0"
                value={recuData.montantRecu}
                onChange={(e) => setRecuData({ ...recuData, montantRecu: parseFloat(e.target.value) || 0 })}
                className="h-10"
                placeholder="0"
                required
              />
              <p className="text-xs text-gray-500">
                Montant attendu: {selectedTranche && projets.find(p => p.id === selectedTranche.projetId)?.tranches.find(t => t.id === selectedTranche.trancheId)?.montant ? formatBudget(projets.find(p => p.id === selectedTranche.projetId)?.tranches.find(t => t.id === selectedTranche.trancheId)?.montant || 0) : '0 MAD'}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => setShowRecuModal(false)}
              className="px-4 py-2"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmRecu}
              disabled={!recuData.dateReception || recuData.montantRecu <= 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Confirmer la réception
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 