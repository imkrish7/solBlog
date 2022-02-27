import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"
import path from "path";
import fs from "fs";
import spawn from "cross-spawn";
import { fileURLToPath }  from "url";
import { dirname } from "path";

const PROJECT_NAME = "solblog";

const SLASH = path.sep;
const __filename = fileURLToPath(import.meta.url);

exports = async function(){
  const network = clusterApiUrl("devnet");
  const connection = new Connection(network, "confirmed");
  let programAuthorityKeypair = new Keypair();
  // Add your deploy script here.
  const signature = await connection.requestAirdrop(
    programAuthorityKeypair.publicKey,
    LAMPORTS_PER_SOL*5
  )
  await connection.confirmTransaction(signature);
  const programAuthorityKeyFilename = `deploy/authority-keypair.json`;
  const progaramAuthorityKeypairFile = path.resolve(
	  `${__dirname}${SLASH}${programAuthorityKeyFilename}`
  );
}