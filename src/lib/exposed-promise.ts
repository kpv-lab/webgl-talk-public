export interface ExposedPromise<T> {
  promise: Promise<T>
  resolve: (value: T) => void
  reject:  (error: Error) => void
}

export function makeExposedPromise<T>(): ExposedPromise<T> {
  let resolve: (value: T) => void
  let reject:  (error: Error) => void
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  // eslint-disable-next-line
  // @ts-ignore
  return { promise, resolve, reject }
}
