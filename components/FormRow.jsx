
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
                className='w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
            />
        </div>
    );
};

export default FormRow;
