"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Eye, Edit, Trash2, Upload, ExternalLink, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ManifestationScientifique {
  id: string
  intitule: string
  type: string
  ville: string
  date: string
  indexations: string
  lien: string
  justificatifs: string[]
  decision: "Accepté" | "Refusé" | "En attente"
  typeManifestation: "Organisée" | "Participation"
  commentaireExpert: string
}

const mockData: ManifestationScientifique[] = [
  {
    id: "1",
    intitule: "Conférence Internationale sur l'IA",
    type: "Conférence",
    ville: "Casablanca",
    date: "2024-03-15",
    indexations: "IEEE, Scopus",
    lien: "https://conference-ia.ma",
    justificatifs: ["programme.pdf"],
    decision: "Accepté",
    typeManifestation: "Organisée",
    commentaireExpert: "Excellente organisation",
  },
  {
    id: "2",
    intitule: "Workshop sur les Réseaux",
    type: "Workshop",
    ville: "Rabat",
    date: "2024-05-20",
    indexations: "ACM",
    lien: "https://workshop-reseaux.ma",
    justificatifs: ["certificat.pdf"],
    decision: "En attente",
    typeManifestation: "Participation",
    commentaireExpert: "",
  },
]

export default function ManifestationsScientifiques() {
  const [manifestations, setManifestations] = useState<ManifestationScientifique[]>(mockData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ManifestationScientifique | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    typeManifestation: "Organisée" as "Organisée" | "Participation",
    listeMembers: "",
    intitule: "",
    type: "",
    ville: "",
    date: "",
    indexations: "",
    lien: "",
    justificatifs: [] as File[],
  })

  const filteredManifestations = manifestations.filter((item) => {
    const matchesSearch =
      item.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ville.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.typeManifestation === typeFilter
    const matchesYear = yearFilter === "all" || item.date.startsWith(yearFilter)
    return matchesSearch && matchesType && matchesYear
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation conditionnelle : lien OU justificatifs obligatoire
    if (!formData.lien && formData.justificatifs.length === 0) {
      toast({ 
        title: "Erreur de validation", 
        description: "Veuillez fournir soit un lien, soit un justificatif",
        variant: "destructive"
      })
      return
    }

    const newManifestation: ManifestationScientifique = {
      id: editingItem?.id || Date.now().toString(),
      intitule: formData.intitule,
      type: formData.type,
      ville: formData.ville,
      date: formData.date,
      indexations: formData.indexations,
      lien: formData.lien,
      justificatifs: formData.justificatifs.map((f) => f.name),
      decision: "En attente",
      typeManifestation: formData.typeManifestation,
      commentaireExpert: "",
    }

    if (editingItem) {
      setManifestations((prev) => prev.map((item) => (item.id === editingItem.id ? newManifestation : item)))
      toast({ title: "Manifestation modifiée avec succès" })
    } else {
      setManifestations((prev) => [...prev, newManifestation])
      toast({ title: "Nouvelle manifestation ajoutée avec succès" })
    }

    setIsModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      typeManifestation: "Organisée",
      listeMembers: "",
      intitule: "",
      type: "",
      ville: "",
      date: "",
      indexations: "",
      lien: "",
      justificatifs: [],
    })
    setEditingItem(null)
  }

  const handleEdit = (item: ManifestationScientifique) => {
    setEditingItem(item)
    setFormData({
      typeManifestation: item.typeManifestation,
      listeMembers: "",
      intitule: item.intitule,
      type: item.type,
      ville: item.ville,
      date: item.date,
      indexations: item.indexations,
      lien: item.lien,
      justificatifs: [],
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setManifestations((prev) => prev.filter((item) => item.id !== id))
    toast({ title: "Manifestation supprimée avec succès" })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        justificatifs: Array.from(e.target.files || []),
      }))
    }
  }

  // Obtenir la date actuelle pour limiter la sélection
  const getCurrentDate = () => new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const years = Array.from(new Set(manifestations.map((item) => item.date.split("-")[0]))).sort()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Manifestations Scientifiques</h1>
              <p className="text-gray-600 mt-2">Gérez les manifestations scientifiques organisées et participations</p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Liste des Manifestations</CardTitle>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une nouvelle manifestation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingItem ? "Modifier la manifestation" : "Ajouter une nouvelle manifestation"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="typeManifestation">Manifestation</Label>
                          <Select
                            value={formData.typeManifestation}
                            onValueChange={(value: "Organisée" | "Participation") =>
                              setFormData((prev) => ({ ...prev, typeManifestation: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Organisée">Organisée</SelectItem>
                              <SelectItem value="Participation">Participation à l'organisation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="listeMembers">Liste des membres</Label>
                          <Input
                            id="listeMembers"
                            value={formData.listeMembers}
                            onChange={(e) => setFormData((prev) => ({ ...prev, listeMembers: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="intitule">Intitulé *</Label>
                          <Input
                            id="intitule"
                            value={formData.intitule}
                            onChange={(e) => setFormData((prev) => ({ ...prev, intitule: e.target.value }))}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Input
                            id="type"
                            value={formData.type}
                            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ville">Ville</Label>
                            <Input
                              id="ville"
                              value={formData.ville}
                              onChange={(e) => setFormData((prev) => ({ ...prev, ville: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={formData.date}
                              max={getCurrentDate()}
                              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="indexations">Indexations</Label>
                          <Input
                            id="indexations"
                            value={formData.indexations}
                            onChange={(e) => setFormData((prev) => ({ ...prev, indexations: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="lien">
                            Lien 
                            <span className={`ml-1 ${!formData.lien && formData.justificatifs.length === 0 ? 'text-red-600' : 'text-gray-500'}`}>
                              {!formData.lien && formData.justificatifs.length === 0 ? '*' : '(optionnel)'}
                            </span>
                          </Label>
                          <Input
                            id="lien"
                            type="url"
                            value={formData.lien}
                            onChange={(e) => setFormData((prev) => ({ ...prev, lien: e.target.value }))}
                            placeholder="https://..."
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="justificatifs">
                            Justificatifs 
                            <span className={`ml-1 ${!formData.lien && formData.justificatifs.length === 0 ? 'text-red-600' : 'text-gray-500'}`}>
                              {!formData.lien && formData.justificatifs.length === 0 ? '*' : '(optionnels)'}
                            </span>
                          </Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="file"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                              id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
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
                            {formData.justificatifs.length > 0 && (
                              <div className="mt-4 space-y-2">
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
                                        setFormData(prev => ({ ...prev, justificatifs: newFiles }))
                                      }}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Annuler
                          </Button>
                          <Button type="submit">{editingItem ? "Modifier" : "Ajouter"}</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher par intitulé ou ville..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="Organisée">Organisée</SelectItem>
                      <SelectItem value="Participation">Participation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {filteredManifestations.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Intitulé</TableHead>
                          <TableHead>Ville</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Décision</TableHead>
                          <TableHead>Justif</TableHead>
                          <TableHead>Type manifestation</TableHead>
                          <TableHead>Commentaire expert</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredManifestations.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={item.intitule}>
                                {item.intitule}
                              </div>
                              <div className="text-sm text-gray-500">{item.type}</div>
                            </TableCell>
                            <TableCell>{item.ville}</TableCell>
                            <TableCell>{new Date(item.date).toLocaleDateString("fr-FR")}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.decision === "Accepté"
                                    ? "default"
                                    : item.decision === "Refusé"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {item.decision}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {item.justificatifs.length > 0 ? (
                                <Badge variant="outline">{item.justificatifs.length} fichier(s)</Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{item.typeManifestation}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={item.commentaireExpert}>
                                {item.commentaireExpert || "-"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                {item.lien && (
                                  <a href={item.lien} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 underline hover:text-blue-800">
                                    Lien
                                    <ExternalLink className="h-4 w-4 ml-1" />
                                    </a>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune manifestation trouvée</p>
                    <p className="text-sm text-gray-400">
                      {searchTerm || typeFilter !== "all" || yearFilter !== "all"
                        ? "Essayez de modifier vos filtres"
                        : "Commencez par ajouter une nouvelle manifestation"}
                    </p>
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
