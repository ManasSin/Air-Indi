import React, { useState } from "react";
import { Button } from "../ui";
import { Link, Navigate } from "react-router-dom";
import { InputField } from "../ui";
import { useLogin } from "../Hooks";
import { closeIcon } from "../../utils/icons";

const Login = () => {
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
    phone: "",
  });
  const [redirect, setRedirect] = useState(false);
  const { login, isloading, error, userin } = useLogin();

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(credentials);
  };

  if (userin) {
    return <Navigate to={"/"} />;
  }

  return (
    <main className="sm:px-5 lg:px-12 px-5 flex items-center justify-center flex-grow">
      <article className="grid grid-rows-[minmax(min-content,auto)] grid-col-1 max-w-md w-full -translate-y-1/4 max-h-fit border rounded-xl">
        <header className="flex items-center justify-center border-b px-3 py-4 h-fit">
          <div className="w-7">
            <Button
              // outline={true}
              icon={closeIcon}
              onClick={() => {}}
              small={true}
              // secondary={true}
            />
          </div>
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
          <Button primary={true} type={"submit"} label={"Continue"} />
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
