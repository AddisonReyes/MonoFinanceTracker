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
    <div>
      <label htmlFor={id}>{label}:</label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default FormInput;
