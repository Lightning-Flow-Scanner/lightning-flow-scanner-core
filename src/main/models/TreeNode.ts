import { FlowElement } from "./FlowElement";

export type TreeNode<T = unknown> = {
  value: T;
  children: TreeNode<T>[];
};

export type HashTreeNode<T = unknown> = Record<string, Partial<TreeNode<T>>>;

export function toTreeStackPath(tree: HashTreeNode<FlowElement>): string[] {
  const callStack: string[] = [];
  const stack: { component: TreeNode<FlowElement>; path: string }[] = [
    {
      component: tree[tree.start.children?.[0].value.name as string] as TreeNode<FlowElement>,
      path: "start",
    },
  ];

  while (stack.length > 0) {
    const { component, path } = stack.pop()!;
    const visitedComponent = component.value.name as string;
    const newPath = `${path} -> ${visitedComponent}`;

    if (!component?.children || component.children.length === 0 || newPath.length > 1_000) {
      callStack.push(newPath);
    } else {
      for (const child of component.children) {
        stack.push({
          component: tree[child.value.name as string] as TreeNode<FlowElement>,
          path: newPath,
        });
      }
    }
  }

  return callStack.filter((stack) => stack);
}
