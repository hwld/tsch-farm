import type { Question } from "@/lib/question";
import { Editor, type EditorProps, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useEffect, useRef } from "react";
import { useTypeDefs } from "./providers";
import { IconCode, IconLoader2 } from "@tabler/icons-react";

type Props = { question: Question };

export const TschEditor: React.FC<Props> = ({ question }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const typeDefs = useTypeDefs();

  const handleMount: EditorProps["onMount"] = async (editor, monaco) => {
    // typeDefsがundefinedのときにhandleMountが実行されないように、条件分岐でレンダリングさせる必要がある
    if (!typeDefs) {
      return;
    }

    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
    });

    Array.from(typeDefs.entries()).forEach(([moduleName, typeDef]) => {
      monaco.editor.createModel(
        typeDef,
        "typescript",
        monaco.Uri.parse(`file:///node_modules/${moduleName}/index.d.ts`)
      );
    });
  };

  useEffect(() => {
    return () => {
      if (!monacoRef.current) {
        return;
      }

      monacoRef.current.editor.getModels().forEach((m) => {
        m.dispose();
      });
    };
  }, []);

  return (
    <div className="size-full bg-[#1e1e1e] border-border border rounded-lg overflow-hidden grid grid-rows-[min-content_1fr]">
      <div className="p-2 text-xs flex gap-1 items-center bg-gray-900">
        <IconCode className="size-4" />
        Code
      </div>
      {typeDefs && (
        <Editor
          options={{ automaticLayout: true }}
          path={`file:///${question.title}.ts`}
          language="typescript"
          theme="vs-dark"
          onMount={handleMount}
          defaultValue={question.code}
          loading={<IconLoader2 className="animate-spin size-8" />}
        />
      )}
    </div>
  );
};
