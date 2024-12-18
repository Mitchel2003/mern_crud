import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/ui/card'
import { Button } from '#/ui/button'
import { Input } from '#/ui/input'
import { useState } from 'react'

const equipmentData = [
  { id: 1, name: 'Equipo Dental A', status: 'Activo', nextMaintenance: '2023-12-15' },
  { id: 2, name: 'Equipo Rayos X', status: 'En mantenimiento', nextMaintenance: '2023-11-30' },
  { id: 3, name: 'Sillón Odontológico', status: 'Activo', nextMaintenance: '2024-01-10' },
  { id: 4, name: 'Esterilizador', status: 'Inactivo', nextMaintenance: '2023-12-05' },
  { id: 5, name: 'Compresor', status: 'Activo', nextMaintenance: '2023-12-20' },
]

export function EquipmentSection() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEquipment = equipmentData.filter(equipment =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión deGestión de Equipos</CardTitle>
        <CardDescription>Administra y supervisa todos los equipos registrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Buscar equipos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button>Agregar Equipo</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Próximo Mantenimiento</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.map((equipment) => (
              <TableRow key={equipment.id}>
                <TableCell>{equipment.name}</TableCell>
                <TableCell>{equipment.status}</TableCell>
                <TableCell>{equipment.nextMaintenance}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">Editar</Button>
                  <Button variant="outline" size="sm">Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}