import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div className="home-page">
      <Head>
        <title>Mesh App on Cardano</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-center p-24`}
      >
        <div className="text-center mb-20">
          <h1 className="text-6xl font-thin text-white">
            Welcome To
          </h1>
          <h1 className="text-6xl font-thin text-white mt-4">
            The First AIKEN Smart Contract
          </h1>
          <h1 className="text-6xl font-thin text-white mt-4">
            NFT Generator and Minting Service
          </h1>
        </div>

        <Link 
          href="/NFTGEN" 
          className="px-8 py-4 text-xl text-white rounded-lg
            background-gradient border-blue hover-effect"
        >
          Go to NFT Generator
        </Link>
      </main>
    </div>
  );
}
