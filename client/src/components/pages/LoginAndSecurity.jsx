import { useEffect } from "react";
import { useAuthContext } from "../Hooks";
import { Breadcrumbs } from "../ui";
import DetailsList from "../ui/DetailsList";
import { EditFrom } from "../templates";

const LoginAndSecurity = () => {
  useEffect(() => {
    const getDeviceAndIp = async () => {};
    // getDeviceAndIp();
  }, []);

  const { user } = useAuthContext();
  console.log(user);
  return (
    <section
      aria-label="Account details page"
      className="sm:px-5 lg:px-12 px-5 mx-auto my-10 lg:max-w-screen-lg tablet:max-w-screen-md max-w-screen-sm   w-full"
    >
      <header className="flex flex-col gap-1 py-5 px-3">
        <Breadcrumbs />
        <h1 className="font-bold text-2xl tracking-wider">Login & security</h1>
      </header>

      <main className="sm:px-3 px-5 my-6 border-t">
        <div className="flex flex-col gap-6">
          <h2 className="my-6 font-semibold text-lg ">Login</h2>
          {/* <DetailsList title={"Legal name"} info={user.name} /> */}
          <EditFrom
            inputType={"text"}
            title={"Legal name"}
            data={"name"}
            info={user.name}
            id={user._id}
          />
          <EditFrom
            inputType={"email"}
            title={"Email address"}
            data={"email"}
            info={user.email}
            id={user._id}
          />
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="my-6 font-semibold text-lg ">Device History</h2>
          <EditFrom
            inputType={"email"}
            title={"Email address"}
            data={"email"}
            info={user.email}
            id={user._id}
          />
          {/* //todo : get user device info from a api cal.*/}
        </div>
      </main>
    </section>
  );
};

export default LoginAndSecurity;
