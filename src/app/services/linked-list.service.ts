import { Injectable } from '@angular/core';
import { INode } from '../interfaces/node.interface';
import { TFunction } from '../types/Types';

@Injectable({
  providedIn: 'root'
})
export class LinkedListService<T> {

  private head: INode<T> = null;
  private tail: INode<T> = null;
  private EMPTY_NODE: INode<T> = { value: null, next: null };

  constructor() { }

  // Métodos para el append:

  public isEmpty = () => !this.head;

  public toArray = (): T[] => {
    const result: T[] = [];
    let node = this.head;
    while (node) {
        result.push(node.value);
        node = node.next;
    }
    return result;
  }

  public fromArray = (values: T[]): LinkedListService<T> => {
    values.forEach(v => this.append(v));
    return this;
  }

  private forgeNode = (value: T): INode<T> => {
    return { value, next: null };
  }

  public obtenerHead = () => {
    return this.head;
  }

  private appendToTheEndOfTheList = (node: INode<T>) => {
    this.tail.next = node;
    this.tail = node;
  }

  public append = (value: T): LinkedListService<T> => {
    const node = this.forgeNode(value);

    if (this.isEmpty()) {
        this.head = node;
        this.tail = node;
        return this;
    }

    this.appendToTheEndOfTheList(node);
    return this;
  }

  // Iterator:
  public *items() {
    let node = this.head;
    while (node) {
        yield node;
        node = node.next;
    }
  }

  // Delete
  public delete = (value: T): boolean => {
    let deleted = false;
    if (this.isEmpty()) {
        return deleted;
    }

    deleted = this.deleteFromHead(value);

    let current = this.head || this.EMPTY_NODE;
    while (current.next) {
        if (current.next.value === value) {
            deleted = true;
            current.next = current.next.next;
        } else {
            current = current.next;
        }
    }

    if (this.tail.value === value) {
        this.tail = current;
    }
    return deleted;
  }

private deleteFromHead = (value: T): boolean => {
    let deleted = false;
    while (this.head && this.head.value === value) {
        deleted = true;
        this.head = this.head.next;
    }
    return deleted;
}

// Searching
public find = (compare: TFunction<T, boolean>): INode<T> => {
  if (this.isEmpty()) {
      return null;
  }

  let node = this.head;
  while (node) {
      if (compare(node.value)) {
          return node;
      }
      node = node.next;
  }
  return null;
}

// Insertar al comienzo
public insert = (value: T): LinkedListService<T> => {
  const node = this.forgeNode(value);
  node.next = this.head;
  this.head = node;

  if (!this.tail) {
      this.tail = node;
  }

  return this;
}
}
