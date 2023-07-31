import { useCallback, useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";
import { Link } from "react-router-dom";
import { useLogout } from "../Hooks";
import Button from "./Button";
import { twMerge } from "tailwind-merge";
import { menuBar, logoGlobe, logoUser } from "../../utils/icons";
import useRegisterModal from "../Hooks/useRegisterModal";

const UserMenu = ({ user }) => {
  const registerModal = useRegisterModal();

  const { logout } = useLogout();

  const ref = useRef();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleUserMenu = useCallback(() => {
    setIsMenuOpen((value) => !value);
  });

  useEffect(() => {
    const checkIfClickOutside = (e) => {
      if (isMenuOpen && ref.current && !ref.current.contains(e.target)) {
        // console.log("working");
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickOutside);

    return () => {
      document.addEventListener("mousedown", checkIfClickOutside);
    };
  }, [isMenuOpen]);

  const LogoutUser = () => {
    logout();
    setIsMenuOpen(false);
  };

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
        aria-checked={isMenuOpen}
        onClick={toggleUserMenu}
        className={twMerge(`
            flex-grow-0
            max-w-fit
            px-3 
            py-1 
            h-10 
            hover:shadow-md hover:cursor-pointer rounded-full border-2 flex items-center justify-center gap-3 ml-2  shadow-sm cursor-pointer`)}
      >
        {user ? (
          <div className="flex items-center justify-center">
            <div className="h-9 mr-2 p-1">{menuBar}</div>
            <div className="font-medium text-xs py-1 px-1.5 bg-slate-900 text-white rounded-full">
              {user ? user?.name.charAt(0) : <div>{logoUser}</div>}
            </div>
          </div>
        ) : (
          <>
            {menuBar}
            {logoUser}
          </>
        )}
      </Link>
      {isMenuOpen && (
        <div
          ref={ref}
          className="
                absolute
                z-10
                lg:right-12
                right-5
                top-16
                rounded-xl
                w-[170px]
                md:w-[180px]
                bg-white
                shadow-[rgba(0,_0,_0,_0.2)_0px_5px_20px]
            "
        >
          {user ? (
            <>
              <div className="py-2 border-b">
                <MenuItem setIsOpen={setIsMenuOpen} text={"Trips"} />
                <MenuItem
                  setIsOpen={setIsMenuOpen}
                  text={"messages"}
                  to={"guest/inbox"}
                />
              </div>
              <div className="py-2 border-b">
                <MenuItem
                  setIsOpen={setIsMenuOpen}
                  text={"account"}
                  className={"font-extralight tracking-wider text-xs"}
                />
                <MenuItem
                  setIsOpen={setIsMenuOpen}
                  text={"airbnb your home"}
                  to={"host/home"}
                  className={"font-extralight tracking-wider text-xs"}
                />
              </div>
              <div className="py-2 border-b">
                <MenuItem
                  setIsOpen={setIsMenuOpen}
                  text={"Help"}
                  className={"font-extralight tracking-wider text-xs"}
                />
              </div>
              <div className="py-2 border-b">
                <Button
                  label={"Log out"}
                  onClick={LogoutUser}
                  secondary={true}
                  className={"text-xs underline"}
                />
              </div>
            </>
          ) : (
            <>
              <MenuItem setIsOpen={setIsMenuOpen} text={"Login"} />
              <MenuItem setIsOpen={setIsMenuOpen} text={"Signup"} />
              <Button onClick={registerModal.onOpen} label={"open Modal"} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
