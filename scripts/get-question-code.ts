import { decompressFromEncodedURIComponent } from "lz-string";

export const getQuestionCode = async (
  questionId: number
): Promise<string | null> => {
  const res = await fetch(`https://tsch.js.org/${questionId}/play/ja`, {
    redirect: "manual",
  });
  const location = res.headers.get("Location");
  if (!location) {
    return null;
  }

  const rawCode = location.split("#code/")[1];
  const code = decompressFromEncodedURIComponent(rawCode);

  return code;
};
