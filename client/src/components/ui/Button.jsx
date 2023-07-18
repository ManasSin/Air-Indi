import { twMerge } from "tailwind-merge";

const Button = ({
  type = null,
  label = String,
  onClick = () => {},
  disabled = false,
  outline = false,
  small = false,
  icon: Icon,
  secondary = null,
  className = null,
  primary = null,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(`
            relative
            rounded-lg
            hover:opacity-80
            transition
            text-center
            ${
              outline
                ? "bg-white border-black border text-black"
                : secondary
                ? "border-none bg-transparent text-black w-full"
                : small
                ? "font-thin text-xs py-1 px-3"
                : primary
                ? "bg-rose-500 border-red-500 text-white py-2 w-full text-md font-semibold"
                : ""
            }
            ${className}
            `)}
    >
      {Icon && <div>{Icon}</div>}
      {label}
    </button>
  );
};

export default Button;
