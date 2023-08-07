import { simpleGit } from "simple-git";

export function getCurrentBranch(cwd: string) {
	return simpleGit(cwd)
		.branchLocal()
		.then((r: any) => r.current);
}
