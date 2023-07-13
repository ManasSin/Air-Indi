import React from "react";
import { Breadcrumbs } from "../ui";
import { useAuthContext } from "../Hooks";
import DetailsList from "../ui/DetailsList";

const PersonalInfo = () => {
  const { user } = useAuthContext();
  return (
    <section
      aria-label="Account details page"
      className="sm:px-5 lg:px-12 px-5 mx-auto my-10 lg:max-w-screen-lg tablet:max-w-screen-md max-w-screen-sm   w-full"
    >
      <header className="flex flex-col gap-1 py-5 px-3">
        <Breadcrumbs />
        <h1 className="font-bold text-2xl tracking-wider">Personal Info</h1>
      </header>

      <main className="sm:px-3 px-5">
        <DetailsList title={"Legal name"} info={user.name} />
        <DetailsList title={"Email address"} info={user.email} />
        <DetailsList
          title={"Phone Numbers"}
          info={
            user.phone
              ? user.phone
              : `Add a number confirmed guests and Airbnb can get in touch. You can add other numbers and choose how they’re used.`
          }
        />
        <DetailsList title={"Address"} info={user.address} />
        <DetailsList title={"Emergency Contact"} info={user.emergencyNum} />
      </main>
    </section>
  );
};
export default PersonalInfo;
