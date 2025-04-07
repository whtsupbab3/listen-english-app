import Reader from "@/app/components/Reader";

interface PageProps {
  params: {
    id: string;
  };
}

async function getBook(id: string) {
  const res = await fetch(`http://localhost:3000/api/audiobooks/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch book');
  }
  return res.json();
}

export default async function Page({ params }: PageProps) {
  const book = await getBook(params.id);
  
  return (
    <main className="min-h-screen bg-[#2f2e2e] text-[#dfdfdf]">
      <Reader book={book} />
    </main>
  );
}
