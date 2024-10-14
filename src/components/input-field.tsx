import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";

interface InputFieldProps {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    control: Control<any>;
    inputClassName?: string;
    debounced?: (event: string) => void;
}

const InputField = ({
    name,
    label,
    type = "text",
    placeholder,
    control,
    inputClassName,
    debounced
}: InputFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem>
                    <Label htmlFor={name}>{label}</Label>
                    <div className="relative">
                        <FormControl>
                            <Input
                                id={name}
                                type={(type === "password" && showPassword) ? "text" : type}
                                placeholder={placeholder}
                                className={inputClassName}
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e)
                                    // Trigger `setUsername` only if the name is "username"
                                    if (name === "username" && debounced) {
                                        debounced(e.target.value);
                                    }
                                }}
                            />
                        </FormControl>
                        {type === "password" && (
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-2.5 right-3 text-slate-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        )}
                    </div>
                    <FormMessage className="text-xs"/>
                </FormItem>
            )}
        />
    );
};

export default InputField;