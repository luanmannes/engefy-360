import CourseCard from './CourseCard'

interface CourseItem {
  id: string
  title: string
  subtitle: string
  module: string
  date: string
  accent: 'gold' | 'steel'
  questionCount: number
}

export default function CourseGrid({ courses }: { courses: CourseItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
