import { Octokit } from "@octokit/rest";

export type QuestionMeta = { id: number; title: string; difficulty: string };

export const getQuestionsMeta = async (): Promise<QuestionMeta[]> => {
  const { data } = await new Octokit().request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    {
      owner: "type-challenges",
      repo: "type-challenges",
      tree_sha: "main",
      recursive: "true",
    }
  );

  const questionsMeta = data.tree
    .filter(
      (tree) => tree.type === "tree" && tree.path?.startsWith("questions/")
    )
    .map((tree): QuestionMeta | null => {
      if (!tree.path) {
        return null;
      }

      const parts = tree.path.split("questions/")[1].split("-");
      const id = Number(parts[0]);
      const difficulty = parts[1];
      const title = parts.slice(2).join("-");

      return { id, difficulty, title };
    })
    .filter((id) => id !== null);

  return questionsMeta;
};
