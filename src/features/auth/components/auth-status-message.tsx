interface AuthStatusMessageProps {
  message: string | null
}

export function AuthStatusMessage({ message }: AuthStatusMessageProps): React.JSX.Element {
  return (
    <p role="status" className="min-h-[18px] text-small font-medium">
      {message}
    </p>
  )
}
