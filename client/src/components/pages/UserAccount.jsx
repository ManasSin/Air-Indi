import { Link } from "react-router-dom";
import { useAuthContext } from "../Hooks/userAuth";
import { Button } from "../ui";
import InfoCard from "../ui/InfoCard";

const UserAccount = () => {
  const { user } = useAuthContext();
  const InfoIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      ariaHidden="true"
      role="presentation"
      focusable="false"
      style={{
        display: "block",
        height: "32px",
        width: "32px",
        fill: "currentcolor",
      }}
    >
      <path d="M29 5a2 2 0 0 1 2 1.85V25a2 2 0 0 1-1.85 2H3a2 2 0 0 1-2-1.85V7a2 2 0 0 1 1.85-2H3zm0 2H3v18h26zm-3 12v2h-8v-2zm-16-8a3 3 0 0 1 2.5 4.67A5 5 0 0 1 15 20h-2a3 3 0 0 0-2-2.83V14a1 1 0 0 0-2-.12v3.29A3 3 0 0 0 7 20H5a5 5 0 0 1 2.5-4.33A3 3 0 0 1 10 11zm16 4v2h-8v-2zm0-4v2h-8v-2z"></path>
    </svg>
  );
  return (
    <section
      aria-label="Account details page"
      className="sm:px-5 lg:px-12 px-5 mx-auto my-10 max-w-screen-lg tablet:max-w-screen-lg w-full"
    >
      <header className="flex flex-col gap-1 py-5 px-3">
        <h1 className="font-bold text-2xl tracking-wider">Account</h1>
        <div className="flex justify-start items-center">
          <p aria-label="account holder name" className="font-medium text-base">
            {user.user.name},{" "}
            <span className="font-light pr-2">{user.user.email} . </span>
          </p>
          <Link to={"/user/profile"}>
            <Button
              label={" Go to Profile"}
              secondary={true}
              className={"underline inline-flex font-semibold"}
            />
          </Link>
        </div>
      </header>

      <main className="flex flex-wrap gap-6 justify-start items-start my-5 text-slate-800 tracking-wide">
        <InfoCard
          to={"/personal-info"}
          icon={InfoIcon}
          title={"Personal Info"}
          bodytext={"Provide personal details and how we can reach you"}
        />
        <InfoCard
          to={"/login secrity"}
          icon={InfoIcon}
          title={"Login % security"}
          bodytext={"Update your password and secure your account"}
        />

        <InfoCard
          to={"/payments"}
          icon={InfoIcon}
          title={"Payments & payouts"}
          bodytext={"Review payments, payouts, coupons and gift cards"}
        />
      </main>
    </section>
  );
};

export default UserAccount;
