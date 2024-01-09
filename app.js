document.addEventListener('DOMContentLoaded', async function () {
    // Infura API Key and Ethereum Network (Replace 'YOUR_INFURA_API_KEY' with your actual Infura API key)
    const infuraApiKey = 'YOUR_INFURA_API_KEY';
    const ethereumNetwork = 'mainnet'; // You can use 'rinkeby' or other testnets for testing

    // Create a web3 instance using Infura
    const web3 = new Web3(`https://${ethereumNetwork}.infura.io/v3/${infuraApiKey}`);

    // Define the contracts and their corresponding chains
    const contracts = [
        { address: '0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7', chain: 'Mantle' },
        { address: '0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7', chain: 'Linea' },
        { address: '0x7afb9de72A9A321fA535Bb36b7bF0c987b42b859', chain: 'Kroma' }
    ];

    // Fetch the current and previous balances for each contract
    for (const contract of contracts) {
        const currentBalance = await getBalance(web3, contract.address);
        const previousBalance = await getBalanceAtTimestamp(web3, contract.address, Date.now() - 12 * 60 * 60 * 1000);
        const percentageChange = calculatePercentageChange(previousBalance, currentBalance);

        // Display the balance and percentage change
        displayBalance(contract.chain, currentBalance, percentageChange);

        // Notify the user if the balance reduces by 10% or more
        if (percentageChange < -10) {
            showNotification(`Warning: ${contract.chain} - Your balance has decreased by 10% or more in the last 12 hours!`);
        }
    }
});

async function getBalance(web3, address) {
    // Use web3 to get the native token balance of the specified address
    const balance = await web3.eth.getBalance(address);
    return balance;
}

async function getBalanceAtTimestamp(web3, address, timestamp) {
    // Use web3 to get the native token balance of the specified address at a specific timestamp
    const balance = await web3.eth.getBalance(address, timestamp);
    return balance;
}

function calculatePercentageChange(previousBalance, currentBalance) {
    // Calculate the percentage change in balance
    const percentageChange = ((currentBalance - previousBalance) / previousBalance) * 100;
    return percentageChange;
}

function displayBalance(chain, balance, percentageChange) {
    // Display the balance and percentage change on the HTML page
    const balanceContainer = document.getElementById('balance-container');
    const balanceElement = document.createElement('div');
    balanceElement.innerHTML = `<p>${chain} - Current Balance: ${web3.utils.fromWei(balance, 'ether')} ETH</p>`;
    balanceElement.innerHTML += `<p>Change in the Last 12 Hours: ${percentageChange.toFixed(2)}%</p>`;
    balanceContainer.appendChild(balanceElement);
}

function showNotification(message) {
    // Display a creative notification alert to users
    // You can customize this part based on your design preferences
    alert(message);
}
