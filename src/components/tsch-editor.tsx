import type { Question } from "@/lib/question";
import { Editor, type EditorProps, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useEffect, useRef } from "react";

type Props = { question: Question };

export const TschEditor: React.FC<Props> = ({ question }) => {
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

  useEffect(() => {
    return () => {
      if (!monacoRef.current) {
        return;
      }
      monacoRef.current.editor.getModels().forEach((m) => m.dispose());
    };
  }, []);

  return (
    <Editor
      path={`file:///${question.title}.ts`}
      width="100%"
      height="100%"
      language="typescript"
      theme="vs-dark"
      className="border border-border rounded overflow-hidden"
      onMount={handleMount}
      defaultValue={question.code}
    />
  );
};
