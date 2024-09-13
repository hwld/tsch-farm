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
  IconStar,
  IconTrash,
} from "@tabler/icons-react";
import { Routes } from "@/lib/routes";
import { Button, Link } from "react-aria-components";
import { IconButton } from "./icon-button";
import { Menu, MenuItem, MenuSeparator } from "./menu";
import { useQuestionSets } from "./use-question-sets";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tooltip } from "./tooltip";
import clsx from "clsx";

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
  const isEditable = !questionSet.isBuildIn;

  const difficultyCountEntries = getSortedDifficultyCountEntries(questionSet);
  const { removeQuestionSet, updateQuestionSet } = useQuestionSets();

  const router = useRouter();

  const handlePlay = () => {
    router.push(Routes.playQuestionSet(questionSet));
  };

  const handleUpdate = () => {
    router.push(Routes.updateQuestionSet(questionSet.id));
  };

  const handleRemove = () => {
    if (!isEditable) {
      return;
    }

    try {
      removeQuestionSet(questionSet.id);
    } catch (e) {
      toast.error("問題セットを削除できませんでした");
      throw e;
    }
  };

  const handleTogglePinned = () => {
    try {
      updateQuestionSet({
        id: questionSet.id,
        title: questionSet.title,
        questionIds: questionSet.questions.map((q) => ({ value: q.id })),
        isPinned: !questionSet.isPinned,
      });
    } catch (e) {
      toast("問題セットをピン留めすることができませんでした");
      throw e;
    }
  };

  return (
    <div className="grid grid-cols-[1fr,auto] border rounded-lg border-border">
      <div className="grid grid-rows-[auto_1fr] gap-4 p-4 items-end">
        <Title title={questionSet.title} />
        <DifficultyCountBadges
          difficultyCountEntries={difficultyCountEntries}
        />
      </div>
      <div className="p-2 grid grid-rows-[auto_1fr] gap-4 place-items-end">
        <Menu trigger={<IconButton icon={IconDots} />}>
          {isEditable && (
            <MenuItem
              icon={IconPencil}
              label="更新する"
              onAction={handleUpdate}
            />
          )}
          <MenuItem
            icon={IconPlayerPlay}
            label="挑戦する"
            onAction={handlePlay}
          />
          {isEditable && (
            <>
              <MenuSeparator />
              <MenuItem
                destructive
                icon={IconTrash}
                label="削除する"
                onAction={handleRemove}
              />
            </>
          )}
        </Menu>
        <Tooltip
          label={
            questionSet.isPinned
              ? "ホーム画面に表示させない"
              : "ホーム画面に表示させる"
          }
        >
          <Button
            onPress={handleTogglePinned}
            className={clsx(
              "border border-border rounded-full transition-all grid place-items-center  group size-10 outline-none data-[focus-visible]:ring-2 ring-brand-300",
              questionSet.isPinned
                ? "bg-brand-500/30 data-[hovered]:bg-brand-500/15"
                : "data-[hovered]:bg-brand-500/20"
            )}
          >
            <IconStar
              className={clsx(
                "transition-all",
                questionSet.isPinned
                  ? "fill-brand-400 stroke-brand-400"
                  : "stroke-gray-300 group-data-[hovered]:stroke-brand-300"
              )}
            />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export const PlayQuestionSetCard: React.FC<Props> = ({ questionSet }) => {
  const difficultyCountEntries = getSortedDifficultyCountEntries(questionSet);

  return (
    <Link
      href={Routes.playQuestionSet(questionSet)}
      className="text-start w-full border rounded-lg p-4 grid grid-rows-[1fr_auto] gap-4 shadow-lg transition-colors border-border hover:bg-gray-800 outline-none data-[focus-visible]:ring-2 ring-brand-300"
    >
      <Title title={questionSet.title} />
      <DifficultyCountBadges difficultyCountEntries={difficultyCountEntries} />
    </Link>
  );
};
