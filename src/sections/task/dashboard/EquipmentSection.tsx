import EquipmentCard from '#/task/dashboard/CardEquipment'
import { Equipment } from '@/types/task/dashboard.type'
import React, { useState } from 'react'
import { Button } from '#/ui/button'

interface EquipmentSectionProps { equipments: Equipment[] }

const EquipmentSection: React.FC<EquipmentSectionProps> = ({ equipments }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEquipments = equipments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(equipments.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Equipos con Novedades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentEquipments.map((equipment) => (
          <EquipmentCard key={equipment.id} equipment={equipment} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Anterior
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}

export default EquipmentSection