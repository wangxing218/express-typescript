declare interface User {
  id: number,
  userName: string,
  age: number
}

declare interface Msg<T> {
  result: T,
  code: number,
  msg: string
}