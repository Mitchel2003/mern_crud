import { FormField, FormItem, FormLabel, FormControl } from "#/ui/form";
import { Button } from "#/ui/button";

import { Camera, X } from "lucide-react";
import { useState, useRef } from "react";
import { Control } from "react-hook-form";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  control: Control<any>;
}

const ImageUploadField = ({ name, label, control }: ImageUploadFieldProps) => {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div
              className={cn(
                "mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10",
                "cursor-pointer transition-colors duration-200 ease-in-out",
                "hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              )}
              onClick={triggerFileInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  triggerFileInput();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Subir imagen del equipo"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => {
                  handleImage(e);
                  onChange(e.target.files?.[0] || null);
                }}
                {...field}
              />
              {image ? (
                <div className="relative w-full h-48">
                  <img
                    src={image}
                    alt="Vista previa del equipo"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                      onChange(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <span className="font-semibold text-primary hover:text-primary-dark">
                      Subir imagen
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-gray-600 mt-1">PNG, JPG, JPEG hasta 5MB</p>
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default ImageUploadField;