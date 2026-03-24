import { useGetDatabases } from '../hooks/useDatabases/useGetDatabases'

export const MainPage = () => {
  const { data: databases = [], isLoading } = useGetDatabases()

  if (isLoading) {
    return (
      <div className="grid h-full place-items-center text-zinc-100">
        <p className="text-xs tracking-[0.2em] text-emerald-300 uppercase">
          Loading Databases
        </p>
      </div>
    )
  }

  if (databases.length === 0) {
    return (
      <div className="grid h-full place-items-center text-zinc-100">
        <p className="text-xs tracking-[0.2em] text-zinc-400 uppercase">
          No databases registered
        </p>
      </div>
    )
  }

  return <></>
}
