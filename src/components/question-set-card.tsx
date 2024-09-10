import {
  getSortedDifficultyCountEntries,
  type Question,
  type QuestionSet,
} from "@/lib/question";
import { QuestionDifficultyCountBadge } from "./question-difficulty-count-badge";
import {
  IconBoxMultiple,
  IconDots,
  IconPencil,
  IconPlayerPlay,
  IconTrash,
} from "@tabler/icons-react";
import { Routes } from "@/lib/routes";
import { Link } from "react-aria-components";
import { IconButton } from "./icon-button";
import { Menu, MenuItem, MenuSeparator } from "./menu";

const Title: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="font-bold grid grid-cols-[auto_1fr] items-start gap-1">
      <IconBoxMultiple className="size-5" />
      <p className="break-all leading-none text-base mt-[2px]">{title}</p>
    </div>
  );
};

const DifficultyCountBadges: React.FC<{
  difficultyCountEntries: [Question["difficulty"], number][];
}> = ({ difficultyCountEntries }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {difficultyCountEntries.map(([difficulty, count]) => {
        return (
          <QuestionDifficultyCountBadge
            key={difficulty}
            difficulty={difficulty}
            count={count}
          />
        );
      })}
    </div>
  );
};

type Props = { questionSet: QuestionSet };

export const QuestionSetCard: React.FC<Props> = ({ questionSet }) => {
  const difficultyCountEntries = getSortedDifficultyCountEntries(questionSet);

  return (
    <div className="grid grid-cols-[1fr,auto] border rounded-lg border-border">
      <div className="flex flex-col gap-4 p-4">
        <Title title={questionSet.title} />
        <DifficultyCountBadges
          difficultyCountEntries={difficultyCountEntries}
        />
      </div>
      <div className="p-2">
        <Menu trigger={<IconButton icon={IconDots} />}>
          <MenuItem icon={IconPencil} label="更新する" />
          <MenuItem icon={IconPlayerPlay} label="挑戦する" />
          <MenuSeparator />
          <MenuItem destructive icon={IconTrash} label="削除する" />
        </Menu>
      </div>
    </div>
  );
};

export const PlayQuestionSetCard: React.FC<Props> = ({ questionSet }) => {
  const difficultyCountEntries = getSortedDifficultyCountEntries(questionSet);

  return (
    <Link
      href={Routes.playQuestionSet({
        id: questionSet.id,
        title: questionSet.title,
        questionIds: questionSet.questions.map((q) => q.id),
      })}
      className="text-start w-full border rounded-lg p-4 grid grid-rows-[1fr_auto] gap-4 shadow-lg transition-colors border-border hover:bg-gray-800 outline-none data-[focus-visible]:ring-2 ring-brand-300"
    >
      <Title title={questionSet.title} />
      <DifficultyCountBadges difficultyCountEntries={difficultyCountEntries} />
    </Link>
  );
};
