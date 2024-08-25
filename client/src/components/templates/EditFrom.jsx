import { useState } from "react";
import DetailsList from "../ui/DetailsList";
import { Button, InputField } from "../ui";
import { useAuthContext, userUpdate } from "../Hooks";
import { useRevalidator } from "react-router-dom";

const EditFrom = ({
  title = String,
  info,
  inputType = String,
  data: dataToChange = String,
  id,
}) => {
  const { updateUser, isLoading, error, setIsLoading } = userUpdate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [credentials, setCredentials] = useState({});

  const { user } = useAuthContext();

  const changeData = (e) => {
    setCredentials({ ...credentials, [dataToChange]: e.target.value });
    // setCredentials((value) => e.target.value);
  };

  const ToggleEditModal = (component) => {
    setIsModalOpen((open) => !open);
    // textRef.current = component;

    // if (textRef.current) {
    //   const otherComp = document.querySelectorAll(`[aria-busy=\"false\"]`);
    //   console.log(otherComp, textRef);
    //   otherComp.forEach((component) => {
    //     const btn = component.innerHTML.match("button");
    //     console.log(btn);
    //     btn.disabled = true;
    //   });
    // }
  };

  const HandleUpdateForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await updateUser(user._id, credentials);
    setIsLoading(false);
  };
  // if (updateUser) setIsLoading(false);

  return (
    <div aria-busy={isModalOpen} className="flex flex-col gap-2 border-b">
      <div className="flex justify-between items-center py-6 px-1">
        <DetailsList
          onClick={ToggleEditModal}
          isOpen={isModalOpen}
          title={title}
          info={user[dataToChange]}
          label={isModalOpen ? "Cancel" : "Edit"}
        />
      </div>
      {isModalOpen ? (
        <form
          onSubmit={HandleUpdateForm}
          className="pb-6 flex flex-col gap-3 px-4"
        >
          <InputField
            name={dataToChange}
            type={inputType}
            placeholder={title}
            onChange={changeData}
            value={credentials}
            label={`Enter ${dataToChange} here`}
            focus={true}
          />
          <Button
            primary={true}
            className={"bg-black text-white w-fit px-5"}
            label={"Save"}
          />
        </form>
      ) : null}
    </div>
  );
};

export default EditFrom;
