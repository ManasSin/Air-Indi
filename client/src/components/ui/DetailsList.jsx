const DetailsList = ({
  label,
  info = null,
  title = undefined,
  onClick = () => {},
}) => {
  return (
    <>
      <div>
        <h3>{title}</h3>
        <p className="font-extralight tracking-wide">
          {info === null ? "Not Provided" : `${info}`}
        </p>
      </div>
      <button onClick={onClick} className="underline font-bold text-base">
        {label}
      </button>
    </>
  );
};

export default DetailsList;
