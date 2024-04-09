import { getUser } from "@/controllers/userController";
import HeaderMainClient from "./HeaderMainClient";

const Layout = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const user = await getUser(username);

  if (!user) return null;

  return (
    <div className="flex h-full items-center px-4 py-3">
      <HeaderMainClient />
      <h2 className="ml-6 text-xl font-bold">{user.name}</h2>
    </div>
  );
};

export default Layout;
