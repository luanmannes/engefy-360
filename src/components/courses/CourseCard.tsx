import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Clock, CheckSquare, ArrowRight } from 'lucide-react'

interface CourseItem {
  id: string
  title: string
  subtitle: string
  module: string
  date: string
  accent: 'gold' | 'steel'
  questionCount: number
}

export default function CourseCard({ course }: { course: CourseItem }) {
  return (
    <Link href={`/cursos/${course.id}/avaliacao`}>
      <Card hover accent={course.accent}>
        <Badge variant={course.accent} size="sm">
          {course.module} · {course.date}
        </Badge>

        <h3 className="font-head text-xl font-extrabold text-txtprimary mt-3 mb-2 leading-tight">
          {course.title}
        </h3>

        <p className="text-sm text-txtmuted leading-relaxed mb-5">
          {course.subtitle}
        </p>

        <div className="flex gap-4 mb-5">
          <div className="flex items-center gap-1.5 text-xs text-txtmuted">
            <Clock size={13} className="opacity-60" />
            ~8 min
          </div>
          <div className="flex items-center gap-1.5 text-xs text-txtmuted">
            <CheckSquare size={13} className="opacity-60" />
            {course.questionCount} pts
          </div>
        </div>

        <div className={`inline-flex items-center gap-1.5 font-head text-xs font-bold uppercase tracking-wider ${
          course.accent === 'gold' ? 'text-gold' : 'text-steel-light'
        }`}>
          Fazer avaliacao <ArrowRight size={14} />
        </div>
      </Card>
    </Link>
  )
}
