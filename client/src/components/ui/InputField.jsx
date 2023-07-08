const InputField = ({
  label = null,
  name,
  type,
  onChange,
  state,
  placeholder,
}) => {
  return (
    <>
      <label htmlFor={name} className="text-xs font-medium -mb-2">
        {label}
      </label>
      <input
        id={name}
        type={type || "text"}
        placeholder={placeholder || name}
        className="placeholder:font-light placeholder:text-sm w-full py-1 border px-3 rounded-md"
        value={state}
        onChange={onChange}
        name={name}
        autoComplete={"off"}
      />
    </>
  );
};

export default InputField;
