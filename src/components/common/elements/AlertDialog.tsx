import { Curriculum } from '@/interfaces/context.interface'
import { Dispatch, SetStateAction } from 'react'
import {
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialog,
} from '#/ui/alert-dialog'


interface DeleteProductDialogProps {
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
  handleDelete: () => Promise<void> | void
  showDeleteDialog: boolean
  cv: Curriculum
}

const Alert = ({ cv, showDeleteDialog, setShowDeleteDialog, handleDelete }: DeleteProductDialogProps) => {
  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El equipo {cv?.name} será eliminado permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Alert