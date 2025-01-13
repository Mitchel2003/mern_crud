import { ThemeContextProps } from '@/interfaces/context.interface'
import { useFormatMutation } from '@/hooks/query/useFormatQuery'
import AlertDialog from '#/common/elements/AlertDialog'
import { Metadata } from '@/interfaces/db.interface'
import { Trash2 } from 'lucide-react'
import { Button } from '#/ui/button'
import { useState } from 'react'
import { Card } from '#/ui/card'
import { cn } from '@/lib/utils'

interface ItemPhotoProps extends ThemeContextProps {
  image: Metadata
  id: string
}

const ItemPhoto = ({ theme, image, id }: ItemPhotoProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { deleteFile } = useFormatMutation('cv')

  const handleDelete = () => {
    deleteFile({ id, filename: image.name, ref: 'preview' })
    setShowDeleteDialog(false)
  }

  return (
    <Card className={cn(
      'relative overflow-hidden group',
      'transition-all duration-300 hover:shadow-lg',
      theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white'
    )}>
      <img src={image.url} alt={image.name} className="w-full h-60 object-cover object-center" />
      <div className={cn(
        'absolute top-2 right-2 opacity-0 group-hover:opacity-100',
        'transition-opacity duration-300'
      )}>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="rounded-full"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog
        theme={theme}
        variant="destructive"
        open={showDeleteDialog}
        onConfirm={handleDelete}
        title="¿Eliminar imagen?"
        onOpenChange={setShowDeleteDialog}
        description="Esta acción no se puede deshacer. La imagen será eliminada permanentemente."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />
    </Card>
  )
}

export default ItemPhoto