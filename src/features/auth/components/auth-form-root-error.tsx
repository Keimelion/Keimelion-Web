interface AuthFormRootErrorProps {
  message: string | undefined
}

export function AuthFormRootError({ message }: AuthFormRootErrorProps): React.JSX.Element | null {
  if (message === undefined) return null
  return (
    <p role="alert" className="text-small font-medium text-danger">
      {message}
    </p>
  )
}
