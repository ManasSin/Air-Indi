import { Link } from "react-router-dom";

const DetailsList = ({ info, title = undefined }) => {
  return (
    <div className="flex justify-between items-center border-b py-6 px-1">
      <div>
        <h3>{title}</h3>
        <p className="font-extralight tracking-wide">
          {info === undefined ? "Not Provided" : info}
        </p>
      </div>
      <div>
        <Link className="underline font-bold text-base">Edit</Link>
      </div>
    </div>
  );
};

export default DetailsList;
