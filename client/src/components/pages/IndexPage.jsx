import { useAuthContext } from "../Hooks";
import { FilterBar } from "../templates";

const IndexPage = () => {
  const { user } = useAuthContext();
  return (
    <main aria-label="layout-body" className="sm:px-5 lg:px-12 px-5 ">
      <FilterBar />
      <div>{user?.name}</div>
    </main>
  );
};

export default IndexPage;
