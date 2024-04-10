import { getUserMediaPosts } from "@/controllers/postController";
import { getUser } from "@/controllers/userController";
import { PostContentType } from "@/lib/validators/post";
import Link from "next/link";
import Image from "next/image";

const Page = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const user = await getUser(username);
  if (!user) return null;

  const posts = (await getUserMediaPosts(user.id)).map((post) => {
    return {
      ...post,
      author: {
        image: user.image,
        name: user.name,
        username: user.username,
      },
    };
  });

  const flattenedPosts = posts.flatMap((post) => {
    return (post.content as PostContentType).images.map((image, index) => {
      return {
        image,
        index,
        id: post.id,
      };
    });
  });

  return (
    <div className="grid grid-cols-3 gap-1 p-1">
      {...flattenedPosts.map((post, totalIndex) => {
        return (
          <Link
            href={`/${username}/status/${post.id}/photo/${post.index + 1}`}
            key={post.id + post.image + post.index}
          >
            <Image
              src={post.image}
              alt={`Post image ${totalIndex}`}
              width={0}
              height={0}
              className={"aspect-square w-full object-cover"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              key={post.id + post.image + post.index}
            ></Image>
          </Link>
        );
      })}
    </div>
  );
};

export default Page;
