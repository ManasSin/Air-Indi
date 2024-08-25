import { useSignup } from "../Hooks";
import { useForm } from "react-hook-form";
import { Modal } from "../templates";
import useRegisterModal from "../Hooks/useRegisterModal";
import { Button, InputField } from "../ui";
import { useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

const RegisterModal = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const { signup, error, isLoading, userin } = useSignup();

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setCredentials({ ...credentials, [name]: value });
  };
  const registerModal = useRegisterModal();
  console.log(registerModal);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (credentials) => {
    await signup(credentials);

    if (isLoading) registerModal.onClose();
  };

  const bodyContent = (
    <div className="flex flex-col gap-4 w-full min-h-fit px-5 py-2">
      <p className="font-semibold text-xl my-3">Register with us</p>
      <div className="flex gap-3 flex-col">
        <InputField
          name={"name"}
          label={"Enter your Name"}
          placeholder={"Sha Singh"}
          onChange={handleChange}
          state={credentials.name}
          type={"text"}
        />
        <InputField
          name={"email"}
          label={"Enter your Email"}
          placeholder={"you@example.com"}
          onChange={handleChange}
          state={credentials.email}
          type={"email"}
        />
        <InputField
          name={"password"}
          label={"Create your Password"}
          placeholder={"*************"}
          onChange={handleChange}
          state={credentials.password}
          type={"text"}
        />
        <InputField
          name={"phone"}
          label={"Enter your Phone"}
          placeholder={"Phone number"}
          onChange={handleChange}
          state={credentials.phone}
          type={"tel"}
        />
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => {}}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => {}}
      />
      <div
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>
          Already have an account?
          <span
            // onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Log in
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title={"Register"}
      actionLabel={"Continue"}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
