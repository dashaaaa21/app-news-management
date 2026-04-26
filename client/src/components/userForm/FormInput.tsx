import { SelectComponent } from '../ui/select/select';

interface IFormInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: 'text' | 'email' | 'tel' | 'date' | 'select';
    options?: { value: string; label: string }[];
}

export default function FormInput({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    options,
}: IFormInputProps) {
    return (
        <div className="relative w-[220px] h-24">
            <p className="absolute left-2 top-2 text-sm font-bold text-gray-500 pointer-events-none z-10">
                {label}
            </p>
            {type === 'select' && options ? (
                <div className="absolute top-8 left-0 right-0 bottom-5">
                    <SelectComponent
                        value={value}
                        onChange={onChange}
                        options={options}
                        placeholder={placeholder}
                    />
                </div>
            ) : (
                <div className="absolute top-8 left-0 right-0 bottom-5 bg-white border border-gray-300 rounded-xl shadow-sm flex items-center px-5">
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full text-sm text-gray-600 bg-transparent border-none outline-none"
                    />
                </div>
            )}
        </div>
    );
}
