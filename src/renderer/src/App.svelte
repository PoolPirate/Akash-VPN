<script lang="ts">
  import "../app.css";
  import Versions from "./components/Versions.svelte";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  //user input
  let mnemonic = null;
  let password = null;

  //temporary
  let walletAddress = null;
  let walletBalance = 0;

  onMount(() => {
    window.api.init();
  });

  let currentStep = 0;
  function showStep(step) {
    currentStep = step;
  }

  async function createWallet() {
    let wallet = await window.api.createWallet(password);
  }
  async function importWallet() {
    let wallet = await window.api.importWallet(mnemonic, password);
  }
  async function getBalance() {
    walletBalance = await window.api.getBalance();
  }

  async function loadWallet() {
    let wallet = await window.api.loadWallet(password);
  }

  function getAddress() {
    walletAddress = window.api.getAddress()
  }

  function getMnemonic(password:string) {
    mnemonic = window.api.getMnemonic(password)
  }
</script>


<button on:click={() => showStep(0)}>{currentStep}</button>
<input type="text" bind:value={password} placeholder="Enter your password">
<button on:click={() => createWallet(password)}>creat</button>
<button on:click={() => loadWallet(password)}>load</button>
<button on:click={() => getAddress()}>add</button>
<button on:click={() => getMnemonic(password)}>mne</button>
<button on:click={() => getBalance()}>bal</button>


<h3>password : {password}</h3>
<h3>walletAddress : {walletAddress}</h3>
<h3>walletBalance : {walletBalance}</h3>
<h3>mnemonic : {mnemonic}</h3>


<div class="container">
  {#if currentStep === 0}  //welcome
    <h1>Welcome to the Akash VPN</h1>
    <button on:click={() => showStep(1)}>Log in</button>
    <button on:click={() => showStep(10)}>Create new Wallet</button>
  {/if}

  {#if currentStep === 1} //login
    <input type="text" bind:value={password} placeholder="Enter your password">
    <button on:click={() => {
      try {
        if(loadWallet(password))
      showStep(2) //success
      else {showStep(11)} //wrong password
      }
      catch (e) {
        Error = e;
        showStep(99)
      }
    }}>Continue</button>
  {/if}

  {#if currentStep === 2} //wallet status
    <p>Wallet Address: {walletAddress}</p>
    <p>Wallet Balance: {walletBalance}</p>
    <button on:click={() => getBalance()}>Update Balance</button>
    {#if walletBalance < 5}
      <p>Insufficient funds</p>
      <p>deposit more or import a Wallet</p>
      <button on:click={() => showStep(10)}>Import Wallet</button>
    {:else }
      <button on:click={() => showStep(3)}>Next</button>
    {/if}
  {/if}

  {#if currentStep === 10}
    <input type="text" bind:value={password} placeholder="Enter your password">
    <button on:click={() => createWallet()}>Create Wallet</button>
    <hr  class="rounded">
    <input type="text" bind:value={mnemonic} placeholder="Enter your Mnemonic">
    <button on:click={() => importWallet()}>Import Wallet</button>
  {/if}

  {#if currentStep === 11}
    <p>Wrong Password</p>
    <input type="text" bind:value={password} placeholder="Enter your password">
    <button on:click={() => {
      try {
        if(loadWallet(password))
      showStep(2) //success
      else {showStep(11)} //wrong password
      }
      catch (e) {
        Error = e;
        showStep(99)
      }
    }}>Continue</button>
  {/if}

  {#if currentStep === 99}
    <p>{Error}</p>
  {/if}
  <Versions />
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 15px 30px 0 30px;
    font-size: 60px;
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
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #b7d1ef;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
  }

  input[type="text"]::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #0079fd;
    opacity: 1; /* Firefox */
  }

  hr.rounded {
    margin-top: 20px;
    border-top: 8px solid #bbb;
    border-radius: 5px;
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 100%;
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
