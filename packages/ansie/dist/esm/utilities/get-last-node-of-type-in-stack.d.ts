import type { AnsieNode } from '../compile/types';
/**
 * This function retrieves the last node of a specific type from a stack of nodes (such as the stack of nodes in the compiler).
 *
 * Node that it does a reverse search of the stack, so it will return the last node of the specified type, not the first.
 *
 * @example
 *
 * let stack = [{node: 'color', ...}, {node: 'bold', ...}, {node: 'underline', ...}];
 * let result = getLastNodeOfTypeFromStack('bold', stack);
 * // result will be the last node of type 'bold' in the stack
 */
export declare function getLastNodeOfTypeFromStack<T extends AnsieNode['node']>(nodeType: T, stack: AnsieNode[]): AnsieNode | null;
