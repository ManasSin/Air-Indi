import { useCallback, useState } from "react";
import MenuItem from "./MenuItem";
import { Link } from "react-router-dom";
import { useAuthContext } from "../Hooks/userHook";

const UserMenu = () => {
  const { user } = useAuthContext();

  const logoGlobe = (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="1.0"
      viewBox="0 0 22 22"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-[100%] h-[100%]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      ></path>
    </svg>
  );

  const logoUser = (
    <svg
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="max-w-[100%] h-[100%] hidden sm:block"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
      ></path>
    </svg>
  );

  const menuBar = (
    <svg
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="max-w-[100%] h-[100%] py-2"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
      ></path>
    </svg>
  );

  const [isOpen, setIsOpen] = useState(false);

  const toggleUserMenu = useCallback(() => {
    setIsOpen((value) => !value);
  });
  return (
    <div
      aria-describedby="user interaction with air-indi world"
      className="justify-self-end flex-grow-0 flex flex-row items-center justify-end"
    >
      <Link
        to=""
        translate="yes"
        onClick={() => {}}
        role="dialoge toggler"
        aria-labelledby="Indi-Home"
        className="font-semibold text-xs w-[fit-content] hover:bg-slate-50 px-4 py-3 rounded-full hidden sm:block cursor-pointer"
      >
        <p id="Indi-Home">Air-indi your home</p>
      </Link>
      <Link
        to=""
        translate="yes"
        onClick={() => {}}
        role="dialoge toggler"
        aria-labelledby="open to globe"
        className="w-10 h-10 hover:bg-slate-100 p-3 rounded-full cursor-pointer hidden sm:block"
      >
        {logoGlobe}
      </Link>
      <Link
        aria-label="open menu"
        aria-checked={isOpen}
        onClick={toggleUserMenu}
        className="
            flex-grow-0
            max-w-fit
            px-3 
            py-1 
            h-10 
            hover:shadow-md hover:cursor-pointer rounded-full border-2 flex items-center justify-center gap-3 ml-2  shadow-sm cursor-pointer
          "
      >
        {user ? (
          <p className="font-medium text-sm">{user.user.name}</p>
        ) : (
          <>
            {menuBar}
            {logoUser}
          </>
        )}
      </Link>
      {isOpen && (
        <div
          className="
                absolute
                z-10
                lg:right-12
                right-5
                top-16
                rounded-xl
                w-[40vw]
                md:w-[180px]
                py-2
                bg-white
                text-sm
                shadow-md
            "
        >
          <MenuItem setIsOpen={setIsOpen} text={"Login"} />
          <MenuItem setIsOpen={setIsOpen} text={"Signup"} />
        </div>
      )}
    </div>
  );
};

export default UserMenu;
