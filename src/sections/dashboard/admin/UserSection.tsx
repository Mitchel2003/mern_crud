import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/ui/card'
import { Button } from '#/ui/button'
import { Input } from '#/ui/input'
import { useState } from 'react'

const userData = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Administrador' },
  { id: 2, name: 'María García', email: 'maria@example.com', role: 'Técnico' },
  { id: 3, name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'Usuario' },
  { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'Técnico' },
  { id: 5, name: 'Luis Sánchez', email: 'luis@example.com', role: 'Usuario' },
]

export function UserSection() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = userData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Usuarios</CardTitle>
        <CardDescription>Administra y supervisa todos los usuarios registrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button>Agregar Usuario</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
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