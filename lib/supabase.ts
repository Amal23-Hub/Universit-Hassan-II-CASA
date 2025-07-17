import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
  }
}

// Types
export interface Team {
  id: string
  name: string
  description: string | null
  research_area: string | null
  created_at: string
  updated_at: string
}

export interface Member {
  id: string
  name: string
  email: string | null
  role: string | null
  is_leader: boolean
  team_id: string | null
  created_at: string
  updated_at: string
}

// Mock data for development/fallback
export const mockTeams: (Team & { members: Member[] })[] = [
  {
    id: "1",
    name: "Équipe Intelligence Artificielle",
    description: "Recherche en IA et apprentissage automatique",
    research_area: "Intelligence Artificielle",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    members: [
      {
        id: "1",
        name: "Dr. Ahmed Benali",
        email: "ahmed.benali@uh2c.ma",
        role: "Professeur",
        is_leader: true,
        team_id: "1",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        name: "Dr. Fatima Zahra",
        email: "fatima.zahra@uh2c.ma",
        role: "Maître Assistant",
        is_leader: false,
        team_id: "1",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
    ],
  },
  {
    id: "2",
    name: "Équipe Cybersécurité",
    description: "Sécurité informatique et cryptographie",
    research_area: "Cybersécurité",
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    members: [
      {
        id: "3",
        name: "Dr. Youssef Alami",
        email: "youssef.alami@uh2c.ma",
        role: "Professeur",
        is_leader: true,
        team_id: "2",
        created_at: "2024-01-20T14:30:00Z",
        updated_at: "2024-01-20T14:30:00Z",
      },
    ],
  },
]

export { supabase }
