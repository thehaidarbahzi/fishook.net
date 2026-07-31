import { v4 as uuidv4 } from "uuid";

export function generateToken(counter: number, uuid?: string) {
  const id = uuid || uuidv4();
  const token = `${String(counter).padStart(6, "0")}-${id}`;
  return { token, uuid: id };
}
