import { Input } from '@heroui/react';

interface FormInputProps {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  isTouched: boolean;
}

export function FormInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  isTouched,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-small font-semibold text-slate-700">
        {label}
      </label>

      <Input
        type={type}
        placeholder={placeholder}
        color="bordered"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />

      {isTouched && error && (
        <span className="text-xs font-medium text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}