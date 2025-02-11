import { useFormatMutation } from "@/hooks/query/useFormatQuery";
import { Curriculum } from "@/interfaces/context.interface";
import { useIsMobile } from "@/hooks/ui/use-mobile";
import type { Row } from "@tanstack/react-table";
import { Loader, Trash } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface DeleteCurriculumDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  cvs: Row<Curriculum>["original"][];
  onSuccess?: () => void;
  showTrigger?: boolean;
}

export function DeleteCurriculumDialog({ cvs, onSuccess, showTrigger = true, ...props }: DeleteCurriculumDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const { deleteFormat } = useFormatMutation('cv')
  const isMobile = useIsMobile()

  const onDelete = () => {
    startDeleteTransition(() => {
      Promise.all(cvs.map((cv) => deleteFormat({ id: cv._id })))
        .then((data) => {
          if (data.some((d) => !d)) return toast.error("One or more curriculums could not be deleted")
          props.onOpenChange?.(false)
          toast.success("Curriculums deleted")
          onSuccess?.()
        })
        .catch(() => toast.error("An error occurred while deleting curriculums"))
    })
  }

  if (!isMobile) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Delete ({cvs.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              <span className="font-medium">{cvs.length}</span>
              {cvs.length === 1 ? " task" : " tasks"} from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={onDelete}
              variant="destructive"
              disabled={isDeletePending}
              aria-label="Delete selected rows"
            >
              {isDeletePending && (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Delete ({cvs.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{cvs.length}</span>
            {cvs.length === 1 ? " task" : " tasks"} from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            onClick={onDelete}
            variant="destructive"
            disabled={isDeletePending}
            aria-label="Delete selected rows"
          >
            {isDeletePending && <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}