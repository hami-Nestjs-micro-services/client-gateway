export interface RequestGeneric<T> {
  payload?: T;
  correlationId: String;
  causationId: String;
}