import { Container } from "@components/ui/Container";

// Inside the "pages/404.js" file
export default function Custom404() {
  return (
    <Container variant="page">
      <main className="content flex h-[calc(75vh-64px)] items-center justify-center">
        <h1 className="my-0 border-none text-center">Page Not Found</h1>
      </main>
    </Container>
  );
}
