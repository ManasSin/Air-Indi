import React from "react";
import { Link } from "react-router-dom";

const MenuItem = ({ text, setIsOpen }) => {
  return (
    <Link
      to={`/${text}`}
      onClick={() => setIsOpen((state) => !state)}
      className="flex flex-col w-full justify-stretch hover:bg-neutral-100 cursor-pointer text-black text-sm font-medium px-2 py-3"
    >
      <p className="">{text}</p>
    </Link>
  );
};

export default MenuItem;
