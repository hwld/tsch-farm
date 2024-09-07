import type { Question } from "@/lib/question";
import { tv } from "tailwind-variants";

const badge = tv({
  base: "rounded overflow-hidden h-5 flex items-center border text-xs",
  slots: {
    difficulty: "px-2 h-full flex items-center",
    count: "px-2 h-full flex items-center",
  },
  variants: {
    difficulty: {
      warm: { base: "border-teal-600", count: "bg-teal-900" },
      easy: { base: "border-lime-600", count: "bg-lime-900" },
      medium: { base: "border-yellow-600", count: "bg-yellow-900" },
      hard: { base: "border-red-600", count: "bg-red-900" },
      extreme: { base: "border-purple-600", count: "bg-purple-900" },
    } satisfies Record<Question["difficulty"], unknown>,
  },
});

type Props = { difficulty: Question["difficulty"]; count: number };

export const QuestionDifficultyCountBadge: React.FC<Props> = ({
  difficulty,
  count,
}) => {
  const classes = badge({ difficulty });

  return (
    <div className={classes.base()}>
      <div className={classes.difficulty()}>{difficulty}</div>
      <div className={classes.count()}>{count}</div>
    </div>
  );
};
