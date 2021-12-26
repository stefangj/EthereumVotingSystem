# EthereumVotingSystem

This is a project for my last exam from the studies at the FCSE in Skopje.
Utilizing the potential of blockchain technology, I developed a decentralized application that should simplify the election process. This project is a prototype of what such a system should look like, so there are a number of drawbacks.

To test the functionality of this system you need to have Truffle, Ganache and Metamask browser extension installed.

First install Ganache on your computer and create a workspace. Then clone the repository and open it with your favorite editor.

In the backend folder in **Election.sol** you need to set the administrator address from one of the created Ganache wallets. Next, with the help of the **truffle migrate --reset** command, you will set the smart contract on the network.

In the frontend folder in **config.js** file you need to enter the address of the smart contract placed on the network generated by Truffle to connect to the smart contract and you need to set the address of the administrator in **Home.js** where the variable is located for the administrator address. You need to import the same address through its private key on the Metamask extension where you need to create connection to Ganache network(there are a lot of tutorials on Internet for that). Also in this folder you need to perform **npm install** to install the necessary modules to work on the user interface.

Demo: [Ethereum Voting System](https://youtu.be/At8TjTNHW6o "Ethereum Voting System")
