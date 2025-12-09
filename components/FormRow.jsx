
const FormRow = ({ type, name, value, handleChange, labelText }) => {
    return (
        <div className='mb-4'>
            <label htmlFor={name} className='block text-gray-700 capitalize mb-2 font-medium'>
                {labelText || name}
            </label>
            <input
                type={type}
                value={value}
                name={name}
                onChange={handleChange}
                className='w-full p-[10px] border border-[#ccc] rounded-[6px] bg-[#ffffff] text-[#000000] placeholder:text-[#888] placeholder:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
            />
        </div>
    );
};

export default FormRow;
