import { IconCode } from "@tabler/icons-react";
import { Button as RaButton } from "react-aria-components";
import { tv } from "tailwind-variants";
import { Tooltip } from "./tooltip";
import type { Question } from "../lib/question";

const toggle = tv({
  slots: {
    base: "border h-10 grid items-center grid-cols-[auto_1fr_auto] gap-2 rounded-full overflow-hidden transition-colors has-[.toggle[data-focus-visible]]:ring-2 ring-brand-300 outline-none min-w-0",
    toggle:
      "grid grid-cols-[auto_1fr] gap-1 items-center h-full pl-4 toggle cursor-pointer whitespace-nowrap truncate min-w-0 outline-none",
    button:
      "grid place-items-center border rounded-full size-7 data-[hovered]:bg-gray-100/30 transition-colors outline-none data-[focus-visible]:ring-2 ring-brand-300",
    buttonIcon: "size-5",
  },
  variants: {
    isSelected: { true: "", false: "" },
    difficulty: {
      warm: {
        base: "border-teal-600 data-[selected=true]:bg-teal-800 data-[selected=false]:has-[.toggle:hover]:bg-teal-800/50",
      },
      easy: {
        base: "border-lime-600 data-[selected=true]:bg-lime-800 data-[selected=false]:has-[.toggle:hover]:bg-lime-800/50",
      },
      medium: {
        base: "border-yellow-600 data-[selected=true]:bg-yellow-800 data-[selected=false]:has-[.toggle:hover]:bg-yellow-800/50",
      },
      hard: {
        base: "border-red-600 data-[selected=true]:bg-red-800 data-[selected=false]:has-[.toggle:hover]:bg-red-800/50",
      },
      extreme: {
        base: "border-purple-600 data-[selected=true]:bg-purple-800 data-[selected=false]:has-[.toggle:hover]:bg-purple-800/50",
      },
    } satisfies Record<Question["difficulty"], unknown>,
  },
});

type Props = {
  question: Question;
  isSelected: boolean;
  onChange: (selected: boolean) => void;
  onShowCode: () => void;
};

export const QuestionWithCodeToggle: React.FC<Props> = ({
  question,
  isSelected,
  onChange,
  onShowCode,
}) => {
  const classes = toggle({ isSelected, difficulty: question.difficulty });

  const handleToggle = () => {
    onChange(!isSelected);
  };

  const handleShowCode = () => {
    onShowCode();
  };

  return (
    <div className={classes.base()} data-selected={isSelected}>
      <RaButton className={classes.toggle()} onPress={handleToggle}>
        {question.title}
      </RaButton>
      <Tooltip label="コードを表示する" closeDelay={0}>
        <RaButton className={classes.button()} onPress={handleShowCode}>
          <IconCode className={classes.buttonIcon()} />
        </RaButton>
      </Tooltip>
    </div>
  );
};
