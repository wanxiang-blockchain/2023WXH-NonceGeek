import { DAPP_ADDRESS, APTOS_FAUCET_URL, APTOS_NODE_URL, MODULE_URL } from '../config/constants';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { MoveResource } from '@martiandao/aptos-web3-bip44.js/dist/generated';
import { useState, useEffect } from 'react';
import React from 'react';
import { AptosAccount, WalletClient, HexString } from '@martiandao/aptos-web3-bip44.js';
import { AptosClient, Types } from "aptos";
import CryptoJS from 'crypto-js';
import newAxios from '../utils/axiosUtils';

// import { CodeBlock } from "../components/CodeBlock";

// import { TypeTagVector } from "@martiandao/aptos-web3-bip44.js/dist/aptos_types";
// import {TypeTagParser} from "@martiandao/aptos-web3-bip44.js/dist/transaction_builder/builder_utils";
export default function Home() {
  const [hasAddrAggregator, setHasAddrAggregator] = React.useState<boolean>(false);
  const [services, setServices] = React.useState<Array<any>>([]);
  const { account, signAndSubmitTransaction } = useWallet();
  // TODO: refresh page after disconnect.
  const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  const client_sdk = new AptosClient("https://fullnode.testnet.aptoslabs.com");

  function proposal_to_backend(){
    const { title, content, dataset_id } = formInput;
    newAxios.post(
      '/proposal',
      {"title": title, content: content, "dataset_id": dataset_id, "contributor": account!.address!.toString()},
    ).then((res) => {
      console.log(res);
    });
  }


  const [voters, setVoters] = React.useState<Array<string>>([]);
  // const [resource, setResource] = React.useState<MoveResource>();
  const [formInput, updateFormInput] = useState<{
    title: string;
    content: string;
    hash: string;
    contributor: string;
    dataset_id: string;
  }>({
    title: 'a test move contract',
    content: 'test content',
    hash: "0x0",
    contributor: '0x01',
    dataset_id: 'aptos-smart-contracts-fragment-by-structure',
  });

  async function submit_proposal() {
    await signAndSubmitTransaction(do_submit_proposal(), { gas_unit_price: 100 }).then(() => {
      proposal_to_backend();
      console.log("AHA")
    });
  }

  function do_submit_proposal() {
    // submit proposal to the contract.
    const { title, content, dataset_id } = formInput;
    // gen and updated hash of the content
    const hash= sha256(content);
    updateFormInput({ ...formInput, hash: sha256(content) });

    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::governancer::proposal',
      arguments: [title, hash, dataset_id], 
      type_arguments: [],

    };
    // submit proposal to the backend.
  }

  const payload: Types.ViewRequest = {
    function: DAPP_ADDRESS + "::governancer::get_voters",
    type_arguments: [],
    arguments: [],
  };
  async function get_voters() {
    await client_sdk.view(payload).then(
      (result) => {
        setVoters(result[0]);
        console.log(result[0]);
      });
  }

  function sha256(msg) {
    return "0x" + CryptoJS.SHA256(msg).toString(CryptoJS.enc.Hex);
  }
  const render_voters = () => {
    return voters.map(
      (data, _key) =>
      (
        <tr className="text-center">
          <th>{data}</th>
        </tr>
      )
    );
  };

  return (
    <div>
      <center>
        <p>
          <b>Module Path: </b>
          <a target="_blank" href={MODULE_URL} className="underline">
            {DAPP_ADDRESS}::governancer
          </a>
        </p>
      </center>

      <div className="overflow-x-auto mt-2">
        <h3 className="text-center font-bold">
          Voters
        </h3>
        <table className="table table-compact w-full my-2">
          <thead>
            <tr className="text-center">
              <th>Voter Address</th>
            </tr>
          </thead>
          <tbody>{render_voters()}</tbody>
        </table>
        <br />
      </div>

      <center>
        <button  onClick={get_voters} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
          check the voters
        </button>

        <br /><br />

        <input
          placeholder="Proposal Title"
          className="mt-8 p-4 input input-bordered input-primary w-1/2"
          onChange={(e) => updateFormInput({ ...formInput, title: e.target.value })}
          value={formInput.title}
        />
        <br />
        <input
          placeholder="Proposal Content"
          className="mt-8 p-4 input input-bordered input-primary w-1/2"
          onChange={(e) => updateFormInput({ ...formInput, content: e.target.value })}
        />
        <br /><br />
        {/*  TODO: change hash when value changed. */}
        <p>Hash for the Content(Sha256): {formInput.hash}</p>
        <br />
        <input
          placeholder="Proposal Dataset-ID"
          className="mt-8 p-4 input input-bordered input-primary w-1/2"
          onChange={(e) => updateFormInput({ ...formInput, dataset_id: e.target.value })}
          value={formInput.dataset_id}
        />
        <br />
        <button onClick={submit_proposal} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
          Submit Proposal
        </button>

      </center>

    </div>
  );
}
