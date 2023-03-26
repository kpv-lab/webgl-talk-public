export async function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, 1000 * time))
}
