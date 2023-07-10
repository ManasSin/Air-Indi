import React, { useState } from "react";
import { Button } from "../ui";
import { Link } from "react-router-dom";
import { InputField } from "../ui";
import { useLogin } from "../Hooks/useLogin";

const Login = () => {
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
    phone: "",
  });
  const [redirect, setRedirect] = useState(false);
  const { login, isloading, error } = useLogin();

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(credentials);
  };
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
      <article className="grid grid-rows-[minmax(min-content,auto)] grid-col-1 max-w-md w-full -translate-y-1/4 max-h-fit border rounded-xl">
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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full min-h-fit px-5 py-6"
        >
          <p className="font-semibold text-xl mt-4">Welcome to Airbnb</p>
          <div className="flex gap-3 flex-col">
            <InputField
              label={"Enter Your Email"}
              placeholder={"you@example.com"}
              name={"email"}
              type={"email"}
              state={credentials.email}
              onChange={handleChange}
            />
            <InputField
              label={"Enter Your Password"}
              // placeholder={"Password"}
              name={"password"}
              type={"text"}
              state={credentials.password}
              onChange={handleChange}
            />
            <InputField
              label={"Enter Your Phone Number"}
              placeholder={"Phone Number"}
              name={"phone"}
              type={"tel"}
              state={credentials.phone}
              onChange={handleChange}
            />
          </div>
          <p className="font-thin text-xs tracking-normal">
            * Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Necessitatibus rem repudiandae sit
          </p>
          <Button
            disabled={isloading}
            type={"submit"}
            icon={false}
            label={"Continue"}
          />
        </form>
        <div className="px-5 py-4 flex items-center justify-center border-t">
          <p className="text-sm font-semibold tracking-wide">
            Don't have an account?{" "}
            <span>
              <Link
                className="hover:underline hover:text-rose-600"
                to="/signup"
              >
                Sign up
              </Link>
            </span>
          </p>
        </div>
      </article>
    </main>
  );
};

export default Login;
