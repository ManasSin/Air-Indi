import React from "react";
import { Link } from "react-router-dom";

const MenuItem = ({
  text = null,
  setIsOpen,
  to = null,
  className,
  onClick = undefined,
  other,
}) => {
  return (
    <Link
      to={`/${to ?? text}`}
      onClick={() => onClick || setIsOpen((state) => !state)}
      className={`flex flex-col w-full justify-stretch hover:bg-neutral-100 cursor-pointer text-black text-xs tracking-wide font-medium px-2 py-3 ${className}`}
    >
      <p className="">{text || other}</p>
    </Link>
  );
};

export default MenuItem;
