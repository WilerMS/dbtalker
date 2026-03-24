import * as LucideIcons from 'lucide-react'
import type { LucideIcon, LucideProps } from 'lucide-react'

interface DynamicIconProps extends LucideProps {
  name: string
}

const fallbackIcon: LucideIcon = LucideIcons.CircleHelp

const isLucideIcon = (value: unknown): value is LucideIcon =>
  typeof value === 'object'

export const DynamicIcon = ({ name, ...iconProps }: DynamicIconProps) => {
  const maybeIcon = (LucideIcons as Record<string, unknown>)[name]
  const IconComponent = isLucideIcon(maybeIcon) ? maybeIcon : fallbackIcon
  return <IconComponent {...iconProps} />
}
