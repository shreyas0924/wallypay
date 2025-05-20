import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { Signin } from "../../components/signin";

const SigninPage = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Signin />
    </div>
  );
};

export default SigninPage;
