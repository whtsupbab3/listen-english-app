import Image from "next/image";
import Hero from "./components/Hero";
import BookList from "./components/BookList";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#2f2e2e] text-[#dfdfdf] pb-16">
      <Header />
      <Hero />
      <BookList />
    </main>
  );
}
