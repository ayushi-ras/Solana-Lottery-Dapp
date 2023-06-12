import Header from "../components/Header";
import PotCard from "../components/PotCard";
import Table from "../components/Table";
import style from "../styles/Home.module.css";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");
import { AppProvider } from "../context/context";

export default function Home() {
  const endpoint = "https://capable-rough-road.solana-devnet.discover.quiknode.pro/ef4d29ab3f286ac54013bd9e161445c749a2dd5e/";
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (

    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppProvider>
            <div className={style.wrapper}>
              <Header />
              <PotCard />
              <Table />
            </div>
          </AppProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>


  );
}
