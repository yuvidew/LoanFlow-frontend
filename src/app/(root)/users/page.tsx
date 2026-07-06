import UsersView from "@/features/users/_components/users-view";
import { requireAuth } from "@/lib/auth-utils";

const UsersPage = async () => {
  await requireAuth();
  return <UsersView />;
};

export default UsersPage;
