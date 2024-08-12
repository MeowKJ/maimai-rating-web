// apiDataProvider.ts
import type { Beat50ApiData } from "./types";

export default abstract class ApiDataProvider {
  constructor(protected username: string) {}

  public abstract getBest50Data(): Promise<Beat50ApiData | null>;
}
