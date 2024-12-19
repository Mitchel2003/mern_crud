import { LucideIcon, MapPinHouseIcon, XCircle } from 'lucide-react'
import { Headquarter } from '@/interfaces/context.interface'
import { MultiSelect } from '#/ui/select-multi'
import { useState } from 'react'

interface Option {
  value: string
  label: string
  icon: LucideIcon
}

const SelectMulti = ({ locations }: { locations?: Headquarter[] }) => {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])

  const clientsOptions = normalize(locations) || [{ label: 'Ningun cliente', value: 'n/a', icon: XCircle }]

  return (
    <MultiSelect
      maxCount={2}
      variant="inverted"
      options={clientsOptions}
      onValueChange={setSelectedFrameworks}
      defaultValue={selectedFrameworks}
      placeholder="Seleccionar clientes"
    />
  )
}

export default SelectMulti
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const normalize = (locations?: Headquarter[]): Option[] | undefined => locations && locations.length > 0
  ? locations.map(e => ({
    value: e._id,
    icon: MapPinHouseIcon,
    label: `${e.client} - ${e.address} - ${e.city}`
  }))
  : undefined