import { Home } from "@/components/home";
import { getQuestions } from "@/lib/question";

export default async function Page() {
  const questions = await getQuestions();

  return (
    <div className="grid place-items-center min-h-0">
      <Home questions={questions} />
    </div>
  );
}
