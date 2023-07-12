import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const InfoCard = ({
  to = String,
  className,
  title = String,
  bodytext,
  icon: Icon = null,
}) => {
  return (
    <Link
      to={to}
      aria-label={title}
      className={twMerge(
        `flex flex-col w-72 shrink-0 grow p-3 rounded-lg shadow-lg ${className}`
      )}
    >
      <article>
        <div
          aria-label="label-icon"
          className="w-full flex justify-start items-start mb-5"
        >
          {Icon && <div>{Icon}</div>}
        </div>
        <div
          aria-label="article-body"
          className="w-full flex flex-col gap-2 text-left"
        >
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-xs font-light tracking-wide">{bodytext}</p>
        </div>
      </article>
    </Link>
  );
};

export default InfoCard;
