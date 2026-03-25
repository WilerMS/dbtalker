import type { RawThemeSetting, ThemeRegistrationAny } from 'shiki'

/**
 * DBTalkie code theme — cyberpunk/neon palette aligned with the app design system.
 *
 * Accent map:
 *   emerald-400  #34d399  → keywords, tags
 *   cyan-300     #67e8f9  → numbers, attributes, operators
 *   violet-400   #a78bfa  → functions
 *   purple-400   #c084fc  → types, classes
 *   green-300    #86efac  → strings
 *   blue-300     #93c5fd  → properties, member access
 *   pink-400     #f472b6  → constants, language literals
 *   amber-400    #fbbf24  → parameters
 *   slate-200    #e2e8f0  → variables, identifiers
 *   zinc-400     #a1a1aa  → punctuation
 *   zinc-600     #52525b  → comments (italic)
 */
const dbtalkieTokenColors: RawThemeSetting[] = [
  // Global defaults (no scope = base styles)
  {
    settings: { foreground: '#f4f4f5', background: '#00000000' },
  },
  // Comments
  {
    scope: ['comment', 'punctuation.definition.comment'],
    settings: { foreground: '#52525b', fontStyle: 'italic' },
  },

  // Keywords
  {
    scope: [
      'keyword',
      'keyword.control',
      'keyword.declaration',
      'storage.type',
      'storage.modifier',
      'keyword.other.unit',
    ],
    settings: { foreground: '#34d399' },
  },

  // Strings
  {
    scope: ['string', 'string.quoted', 'string.template'],
    settings: { foreground: '#86efac' },
  },
  {
    scope: ['punctuation.definition.string', 'string.interpolated'],
    settings: { foreground: '#4ade80' },
  },

  // Numbers / booleans / null
  {
    scope: [
      'constant.numeric',
      'keyword.other.unit',
      'constant.language.boolean',
      'constant.language.null',
      'constant.language.undefined',
    ],
    settings: { foreground: '#67e8f9' },
  },

  // Functions
  {
    scope: [
      'entity.name.function',
      'entity.name.method',
      'support.function',
      'meta.function-call entity.name.function',
    ],
    settings: { foreground: '#a78bfa' },
  },

  // Types / Classes / Interfaces
  {
    scope: [
      'entity.name.type',
      'entity.name.class',
      'entity.name.interface',
      'support.type',
      'support.class',
      'storage.type.class',
      'entity.other.inherited-class',
    ],
    settings: { foreground: '#c084fc' },
  },

  // Variables / Identifiers
  {
    scope: [
      'variable',
      'variable.other',
      'variable.other.readwrite',
      'variable.other.object',
      'meta.definition.variable',
    ],
    settings: { foreground: '#e2e8f0' },
  },

  // Parameters
  {
    scope: ['variable.parameter', 'meta.parameters variable'],
    settings: { foreground: '#fbbf24' },
  },

  // Properties / Member access
  {
    scope: [
      'variable.other.property',
      'support.variable.property',
      'meta.property-name',
      'entity.name.tag.yaml',
    ],
    settings: { foreground: '#93c5fd' },
  },

  // Constants
  {
    scope: ['constant.language', 'variable.other.constant', 'support.constant'],
    settings: { foreground: '#f472b6' },
  },

  // Operators
  {
    scope: [
      'keyword.operator',
      'keyword.operator.assignment',
      'keyword.operator.comparison',
      'keyword.operator.logical',
      'keyword.operator.arithmetic',
    ],
    settings: { foreground: '#67e8f9' },
  },

  // Punctuation
  {
    scope: ['punctuation', 'meta.brace', 'meta.delimiter'],
    settings: { foreground: '#a1a1aa' },
  },

  // HTML / JSX Tags
  {
    scope: ['entity.name.tag'],
    settings: { foreground: '#34d399' },
  },
  {
    scope: ['entity.other.attribute-name'],
    settings: { foreground: '#67e8f9' },
  },

  // Imports / modules
  {
    scope: ['keyword.control.import', 'keyword.control.export'],
    settings: { foreground: '#34d399' },
  },
  {
    scope: ['variable.other.module', 'entity.name.module'],
    settings: { foreground: '#c084fc' },
  },

  // SQL specific
  {
    scope: ['keyword.other.DML', 'keyword.other.DDL', 'support.function.sql'],
    settings: { foreground: '#34d399' },
  },
  {
    scope: ['constant.other.table-name'],
    settings: { foreground: '#c084fc' },
  },
]

export const dbtalkieTheme: ThemeRegistrationAny = {
  name: 'dbtalkie',
  type: 'dark',
  colors: {
    'editor.background': '#00000000',
    'editor.foreground': '#f4f4f5',
  },
  tokenColors: dbtalkieTokenColors,
  settings: dbtalkieTokenColors,
}
