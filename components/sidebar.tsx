"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  MessageSquare,
  Award,
  Shield,
  GraduationCap,
  Calendar,
  UserPlus,
  CheckSquare,
  FlaskConical,
  Target,
  DollarSign,
  FileCheck,
  Calculator,
  List,
} from "lucide-react"

interface NavigationItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const memberNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-member",
    icon: BarChart3,
  },
  // {
  //   title: "Soumission Appel à Projet",
  //   href: "/dashboard-member/soumission-appel",
  //   icon: Target,
  // },
  {
    title: "Publications",
    href: "/publications",
    icon: BookOpen,
  },
  {
    title: "Mes projets retenus",
    href: "/projets-contrats",
    icon: FileText,
  },
  {
    title: "Manifestations Scientifiques",
    href: "/manifestations-scientifiques",
    icon: Calendar,
  },
  {
    title: "Distinctions & Prix",
    href: "/distinctions-prix",
    icon: Award,
  },
  // {
  //   title: "Programme d'emploi",
  //   href: "/dashboard-member/programme-emploi",
  //   icon: Calculator,
  // },
  {
    title: "Liste des programmes",
    href: "/dashboard-member/liste-programmes",
    icon: List,
  },
]

const adminNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-admin",
    icon: BarChart3,
  },
  {
    title: "Demande d'inscription",
    href: "/dashboard-admin/users",
    icon: UserPlus,
    badge: "12",
  },
  {
    title: "Validation laboratoire",
    href: "/dashboard-admin/demandes",
    icon: CheckSquare,
    badge: "5",
  },
]

const expertNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-expert",
    icon: BarChart3,
  },
]

const poleRechercheNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-polerecherche",
    icon: BarChart3,
  },
  {
    title: "Programmes",
    href: "/dashboard-polerecherche/programmes",
    icon: FlaskConical,
  },
  {
    title: "Demandes de projets",
    href: "/dashboard-polerecherche/demandes",
    icon: FileText,
    badge: "5",
  },
]

const divisionRechercheNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-division-recherche",
    icon: BarChart3,
  },
  {
    title: "projet de recherche",
    href: "/dashboard-division-recherche/projets-retenus",
    icon: CheckSquare,
  },
  {
    title: "Conventions",
    href: "/dashboard-division-recherche/conventions",
    icon: FileText,
  },
  {
    title: "Gestion des Versements",
    href: "/dashboard-division-recherche/versements",
    icon: DollarSign,
  },
  {
    title: "État d'avancement",
    href: "/dashboard-division-recherche/avancement",
    icon: FileCheck,
  },
]

const memberDashboardNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-member",
    icon: BarChart3,
  },
  // {
  //   title: "Soumission Appel à Projet",
  //   href: "/dashboard-member/soumission-appel",
  //   icon: Target,
  // },
  {
    title: "Publications",
    href: "/publications",
    icon: BookOpen,
  },
  {
    title: "Mes projets retenus",
    href: "/projets-contrats",
    icon: FileText,
  },
  {
    title: "Manifestations Scientifiques",
    href: "/manifestations-scientifiques",
    icon: Calendar,
  },
  {
    title: "Distinctions & Prix",
    href: "/distinctions-prix",
    icon: Award,
  },
  // {
  //   title: "Programme d'emploi",
  //   href: "/dashboard-member/programme-emploi",
  //   icon: Calculator,
  // },
  {
    title: "Liste des programmes",
    href: "/dashboard-member/liste-programmes",
    icon: List,
  },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  // Determine which navigation to show based on current path
  const getNavigation = () => {
    if (pathname.startsWith("/dashboard-admin")) {
      return adminNavigation
    }
    if (pathname.startsWith("/dashboard-expert")) {
      return expertNavigation
    }
    if (pathname.startsWith("/dashboard-polerecherche")) {
      return poleRechercheNavigation
    }
    if (pathname.startsWith("/dashboard-division-recherche")) {
      return divisionRechercheNavigation
    }
    if (pathname.startsWith("/dashboard-member")) {
      return memberDashboardNavigation
    }
    return memberNavigation
  }

  const navigation = getNavigation()

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-12" : "w-48",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="UH2C Logo" width={24} height={24} className="rounded" />
            <span className="font-semibold text-gray-900 text-sm">UH2C</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-6 w-6 p-0">
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1",
        isCollapsed ? "py-3 flex flex-col items-center space-y-1" : "p-3 space-y-1"
      )}>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                  isActive ? "bg-uh2c-blue text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  isCollapsed && "justify-center px-0 py-1.5"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-gray-200", isCollapsed ? "p-2" : "p-3") }>
        <Link href="/">
          <div
            className={cn(
              "flex items-center space-x-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
              "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              isCollapsed && "justify-center px-0 py-1.5"
            )}
          >
            <Home className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Accueil</span>}
          </div>
        </Link>
      </div>
    </div>
  )
}
