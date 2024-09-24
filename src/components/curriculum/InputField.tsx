import { FormField, FormItem, FormLabel, FormControl } from "#/ui/form";
import { Input } from "#/ui/input";
import { Control } from "react-hook-form";

interface InputFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  type?: string;
  placeholder?: string;
}

const InputField = ({ name, label, control, type = "text", placeholder }: InputFieldProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} className="bg-white" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default InputField;