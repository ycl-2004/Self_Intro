import { PropsWithChildren } from "react";

export default function Card({ children }: PropsWithChildren) {
  return <article className="card">{children}</article>;
}
