export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  // Map 'dark' to 'primary' and 'light' to 'secondary' for backward compatibility
  const normalizedVariant = variant === 'dark' ? 'primary' : variant === 'light' ? 'secondary' : variant

  return (
    <button
      className={`btn btn-${normalizedVariant} btn-${size} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
