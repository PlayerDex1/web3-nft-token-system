const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Iniciando deploy dos contratos...");

  // Obter o deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy do contrato NFT
  console.log("\n📦 Deploying MyNFT...");
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.deploy();
  await myNFT.deployed();
  console.log("MyNFT deployed to:", myNFT.address);

  // Deploy do contrato Token
  console.log("\n🪙 Deploying MyToken...");
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy();
  await myToken.deployed();
  console.log("MyToken deployed to:", myToken.address);

  // Salvar endereços dos contratos
  const contractAddresses = {
    MyNFT: myNFT.address,
    MyToken: myToken.address,
    network: await deployer.provider.getNetwork(),
    deployer: deployer.address
  };

  console.log("\n✅ Deploy concluído!");
  console.log("📋 Endereços dos contratos:");
  console.log("MyNFT:", myNFT.address);
  console.log("MyToken:", myToken.address);
  console.log("Deployer:", deployer.address);

  // Verificar contratos se estiver em testnet/mainnet
  const network = await deployer.provider.getNetwork();
  if (network.chainId !== 31337n) { // Não é rede local
    console.log("\n🔍 Verificando contratos...");
    try {
      await hre.run("verify:verify", {
        address: myNFT.address,
        constructorArguments: [],
      });
      console.log("✅ MyNFT verificado!");
    } catch (error) {
      console.log("❌ Erro ao verificar MyNFT:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: myToken.address,
        constructorArguments: [],
      });
      console.log("✅ MyToken verificado!");
    } catch (error) {
      console.log("❌ Erro ao verificar MyToken:", error.message);
    }
  }

  return contractAddresses;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });