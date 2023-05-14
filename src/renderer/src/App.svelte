<script lang="ts">
  import '../app.css'
  import Versions from './components/Versions.svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  //user input
  let mnemonic = null;
  let password = null;

  //temporary
  let walletAddress = writable(null);
  let walletBalance = writable(0);

  let selectedServer = writable(null);
  let servers = ["server1", "server2", "server3"];

  onMount(() => {
    window.api.init();
  });

  let currentStep = 0;
  function showStep(step) {
    currentStep = step;
  }

  function createWallet() {
    let wallet = window.api.createWallet(password);
    walletAddress = wallet.address;
  }
  function importWallet() {
    let wallet = window.api.importWallet(mnemonic,password);
    walletAddress = wallet.address;
  }
  function getBalance() {
    let balance = window.api.getBalance();
    walletBalance = balance;
  }

  function loadWallet() {
    let wallet = window.api.loadWallet(password);
    walletAddress = wallet.address;
  }


</script>


<button on:click={() => showStep(0)}>{currentStep}</button>
<button on:click={() => window.api.createWallet()}>new</button>
<h3>mnemonic : {mnemonic}</h3>
<h3>password : {password}</h3>
<h3>walletAddress : {walletAddress}</h3>
<h3>walletBalance : {walletBalance}</h3>


<div class="container">
  {#if currentStep === 0}  //welcome
    <h1>Welcome to the Akash VPN</h1>
    <button on:click={() => showStep(1)}>Log in</button>
    <button on:click={() => showStep(2)}>Set New Password</button>
  {/if}

  {#if currentStep === 1} //login
    <input type="text" bind:value={password} placeholder="Enter your password">
    <button on:click={() => showStep(3)}>Continue</button>
  {/if}

  {#if currentStep === 2} //set new password
    <h3>Please note that if you set a new password, you will lose access to
      any previously stored wallets that were encrypted with the old password. </h3>
    <input type="text" bind:value={password} placeholder="Enter New password">
    <button on:click={() => showStep(3)}>Continue</button>
  {/if}

  {#if currentStep === 3 || currentStep === 4 } //check wallet
    {#if walletAddress == null}
      <p> no stored Wallet found</p>
      <button on:click={() => showStep(5)}>Import Wallet</button>
      <button on:click={() => createWallet()}>New Wallet</button>
    {:else}
      <p>Wallet Address: {walletAddress}</p>
      <p>Wallet Balance: {walletBalance}</p>
      {#if walletBalance < 5}
        <p>Insufficient funds</p>
      {:else }
        <button on:click={() => showStep(6)}>Next</button>
      {/if}
    {/if}
  {/if}

  {#if currentStep === 5} //import wallet
    <p> no stored Wallet found</p>
    <input type="text" bind:value={mnemonic} placeholder="Enter your mnemonic">
    <button on:click={() => importWallet() }>Import</button>
  {/if}

  {#if currentStep === 6}
    <label>
      Select a server:
      <select bind:value={selectedServer}>
        {#each servers as server}
          <option value={server}>{server}</option>
        {/each}
      </select>
    </label>
    <button on:click={() => showStep(7)}>Next</button>
  {/if}

  {#if currentStep === 7}
    <button on:click={()=> {if(window.api.softether.connectToVPN('add','port','user','pass')){showStep(8)}else showStep(99)}}>Connect to VPN</button>
  {/if}

  {#if currentStep === 8}
    <button on:click={()=> {if(window.api.softether.disconnectFromVPN()){showStep(7)}else showStep(99)}}>Disconnect from VPN</button>
    <button on:click={()=> {if(window.api.softether.deleteVirtualAdapter('name')){showStep(1)}else showStep(99)}}>Kill VPN</button>
  {/if}

  {#if currentStep === 99}
    <p>Error</p>
  {/if}
  <Versions />
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 840px;
    margin: 0 auto;
    padding: 15px 30px 0 30px;
  }

  body {
    font-family: Arial, sans-serif;
    margin: 0;
  }

  #stepper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
  }

  .step {
    display: none;
  }

  .step.active {
    display: block;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  input[type="text"] {
    margin-right: 10px;
    padding: 5px;
    width: 200px;
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007aff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  select {
    padding: 5px;
  }
</style>
