import FormCurriculumSection, { FooterProps } from '@/sections/curriculum/FormCurriculumSection';
import { Curriculum, ThemeContextProps } from "@/interfaces/context.interface";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetTitle,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";

interface UpdateTaskSheetProps extends React.ComponentPropsWithRef<typeof Sheet>, ThemeContextProps {
  cv: Curriculum | null
}

export function UpdateTaskSheet({ cv, theme, ...props }: UpdateTaskSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update task</SheetTitle>
          <SheetDescription>
            Update the task details and save the changes
          </SheetDescription>
        </SheetHeader>

        <FormCurriculumSection
          id={cv?._id}
          theme={theme}
          footer={Footer}
          onChange={() => {
            props.onOpenChange?.(false)
            toast.success("Task updated")
          }}
        />
      </SheetContent>
    </Sheet>
  )
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const Footer = React.memo(({
  isSubmitting,
  onSubmit,
  onReset
}: FooterProps) => {
  return (
    <SheetFooter className="gap-2 pt-2 sm:space-x-0">
      <SheetClose asChild>
        <Button type="button" variant="outline" onClick={onReset}>
          Cancel
        </Button>
      </SheetClose>
      <Button disabled={isSubmitting} onClick={onSubmit}>
        {isSubmitting && (
          <Loader
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
        )}
        Save
      </Button>
    </SheetFooter>
  )
})