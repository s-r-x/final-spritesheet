import { Mutex as BaseMutex } from "async-mutex";

export class Mutex {
  private mutex = new BaseMutex();
  public async run<T>(cb: () => Promise<T>): Promise<T> {
    return this.mutex.runExclusive(cb);
  }
}
