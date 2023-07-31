import { Breadcrumbs } from "../ui";
import { useAuthContext } from "../Hooks";
import { EditFrom } from "../templates";

const PersonalInfo = () => {
  const { user2: user } = useAuthContext();
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
        <EditFrom
          inputType={"text"}
          title={"Legal name"}
          data={"name"}
          info={user?.name}
        />
        <EditFrom
          inputType={"email"}
          title={"Email address"}
          data={"email"}
          info={user?.email}
        />
        <EditFrom
          inputType={"tel"}
          title={"Phone Numbers"}
          data={"phone"}
          info={
            user?.phone
              ? user?.phone
              : `Add a number confirmed guests and Airbnb can get in touch. You can add other numbers and choose how they’re used.`
          }
        />
        <EditFrom
          inputType={"text"}
          title={"Address"}
          data={"address"}
          info={user?.address}
        />
        <EditFrom
          inputType={"tel"}
          data={"emergencyContact"}
          title={"Emergency Contact"}
          info={user?.emergencyNum}
        />
      </main>
    </section>
  );
};
export default PersonalInfo;
