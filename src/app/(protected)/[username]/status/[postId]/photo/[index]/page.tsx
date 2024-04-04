import { redirect } from "next/navigation";

const Page = ({ username, postId }: { username: string; postId: string }) => {
  redirect(`/${username}/status/${postId}`);
};

export default Page;
