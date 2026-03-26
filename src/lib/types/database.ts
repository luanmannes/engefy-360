export type UserRole = 'admin' | 'diretor' | 'colaborador'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  department: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  module_number: number
  accent: 'gold' | 'steel'
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description: string | null
  video_url: string | null
  transcript: string | null
  ai_summary: string | null
  ai_study_guide: StudyGuide | null
  duration_minutes: number | null
  sort_order: number
  created_at: string
}

export interface StudyGuide {
  sections: {
    title: string
    content: string
    key_points: string[]
  }[]
}

export interface Assessment {
  id: string
  course_id: string
  title: string
  questions: Question[]
  passing_score: number
  available_after_days: number
  created_at: string
}

export type Question = MCQuestion | OpenQuestion

export interface MCQuestion {
  type: 'mc'
  text: string
  options: string[]
  correct: number
  feedback: string
}

export interface OpenQuestion {
  type: 'open'
  text: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  class_date: string | null
  assessment_available_at: string | null
  video_access_unlocked: boolean
  enrolled_at: string
  completed_at: string | null
}

export interface AssessmentResult {
  id: string
  user_id: string
  assessment_id: string
  enrollment_id: string
  score: number
  max_score: number
  percentage: number
  answers: Record<number, number>
  open_answers: Record<number, string> | null
  passed: boolean
  completed_at: string
}

export interface RankingEntry {
  user_id: string
  full_name: string
  department: string | null
  assessments_completed: number
  total_score: number
  total_max_score: number
  avg_percentage: number
  courses_enrolled: number
}
