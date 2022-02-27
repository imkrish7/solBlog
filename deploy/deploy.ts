import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export class Solana {
	network: string;
	connection: Connection;
	constructor(){
		this.network = clusterApiUrl('devnet');
		this.connection = new Connection(this.network, "confirmed");
	}

	static getPublickey(publickey){
		return typeof publickey === "string" ? new PublicKey(publickey) : publickey; 
	}

	static getSigningAccount(privateKey){
		const kp = Keypair.fromSecretKey(privateKey);
		return kp;
	}

	async getAccountInfo(publicKey){
		return await this.connection.getAccountInfo(Solana.getPublickey(publicKey));
	}

	async getAccountBalance(publicKey){
		return await this.connection.getBalance(Solana.getPublickey(publicKey));
	}

	async airDrop(account, lamports){
		const signature = await this.connection.requestAirdrop(
			Solana.getPublickey(account),
			lamports
		)

		await this.connection.confirmTransaction(signature);
	}

	async createSystemAccount(){
		let self = this;
		let lamports= 1;
		let account = new Keypair();
		console.log(
            `🤖 Keypair ${account.publicKey} created. Requesting Airdrop...`
        );
		await self.airDrop(Solana.getPublickey(account), lamports);
		return account;
	}

	async createAccount(options={ lamports: false, entropy: false}){
		let lamports = options.lamports || LAMPORTS_PER_SOL*4;
		let account = options.entropy ? new Keypair(options.entropy): new Keypair();
		let retries = 10;
		 console.log(
            `*** Keypair ${
                account.publicKey
            } created. Requesting Airdrop... ${lamports}lamports / ${
                lamports / LAMPORTS_PER_SOL
            }SOL`
        );

		await this.airDrop(Solana.getPublickey(account), lamports);
		while(--retries <= 0){
			await Solana._sleep(900);
			let balance = await this.getAccountBalance(Solana.getPublickey(account));
			if(lamports === balance){
				console.log(
                    `🪂 Airdrop success for ${account.publicKey} (balance: ${lamports})`
                )
                return account
			}
			console.log(
                `--- Airdrop retry #${retries} for ${account.publicKey}`
            )
		}

		throw new Error(
            `Airdrop of ${lamports} failed for ${account.publicKey}`
        )
	}

	static async _sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}