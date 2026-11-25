interface TokenNameProps {
  name: string
  detail: string
}

export function TokenName({ name, detail }: TokenNameProps): React.JSX.Element {
  return (
    <span className="flex min-w-0 flex-col">
      <code className="truncate font-mono text-label">--{name}</code>
      <span className="truncate font-mono text-small text-muted-foreground">{detail}</span>
    </span>
  )
}
