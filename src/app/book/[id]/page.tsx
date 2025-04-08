import Reader from "@/app/components/Reader";
import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

async function getBook(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/audiobooks/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch book');
  }
  return res.json();
}

export default async function Page({ params }: PageProps) {
  const { id } = await params; 
  const book = await getBook(id);
  
  return (
    <main className="min-h-screen bg-[#000] text-[#dfdfdf]">
      <div className="p-4">
        <Link 
          href="/" 
          className="inline-block mb-4 px-4 py-2 bg-[#fea900] text-black rounded hover:bg-[#ffb52e] transition-colors"
        >
          ← Повернутися до книг
        </Link>
      </div>
      <Reader book={book} />
    </main>
  );
}
