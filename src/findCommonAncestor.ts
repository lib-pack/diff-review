import { execSync } from "child_process";

export function findCommonAncestor(branch1: string, branch2: string) {
	try {
		// 执行 Git 命令获取共同节点的哈希值
		const command = `git merge-base ${branch1} ${branch2}`;
		const output = execSync(command, { encoding: "utf-8" });

		// 返回共同节点的哈希值
		return output.trim();
	} catch (error) {
		console.error("Error finding common ancestor:", error);
		return undefined;
	}
}
