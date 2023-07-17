import { twMerge } from "tailwind-merge";
import { Button } from "../ui";

const Profile = ({ user: profileData }) => {
  return (
    <section
      className={twMerge(
        `flex flex-col justify-center items-center gap-5 sm:grid sm:grid-cols-[minmax(min-content,1fr)_1fr_1fr] sm:max-w-screen-sm lg:max-w-screen-md w-full mx-auto my-10 h-full sm:px-5`
      )}
    >
      <aside
        className="max-w-[18rem] flex flex-col gap-7"
        style={{ gridColumn: "span 1 / 2" }}
      >
        <div
          aria-label="user info Card"
          className="p-5 shadow-[rgba(0,_0,_0,_0.2)_0px_5px_20px] rounded-lg bg-white flex flex-col items-center justify-center gap-3"
        >
          <div
            aria-hidden="true"
            className="rounded-full p-5 text-6xl font-black text-white bg-textColor-950 w-fit m-auto"
          >
            {profileData?.name.charAt(0)}
          </div>
          <div className="text-center">
            <h2 className="font-bold text-textColor-950 text-2xl">
              {profileData?.name}
            </h2>
            <p className="font-light text-textColor-700 text-base">
              {profileData?.role === "USER" ? "Guest" : "Admin"}
            </p>
          </div>
        </div>

        <div className="px-3 py-5 rounded-xl border">
          <div className="pb-4 border-b">
            <h4 className="text-lg font-semibold my-2">
              {profileData?.name}'s confirmed information
            </h4>
            <p className="text-sm font-light ">
              {profileData?.email !== null || profileData?.phone !== null ? (
                <>
                  <span className="inline-block my-2">✅ Email Address</span>
                  <br />
                  <span className="inline-block my-2">✅ Mobile Number</span>
                </>
              ) : (
                <span className="inline-block my-2">✅ Mobile Number</span>
              )}
            </p>
          </div>
          <div className="flex flex-col gap-3 pb-2">
            <h4 className="text-lg font-semibold my-4">Verify your identity</h4>
            <p className="text-xs font-light">
              Before you book or Host on Airbnb, you’ll need to complete this
              step.
            </p>
            <Button
              outline={true}
              label={"Get verified"}
              className={"w-fit px-5 py-2 my-2"}
            />
          </div>
        </div>
      </aside>
      <article
        className="flex items-center justify-center"
        style={{ gridColumn: "span 2 / -1" }}
      >
        <div className="max-w-[15rem] h-max border-t flex flex-col gap-4 m-auto py-5 px-2">
          <h4 className="text-base font-medium">
            It's time to create your profile
          </h4>
          <p className="text-xs font-light">
            Your Airbnb profile is an important part of every reservation.
            Create yours to help other Hosts and guests get to know you.
          </p>
          <Button
            primary={true}
            label={"Create Profile"}
            className={"w-fit px-5"}
          />
        </div>
      </article>
    </section>
  );
};

export default Profile;
