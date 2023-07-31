import React from "react";
import { Breadcrumbs, Button } from "../ui";
import DetailsList from "../ui/DetailsList";
import { useAuthContext } from "../Hooks";

const PaymentsPayment = () => {
  const { user } = useAuthContext();

  return (
    <section
      aria-label="Account details page"
      className="sm:px-5 lg:px-12 px-5 mx-auto my-10 lg:max-w-screen-lg tablet:max-w-screen-md max-w-screen-sm   w-full"
    >
      <header className="flex flex-col gap-1 py-5 px-3">
        <Breadcrumbs />
        <h1 className="font-bold text-2xl tracking-wider">Payment & payouts</h1>
      </header>

      <main className="sm:px-3 px-5 my-6 ">
        <div className="max-w-[200px] mx-auto my-10">
          <Button
            label={"Link to RajorPay"}
            primary={true}
            onClick={() => {}}
          />
        </div>
      </main>
    </section>
  );
};

export default PaymentsPayment;
