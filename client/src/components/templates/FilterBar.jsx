import React from "react";

const FilterBar = () => {
  const chevronleft = (
    <svg
      width="1.5rem"
      height="1.5rem"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=""
    >
      <path
        d="M12 7.75739L13.4142 9.1716L10.5858 12L13.4142 14.8285L12 16.2427L7.75736 12L12 7.75739Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
        fill="currentColor"
      />
    </svg>
  );
  const chevronRight = (
    <svg
      width="1.5rem"
      height="1.5rem"
      viewBox="0 0 24 24"
      fill="none"
      className=""
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.0858 7.75739L15.3284 12L11.0858 16.2427L9.67157 14.8285L12.5 12L9.67157 9.1716L11.0858 7.75739Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12Z"
        fill="currentColor"
      />
    </svg>
  );
  const array = new Array(60).fill("");
  return (
    <section
      aria-label="filter-section"
      className="flex py-3 overflow-scroll m-auto max-w mt-3"
    >
      <div className="flex justify-center">
        <button>{chevronleft}</button>
      </div>
      <div className="overflow-scroll">
        <div aria-label="filters by types" className="flex gap-5">
          {array.map((a, i) => (
            <figure className="flex flex-col gap-1 items-center" key={i}>
              <div className="w-8 h-8 bg-slate-100 border-0 rounded-md " />
              <figcaption className="font-thin font-mono tracking-tight text-xs">
                letting
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <button>{chevronRight}</button>
      </div>

      <button className="sticky right-0 flex items-center justify-stretch gap-3 px-3 ml-3 rounded-md border">
        <p className="">Filters</p>
      </button>
    </section>
  );
};

export default FilterBar;
