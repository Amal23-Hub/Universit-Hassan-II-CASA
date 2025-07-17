"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { 
  FileText, 
  Clock, 
  CheckSquare, 
  TrendingUp,
  Users, 
  BookOpen, 
  Globe,
  Award
} from "lucide-react"

export default function DashboardPoleRecherche() {
  // KPI data for pole recherche dashboard
  const kpiData = {
    // Row 1
    totalProjects: 24,
    pendingReviews: 8,
    approvedProjects: 12,
    totalBudget: 15000000,
    // Row 2
    activePrograms: 6,
    totalResearchers: 89,
    researchDomains: 8,
    successRate: 75
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Pôle de Recherche</h1>
              <p className="text-gray-600 mt-2">Bienvenue, Dr. Karim Alami - Directeur du Pôle de Recherche</p>
            </div>

            {/* Pole Recherche Profile Card */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback>KA</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Dr. Karim Alami</CardTitle>
                    <CardDescription>Directeur du Pôle de Recherche</CardDescription>
                    <Badge variant="secondary" className="mt-2">
                      Pôle de Recherche UH2C
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Pole Recherche KPIs - Row 1 */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistiques des projets</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projets</CardTitle>
                    <FileText className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{kpiData.totalProjects}</div>
                    <p className="text-xs text-muted-foreground">Total soumis</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">En révision</CardTitle>
                    <Clock className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{kpiData.pendingReviews}</div>
                    <p className="text-xs text-muted-foreground">En attente</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
                    <CheckSquare className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{kpiData.approvedProjects}</div>
                    <p className="text-xs text-muted-foreground">Projets validés</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Budget total</CardTitle>
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{formatBudget(kpiData.totalBudget)}</div>
                    <p className="text-xs text-muted-foreground">Alloué</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Pole Recherche KPIs - Row 2 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistiques générales</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-teal-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Programmes</CardTitle>
                    <BookOpen className="h-4 w-4 text-teal-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-teal-600">{kpiData.activePrograms}</div>
                    <p className="text-xs text-muted-foreground">Actifs</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Chercheurs</CardTitle>
                    <Users className="h-4 w-4 text-indigo-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-indigo-600">{kpiData.totalResearchers}</div>
                    <p className="text-xs text-muted-foreground">Impliqués</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-pink-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Domaines</CardTitle>
                    <Globe className="h-4 w-4 text-pink-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-pink-600">{kpiData.researchDomains}</div>
                    <p className="text-xs text-muted-foreground">De recherche</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taux de succès</CardTitle>
                    <Award className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">{kpiData.successRate}%</div>
                    <p className="text-xs text-muted-foreground">Projets approuvés</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 