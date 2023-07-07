import React from "react";

const Button = ({
  label,
  onClick,
  disabled = false,
  outline = false,
  small = false,
  icon: Icon,
  secondary = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
            relative
            ${disabled ? "opacity-70 cursor-not-allowed" : ""}
            rounded-lg
            hover:opacity-80
            transition
            text-center
            ${outline ? "bg-white" : "bg-rose-500"}
            ${outline ? "border-black border" : "border-rose-500"}
            ${secondary ? "border-none bg-white" : ""}
            ${outline ? "text-black" : "text-white"}
            ${small ? "py-1" : "py-2"}
            ${small ? "font-thin text-xs" : "text-md font-semibold"}
            ${small || outline ? "border" : "border-2 w-full"}
        `}
    >
      {Icon && <div>{Icon}</div>}
      {label}
    </button>
  );
};

export default Button;
