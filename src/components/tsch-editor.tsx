import type { Question } from "@/lib/question";
import { Editor, type EditorProps, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useTypeDefs } from "./providers";
import { IconCode, IconLoader2 } from "@tabler/icons-react";

export type TschEditorCommand = {
  key: number;
  handler: () => void;
};

type Props = {
  question: Question;
  footer: ReactNode;
  commands?: TschEditorCommand[];
};

export const TschEditor: React.FC<Props> = ({
  question,
  footer,
  commands = [],
}) => {
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

    // マウント時にしか追加されないので、commandsが変更したときにも追加する必要がある
    commands.forEach(({ key, handler }) => {
      editor.addCommand(key, handler);
    });
  };

  // commandsが変更されたときに、コマンドを追加し直す
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    commands.forEach(({ key, handler }) => {
      // monacoのドキュメントには書いてなかったけど、コマンドは追記じゃなくて上書きの形で追加されることに依存してる
      editor.addCommand(key, handler);
    });
  }, [commands]);

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
    <div className="size-full bg-[#1e1e1e] border-border border rounded-lg overflow-hidden grid grid-rows-[min-content_1fr_min-content] min-w-0">
      <div className="p-2 text-xs flex gap-1 items-center bg-gray-800 border-border border-b">
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
          className="min-h-0"
          wrapperProps={{
            style: {
              display: "flex",
              position: "relative",
              textAlign: "initial",
              width: "100%",
              height: "100%",
              minWidth: "0px",
            } satisfies CSSProperties,
          }}
        />
      )}
      <div className="p-2 h-12 flex justify-between items-center">{footer}</div>
    </div>
  );
};
