interface KitSectionProps {
  title: string
  kicker: string | null
  children: React.ReactNode
}

export function KitSection({ title, kicker, children }: KitSectionProps): React.JSX.Element {
  return (
    <section className="flex min-w-0 flex-col gap-5">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-display-m">{title}</h2>
        {kicker === null ? null : <p className="font-hand text-kicker text-hand">{kicker}</p>}
      </header>
      {children}
    </section>
  )
}
