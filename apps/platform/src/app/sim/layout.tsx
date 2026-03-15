export default function SimLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen pb-20">
      {children}
    </div>
  )
}
