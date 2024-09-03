"use client";
import { Editor, Monaco, type EditorProps } from "@monaco-editor/react";
import { useRef } from "react";
import type { editor } from "monaco-editor";
import type { Question } from "@/lib/question";

type Props = { questions: Question[] };

export const App: React.FC<Props> = ({ questions }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleMount: EditorProps["onMount"] = async (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
    });

    const moduleName = "@type-challenges/utils";

    const res = await fetch(`https://esm.sh/${moduleName}`);
    const typeDefUrl = res.headers.get("x-typescript-types");
    if (!typeDefUrl) {
      return;
    }

    const typeDef = await (await fetch(typeDefUrl)).text();

    monaco.editor.createModel(
      typeDef,
      "typescript",
      monaco.Uri.parse(`file:///node_modules/${moduleName}/index.d.ts`)
    );
  };

  return (
    <div className="grid h-full grid-cols-[auto_1fr] gap-4 p-10 min-h-0">
      <Editor
        path="file:///tsch.ts"
        width={800}
        height={800}
        language="typescript"
        theme="vs-dark"
        onMount={handleMount}
      />
      <div className="grid gap-2 grid-cols-2 place-content-start overflow-auto">
        {questions.map((question) => {
          return (
            <button
              key={question.id}
              onClick={() => {
                editorRef.current?.setValue(
                  questions.find((q) => q.id === question.id)!.code
                );
              }}
            >
              {question.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};
