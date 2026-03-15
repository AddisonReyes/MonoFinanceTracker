type FormInputProps = {
  type: string;
  label: string;
  id: string;
  name: string;
  value: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function FormInput({
  type,
  label,
  id,
  name,
  value,
  onChange,
  required = false,
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-black/80 dark:text-white/80"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 dark:border-white/15 dark:bg-black dark:text-white"
      />
    </div>
  );
}

export default FormInput;
