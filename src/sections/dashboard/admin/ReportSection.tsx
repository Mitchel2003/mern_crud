import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/ui/card'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Button } from '#/ui/button'
import { useState } from 'react'

const reportData = [
  { date: '2023-01-01', count: 12 },
  { date: '2023-02-01', count: 19 },
  { date: '2023-03-01', count: 3 },
  { date: '2023-04-01', count: 5 },
  { date: '2023-05-01', count: 2 },
  { date: '2023-06-01', count: 3 },
  { date: '2023-07-01', count: 10 },
  { date: '2023-08-01', count: 6 },
  { date: '2023-09-01', count: 8 },
  { date: '2023-10-01', count: 15 },
  { date: '2023-11-01', count: 20 },
  { date: '2023-12-01', count: 25 },
]

export function ReportSection() {
  const [reportType, setReportType] = useState('monthly')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informes Generados</CardTitle>
        <CardDescription>Visualiza la cantidad de informes generados a lo largo del tiempo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diario</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
          <Button>Generar Informe</Button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}