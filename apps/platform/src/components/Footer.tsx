import Link from 'next/link'
import { Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full flex justify-center py-6">
      <Link
        href="https://github.com/crisacm/concurso-docente-2026"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <Github className="h-4 w-4" />
        <span>Proyecto de código abierto bajo licencia GNU GPLv3</span>
      </Link>
    </footer>
  )
}
