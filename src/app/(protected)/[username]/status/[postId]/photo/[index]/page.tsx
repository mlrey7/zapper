import { redirect } from "next/navigation";

const Page = ({
  params: { postId, username },
}: {
  params: { username: string; postId: string; index: string };
}) => {
  redirect(`/${username}/status/${postId}`);

  return null;
};

export default Page;
