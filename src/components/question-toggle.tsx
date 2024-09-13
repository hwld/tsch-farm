import type { Question } from "@/lib/question";
import { tv } from "tailwind-variants";
import { IconCode } from "@tabler/icons-react";

const button = tv({
  base: "border rounded-full px-3 min-h-7 transition-colors grid grid-cols-[auto_1fr] items-center justify-items-start gap-1 text-start",
  variants: {
    difficulty: {
      warm: "border-teal-600 hover:bg-teal-800/50 data-[selected=true]:bg-teal-800",
      easy: "border-lime-600 hover:bg-lime-800/50 data-[selected=true]:bg-lime-800",
      medium:
        "border-yellow-600 hover:bg-yellow-800/50 data-[selected=true]:bg-yellow-800",
      hard: "border-red-600 hover:bg-red-800/50 data-[selected=true]:bg-red-800",
      extreme:
        "border-purple-600  hover:bg-purple-800/50 data-[selected=true]:bg-purple-800",
    } satisfies Record<Question["difficulty"], unknown>,
  },
});

type Props = {
  question: Question;
  isSelected: boolean;
  onChange: (value: boolean) => void;
};

export const QuestionToggle: React.FC<Props> = ({
  question,
  isSelected,
  onChange,
}) => {
  const handleClick = () => {
    onChange(!isSelected);
  };

  return (
    <button
      className={button({ difficulty: question.difficulty })}
      data-selected={isSelected}
      onClick={handleClick}
    >
      <IconCode size={16} />
      {question.title}
    </button>
  );
};
