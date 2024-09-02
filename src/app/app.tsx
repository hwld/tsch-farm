"use client";
import { Editor, Monaco } from "@monaco-editor/react";
import type { Question } from "./page";
import { useEffect, useRef } from "react";
import type { editor } from "monaco-editor";
import { Button } from "@/components/ui/button";

type Props = { questions: Question[] };

export const App: React.FC<Props> = ({ questions }) => {
  const ref = useRef<editor.IStandaloneCodeEditor | null>(null);

  return (
    <div className="grid h-full grid-cols-[auto_1fr] gap-4 p-10 min-h-0">
      <Editor
        width={800}
        height={800}
        language="typescript"
        theme="vs-dark"
        onMount={(e) => {
          ref.current = e;
        }}
      />
      <div className="grid gap-2 grid-cols-2 place-content-start overflow-auto">
        {questions.map((question) => {
          return (
            <Button
              variant="secondary"
              size="lg"
              key={question.id}
              onClick={() => {
                ref.current?.setValue(
                  questions.find((q) => q.id === question.id)!.code
                );
              }}
            >
              {question.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
