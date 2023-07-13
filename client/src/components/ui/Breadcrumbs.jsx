import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();

  // get the pathname from location
  // 1st split the url by / symbol
  // 2nd trim the last bank space
  // make trailing link to move to pages visited
  // store them into a variable

  const chevronLeft = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-textColor-600 h-4"
    >
      <path
        d="M10.5858 6.34317L12 4.92896L19.0711 12L12 19.0711L10.5858 17.6569L16.2427 12L10.5858 6.34317Z"
        fill="currentColor"
      />
    </svg>
  );

  let locationVisited = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumbs) => crumbs !== "")
    .map((crumbs) => {
      locationVisited = `/${crumbs}`;

      return (
        <div
          key={crumbs}
          className="flex gap-4 items-center justify-start w-fit"
        >
          <Link to={locationVisited} className="font-medium text-sm">
            {crumbs.charAt(0).toUpperCase()}
            {crumbs.slice(1)}
          </Link>
          <div>{chevronLeft}</div>
        </div>
      );
    });

  return <div className="flex items-center justify-start gap-4">{crumbs}</div>;
};

export default Breadcrumbs;
