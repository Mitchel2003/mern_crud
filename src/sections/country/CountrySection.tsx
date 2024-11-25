import { ThemeContextProps } from "@/interfaces/context.interface"

const CountrySection = ({ theme }: ThemeContextProps) => {
  return <Table theme={theme} />
}

export default CountrySection

interface TableProps extends ThemeContextProps { }
const Table = ({ theme }: TableProps) => {
  //aqui va el componente de la tabla tanStack table
  return (
    <>

    </>
  )
}
