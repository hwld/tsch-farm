import type { Question } from "@/lib/question";
import { Editor, type EditorProps, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useTypeDefs } from "./providers";
import { IconCode, IconLoader2 } from "@tabler/icons-react";

export type TschEditorCommand = {
  key: number;
  handler: () => void;
};

type Props = {
  question: Question;
  footer: ReactNode;

  /**
   *  TschEditorCommand[]を直接受け取ることもできるのだが、KeyCodeやKeyModをmonaco-editorからimportすると、
   *  なぜかビルドが失敗したり開発サーバーが遅くなるので、Monacoを受け取ってmonaco.KeyCodeやmonaco.KeyModを使用させるために
   *  コマンドを返す関数を受け取る
   */
  buildCommands?: (monaco: Monaco) => TschEditorCommand[];
};

export const TschEditor: React.FC<Props> = ({
  question,
  footer,
  buildCommands,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // マウントしているときだけ実行したいuseEffectがあるので、そこで使用する
  const [isMounted, setIsMounted] = useState(false);

  const typeDefs = useTypeDefs();

  const handleMount: EditorProps["onMount"] = async (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
    });

    setIsMounted(true);
  };

  // commandsが変更されたときに、コマンドを追加し直す
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!isMounted || !editor || !monaco) {
      return;
    }

    const commands = buildCommands?.(monaco);

    commands?.forEach(({ key, handler }) => {
      editor.addCommand(key, handler);
    });

    return () => {
      commands?.forEach(({ key }) => {
        editor.addCommand(key, () => {});
      });
    };
  }, [buildCommands, isMounted]);

  // typeDefsが変更されたときに、モデルを追加する
  useEffect(() => {
    if (!isMounted || !monacoRef.current || !typeDefs) {
      return;
    }
    const monaco = monacoRef.current;

    Array.from(typeDefs.entries()).forEach(([moduleName, typeDef]) => {
      monaco.editor.createModel(
        typeDef,
        "typescript",
        monaco.Uri.parse(`file:///node_modules/${moduleName}/index.d.ts`)
      );
    });

    return () => {
      monaco.editor.getModels().forEach((m) => {
        if (m.uri.path.startsWith("/node_modules")) {
          m.dispose();
        }
      });
    };
  }, [isMounted, typeDefs]);

  useEffect(() => {
    return () => {
      monacoRef.current?.editor.getModels().forEach((m) => {
        m.dispose();
      });
    };
  }, []);

  return (
    <div className="size-full bg-[#1e1e1e] border-border border rounded-lg overflow-hidden grid grid-rows-[auto_1fr_auto] min-w-0">
      <div className="p-2 text-xs flex gap-1 items-center bg-gray-800 border-border border-b">
        <IconCode className="size-4" />
        Code
      </div>
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
      <div className="p-2 h-12 flex justify-between items-center">{footer}</div>
    </div>
  );
};
