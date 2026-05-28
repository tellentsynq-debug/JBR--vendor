import { redirect } from "next/navigation";

export default function Home() {
  // Triggers a server-side redirect to the /auth route
  redirect("/auth");
}