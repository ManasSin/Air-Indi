const Search = () => {
  const searchLogo = (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-[100%] h-[100%]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      ></path>
    </svg>
  );
  return (
    <div
      aria-modal="true"
      aria-label="search group"
      className="flex p-1 border-2 rounded-3xl items-center sm:w-[min(100%, 220px)] sm:justify-self-center justify-between shadow-md shadow-stone-500/5"
    >
      <button
        onClick={() => {
          // openInputModal;
        }}
        className="text-xs font-medium border-r-2 px-4 truncate shrink basis-auto hidden sm:block"
      >
        Anywhere
      </button>
      <button
        onClick={() => {
          // openInputModal;
        }}
        className="text-xs font-medium border-r-2 px-4 truncate shrink basis-auto hidden sm:block"
      >
        Any week
      </button>

      <button
        onClick={() => {
          // openInputModal;
        }}
        className="text-xs font-light px-4 truncate shrink basis-auto hidden sm:block"
      >
        Add guest
      </button>
      <button
        role="search-btn"
        aria-label="search button"
        onClick={() => {}}
        className="w-8 h-8 p-2 bg-red-500 rounded-full text-white"
      >
        {searchLogo}
      </button>
    </div>
  );
};

export default Search;
