import { DatabaseZap, LockKeyhole, Network, Server } from 'lucide-react'
import { useState, type ChangeEvent, type JSX } from 'react'
import { InputField } from '../../../ui/InputField'
import { PasswordField } from '../../../ui/PasswordField'
import { SelectField } from '../../../ui/SelectField'

interface CreateDatabaseModalContentProps {
  onClose: () => void
}

interface CreateDatabaseFormState {
  databaseName: string
  engine: string
  host: string
  port: string
  database: string
  username: string
  password: string
  useSsl: boolean
}

const initialFormState: CreateDatabaseFormState = {
  databaseName: '',
  engine: 'postgresql',
  host: '',
  port: '5432',
  database: '',
  username: '',
  password: '',
  useSsl: true,
}

const sqlEngineOptions = [
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'MariaDB', value: 'mariadb' },
  { label: 'SQL Server', value: 'sqlserver' },
  { label: 'SQLite', value: 'sqlite' },
] as const

const baseFieldClassName =
  'w-full rounded-2xl border border-zinc-800 bg-zinc-950/75 px-4 py-3 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-zinc-500 focus:border-emerald-400/60 focus:bg-zinc-950 focus:shadow-[0_0_0_1px_rgba(52,211,153,0.2),0_0_18px_rgba(52,211,153,0.12)]'

export const CreateDatabaseModalContent = ({
  onClose,
}: CreateDatabaseModalContentProps): JSX.Element => {
  const [formState, setFormState] =
    useState<CreateDatabaseFormState>(initialFormState)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = event.target
    const nextValue =
      event.target instanceof HTMLInputElement &&
      event.target.type === 'checkbox'
        ? event.target.checked
        : value

    setFormState((currentState) => ({
      ...currentState,
      [name]: nextValue,
    }))
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/35 to-transparent" />

      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(280px,0.68fr)]">
        <div className="border-b border-zinc-800/90 p-6 md:p-8 lg:border-r lg:border-b-0">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium tracking-[0.24em] text-emerald-300 uppercase">
                <DatabaseZap className="size-3.5" />
                New SQL Source
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-[0.02em] text-zinc-50 md:text-3xl">
                  Create database connection
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-zinc-400">
                  This screen is only the UI layer for now. You can define a
                  generic SQL connection profile, but nothing will be sent to
                  the backend yet.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2 text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase transition-all duration-300 hover:border-emerald-400/40 hover:text-emerald-200 hover:shadow-[0_0_18px_rgba(52,211,153,0.18)]"
            >
              Close
            </button>
          </div>

          <form
            className="space-y-6"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Display name"
                containerClassName="space-y-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                inputClassName={baseFieldClassName}
                name="databaseName"
                value={formState.databaseName}
                onChange={handleChange}
                placeholder="Analytics Warehouse"
              />

              <SelectField
                label="Engine"
                options={sqlEngineOptions}
                containerClassName="space-y-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                selectClassName={baseFieldClassName}
                name="engine"
                value={formState.engine}
                onChange={handleChange}
              />

              <InputField
                label="Host"
                containerClassName="space-y-2 md:col-span-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                inputClassName={baseFieldClassName}
                name="host"
                value={formState.host}
                onChange={handleChange}
                placeholder="db.company.internal"
              />

              <InputField
                label="Port"
                containerClassName="space-y-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                inputClassName={baseFieldClassName}
                name="port"
                value={formState.port}
                onChange={handleChange}
                inputMode="numeric"
                placeholder="5432"
              />

              <InputField
                label="Database name"
                containerClassName="space-y-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                inputClassName={baseFieldClassName}
                name="database"
                value={formState.database}
                onChange={handleChange}
                placeholder="warehouse"
              />

              <InputField
                label="Username"
                containerClassName="space-y-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                inputClassName={baseFieldClassName}
                name="username"
                value={formState.username}
                onChange={handleChange}
                placeholder="readonly_user"
              />

              <PasswordField
                label="Password"
                containerClassName="space-y-2"
                labelClassName="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase"
                inputClassName={baseFieldClassName}
                name="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="••••••••••••"
              />
            </div>

            <label className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/55 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-zinc-100">SSL enabled</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Reserve the secure transport flag as part of the connection
                  profile.
                </p>
              </div>

              <span className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  name="useSsl"
                  checked={formState.useSsl}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full border border-zinc-700 bg-zinc-900 transition-colors duration-300 peer-checked:border-emerald-400/50 peer-checked:bg-emerald-400/20" />
                <span className="pointer-events-none absolute left-1 size-4 rounded-full bg-zinc-300 transition-transform duration-300 peer-checked:translate-x-5 peer-checked:bg-emerald-300" />
              </span>
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/90 pt-5">
              <p className="text-xs leading-5 text-zinc-500">
                UI only. Submission and validation will be connected later.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2.5 text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled
                  className="rounded-full border border-emerald-400/30 bg-emerald-400/12 px-5 py-2.5 text-xs font-medium tracking-[0.18em] text-emerald-200 uppercase opacity-60"
                >
                  Create database
                </button>
              </div>
            </div>
          </form>
        </div>

        <aside className="relative p-6 md:p-8">
          <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent lg:hidden" />
          <div className="space-y-4">
            <div className="rounded-[24px] border border-zinc-800 bg-zinc-950/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-300">
                  <Server className="size-5" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase">
                    Connection preview
                  </p>
                  <p className="mt-1 text-sm font-medium text-zinc-100">
                    {formState.databaseName || 'Untitled source'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-zinc-400">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/45 px-4 py-3">
                  <span>Engine</span>
                  <span className="text-zinc-100">{formState.engine}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/45 px-4 py-3">
                  <span>Network target</span>
                  <span className="truncate text-zinc-100">
                    {formState.host || 'pending-host'}:
                    {formState.port || '0000'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/45 px-4 py-3">
                  <span>Database</span>
                  <span className="text-zinc-100">
                    {formState.database || 'pending-database'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-zinc-800 bg-zinc-950/50 p-5">
              <p className="mb-3 text-xs tracking-[0.2em] text-zinc-500 uppercase">
                Included fields
              </p>
              <div className="space-y-3 text-sm text-zinc-400">
                <div className="flex items-center gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/40 px-4 py-3">
                  <Network className="size-4 text-emerald-300" />
                  Host, port and database namespace
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/40 px-4 py-3">
                  <LockKeyhole className="size-4 text-emerald-300" />
                  Credentials and SSL toggle
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/40 px-4 py-3">
                  <DatabaseZap className="size-4 text-emerald-300" />
                  Generic SQL engine selector
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
