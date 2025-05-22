'use client';

export const TextInput = ({
  placeholder,
  onChange,
  label,
  type,
  value,
}: {
  placeholder: string;
  onChange: (value: string) => void;
  label: string;
  type?: 'text' | 'number' | 'password';
  value?: any;
}) => {
  return (
    <div className='pt-2'>
      <label className='block mb-2 text-sm font-medium '>{label}</label>
      <input
        onChange={(e) => onChange(e.target.value)}
        value={value}
        type={type}
        id='first_name'
        className='border border-gray-300 bg-transparent focus:bg-transparent  text-sm rounded-lg block w-full p-2.5'
        placeholder={placeholder}
      />
    </div>
  );
};
