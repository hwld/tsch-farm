import { Editor, type EditorProps, type Monaco } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { IconCode, IconLoader2 } from "@tabler/icons-react";
import { useTypeDefs } from "./type-defs-provider";
import type { Question } from "../lib/question";

const getQuestionModelPath = (question: Question) => `/${question.id}.ts`;

const getQuestionIdFromPath = (path: string) =>
  Number(path.split("/")[1].split(".ts")[0]);

export type TschEditorCommand = {
  key: number;
  handler: () => void;
};

type Props = {
  currentQuestion: Question;
  readOnly?: boolean;
  title?: string;
  footer?: ReactNode;
  onChangeErrorQuestionIds?: (questionIds: number[]) => void;

  /**
   *  TschEditorCommand[]を直接受け取ることもできるのだが、KeyCodeやKeyModをmonaco-editorからimportすると、
   *  なぜかビルドが失敗したり開発サーバーが遅くなるので、Monacoを受け取ってmonaco.KeyCodeやmonaco.KeyModを使用させるために
   *  コマンドを返す関数を受け取る
   */
  buildCommands?: (monaco: Monaco) => TschEditorCommand[];
};

export const TschEditor: React.FC<Props> = ({
  currentQuestion,
  footer,
  readOnly,
  title = "Code",
  onChangeErrorQuestionIds,
  buildCommands,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // マウントしているときだけ実行したいuseEffectがあるので、そこで使用する
  // たとえばmonacoの初期化をuseEffectで行いたいとき、初回のuseEffectではmonacoRefがセットされていない
  const [isMounted, setIsMounted] = useState(false);

  const typeDefs = useTypeDefs();

  const handleMount: EditorProps["onMount"] = async (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
      strict: true,
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

  // 一度でもコードを変更したかをフラグとして持っておく
  const changedRef = useRef(false);
  const handleChange = () => {
    if (!changedRef.current) {
      changedRef.current = true;
    }
  };

  useEffect(() => {
    return () => {
      monacoRef.current?.editor.getModels().forEach((m) => {
        m.dispose();
      });
    };
  }, []);

  useEffect(() => {
    if (!monacoRef.current || !isMounted) {
      return;
    }

    const { dispose } = monacoRef.current.editor.onDidChangeMarkers(() => {
      const monaco = monacoRef.current;

      if (!monaco || !onChangeErrorQuestionIds || !changedRef.current) {
        return;
      }

      const markers = monaco.editor.getModelMarkers({
        owner: "typescript",
      });
      const errorModelPaths = Array.from(
        new Set(
          markers
            .filter((m) => m.severity === monaco.MarkerSeverity.Error)
            .map((m) => m.resource.path)
        )
      );
      const errorQuestionIds = errorModelPaths.map((path) =>
        getQuestionIdFromPath(path)
      );

      onChangeErrorQuestionIds(errorQuestionIds);
    });

    return () => {
      dispose();
    };
  }, [onChangeErrorQuestionIds, isMounted]);

  return (
    <div className="size-full bg-[#1e1e1e] border-border border rounded-lg overflow-hidden grid grid-rows-[auto_1fr_auto] min-w-0">
      <div className="p-2 text-xs flex gap-1 items-center bg-gray-800 border-border border-b">
        <IconCode className="size-4" />
        {title}
      </div>
      <Editor
        options={{ automaticLayout: true, readOnly }}
        path={`file://${getQuestionModelPath(currentQuestion)}`}
        language="typescript"
        theme="vs-dark"
        onChange={handleChange}
        onMount={handleMount}
        defaultValue={currentQuestion.code}
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
