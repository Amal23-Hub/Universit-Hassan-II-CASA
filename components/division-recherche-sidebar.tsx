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
  ChevronLeft,
  ChevronRight,
  Home,
  CheckSquare,
  DollarSign,
  FileCheck,
  BookOpen,
  Send,
} from "lucide-react"

interface NavigationItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const divisionRechercheNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-division-recherche",
    icon: BarChart3,
  },
  {
    title: "Gestion des Programmes",
    href: "/dashboard-division-recherche/programmes",
    icon: BookOpen,
  },
  {
    title: "Projets soumis",
    href: "/dashboard-division-recherche/projets-soumis",
    icon: Send,
  },
  {
    title: "projet de recherche",
    href: "/dashboard-division-recherche/projets-retenus",
    icon: CheckSquare,
  },
  // {
  //   title: "Conventions",
  //   href: "/dashboard-division-recherche/conventions",
  //   icon: FileText,
  // },
  // {
  //   title: "Gestion des Versements",
  //   href: "/dashboard-division-recherche/versements",
  //   icon: DollarSign,
  // },
  // {
  //   title: "État d'avancement",
  //   href: "/dashboard-division-recherche/avancement",
  //   icon: FileCheck,
  // },
]



export function DivisionRechercheSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-12" : "w-56",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="UH2C Logo" width={24} height={24} className="rounded" />
            <span className="font-semibold text-gray-900 text-sm">Division Recherche</span>
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
        {divisionRechercheNavigation.map((item) => {
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