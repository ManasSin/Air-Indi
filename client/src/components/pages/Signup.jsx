import React from "react";
import { Button } from "../ui";

const Signup = () => {
  const closeIcon = (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
        fill="currentColor"
      />
    </svg>
  );
  return (
    <main className="sm:px-5 lg:px-12 px-5 flex items-center justify-center flex-grow">
      <article className="grid grid-rows-[minmax(min-content,auto)_1fr] grid-col-1 max-w-md w-full -translate-y-1/4 max-h-fit border rounded-xl">
        <header className="flex items-center justify-center border-b px-3 py-4 h-fit">
          <Button
            outline={true}
            icon={closeIcon}
            onClick={() => {}}
            small={true}
            secondary={true}
          />
          <h3 className="flex-grow flex items-center justify-center font-semibold text-base tracking-wide">
            Log in or Sign up
          </h3>
        </header>
        <main className="flex flex-col gap-4 w-full min-h-fit px-5 py-6">
          <p className="font-semibold text-xl mt-4">Register with us</p>
          <div className="flex gap-3 flex-col">
            <label htmlFor="email" className="text-xs font-medium -mb-2">
              Your Name
            </label>
            <input
              id="email"
              type="email"
              placeholder="Singh sha"
              className="placeholder:font-light placeholder:text-sm w-full py-1 border px-3 rounded-md"
            />
            <label htmlFor="email" className="text-xs font-medium -mb-2">
              Enter Your Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="placeholder:font-light placeholder:text-sm w-full py-1 border px-3 rounded-md"
            />
            <label htmlFor="password" className="text-xs font-medium -mb-2">
              Enter Your Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="password"
              className="placeholder:font-light placeholder:text-sm w-full py-1 border px-3 rounded-md"
            />
            <label htmlFor="phone" className="text-xs font-medium -mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="off"
              placeholder="Phone Number"
              className="placeholder:font-light placeholder:text-sm w-full py-1 border px-3 rounded-md"
            />
          </div>
          <p className="font-thin text-xs tracking-normal">
            * Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Necessitatibus rem repudiandae sit
          </p>
          <Button onClick={() => {}} icon={false} label={"Continue"} />
        </main>
      </article>
    </main>
  );
};

export default Signup;
