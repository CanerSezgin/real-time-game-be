export class LinkListNode<T> {
  public next: LinkListNode<T> | null = null;
  public prev: LinkListNode<T> | null = null;
  constructor(public data: T) {}
}

export interface ILinkedList<T> {
  insertInBegin(data: T): LinkListNode<T>;
  insertAtEnd(data: T): LinkListNode<T>;
  deleteNode(node: LinkListNode<T>): void;
  traverse(): T[];
  size(): number;
  search(comparator: (data: T) => boolean): LinkListNode<T> | null;
}

export class LinkedList<T> implements ILinkedList<T> {
  private head: LinkListNode<T> | null = null;

  insertInBegin(data: T): LinkListNode<T> {
    const node = new LinkListNode(data);

    if (!this.head) {
      this.head = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    return node;
  }
  public insertAtEnd(data: T): LinkListNode<T> {
    const node = new LinkListNode(data);
    if (!this.head) {
      this.head = node;
    } else {
      const getLast = (node: LinkListNode<T>): LinkListNode<T> => {
        return node.next ? getLast(node.next) : node;
      };

      const lastNode = getLast(this.head);
      node.prev = lastNode;
      lastNode.next = node;
    }
    return node;
  }
  public deleteNode(node: LinkListNode<T>): void {
    if (!node.prev) {
      this.head = node.next;
    } else {
      const prevNode = node.prev;
      prevNode.next = node.next;
    }
  }
  public traverse(): T[] {
    const array: T[] = [];
    if (!this.head) {
      return array;
    }

    const addToArray = (node: LinkListNode<T>): T[] => {
      array.push(node.data);
      return node.next ? addToArray(node.next) : array;
    };
    return addToArray(this.head);
  }
  public size(): number {
    return this.traverse().length;
  }
  public search(comparator: (data: T) => boolean): LinkListNode<T> | null {
    const checkNext = (node: LinkListNode<T>): LinkListNode<T> | null => {
      if (comparator(node.data)) {
        return node;
      }
      return node.next ? checkNext(node.next) : null;
    };

    return this.head ? checkNext(this.head) : null;
  }
}
