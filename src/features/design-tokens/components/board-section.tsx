interface BoardSectionProps {
  title: string
  children: React.ReactNode
}

export function BoardSection({ title, children }: BoardSectionProps): React.JSX.Element {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-title">{title}</h3>
      {children}
    </section>
  )
}
