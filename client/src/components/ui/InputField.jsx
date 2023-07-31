const InputField = ({
  label = null,
  name,
  type,
  onChange,
  state,
  placeholder,
  focus = false,
}) => {
  return (
    <div className="w-full relative">
      <input
        id={name}
        type={type || "text"}
        placeholder={" "}
        className="placeholder:font-light placeholder:text-sm w-full py-1 border px-3 rounded-md peer
        p-4
        pt-6 
        font-light 
        bg-white 
        outline-none
        transition
        disabled:opacity-70
        disabled:cursor-not-allowed"
        value={state}
        onChange={onChange}
        name={name}
        autoComplete={"off"}
        autoFocus={focus}
      />
      <label
        htmlFor={name}
        className="text-xs font-medium -mb-2 absolute 
          text-md
          duration-150 
          transform 
          -translate-y-3 
          top-5 
          z-10 
          origin-[0]
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75
          peer-focus:-translate-y-4
          left-3
          "
      >
        {label}
      </label>
    </div>
  );
};

export default InputField;
