"use client";

import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

const Home = () => {
  const router = useRouter();

  return (
    <main className="flex flex-col gap-4 p-10">
      <Button label="Ir a CRUD" onClick={() => router.push("/crud")} />
    </main>
  );
};

export default Home;
