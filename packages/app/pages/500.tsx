import { Container } from "@components/ui/Container";

export default function Custom500() {
  return (
    <Container variant="page">
      <main className="content flex h-[calc(75vh-64px)] items-center justify-center">
        <h1 className="my-0 border-none text-center">500 Server Error</h1>
      </main>
    </Container>
  );
}
