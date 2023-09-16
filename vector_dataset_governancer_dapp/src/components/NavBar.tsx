import Image from "next/image";
import { NavItem } from "./NavItem";
import { AptosConnect } from "./AptosConnect";
import { MODULE_URL } from "../config/constants";

import LogoUrl from "@assets/img/logo.png";

export function NavBar() {
  return (
    <nav className="px-4 py-4 navbar bg-base-100">
      <div className="flex-1">
        <a href="http://movedid.build" target="_blank" rel="noreferrer">
          <Image src={LogoUrl} width={64} height={64} alt="logo" />
        </a>
        <ul className="p-0 ml-5 menu menu-horizontal">
          <NavItem href="/" title="Proposal Submitter" />
          <NavItem href="https://ai.movedid.build/proposal_viewer" title="Proposal List" />
          {/* 
          <NavItem href="/github_repo_binder" title="GithubRepoBinder" />
          <NavItem href="/service_manager" title="ServiceManager" />
          <NavItem href="/service_events" title="ServiceEvents" />
          <NavItem href="/addr" title="AddrManager" />
          <NavItem href="/addr_events" title="AddrEvents" />
          <NavItem href="/create_did_events" title="CreateDIDEvents" />
          <NavItem href="/did_querier" title="DIDQuerier" /> */}
          <li className="font-sans text-lg font-semibold">
            <a
              href="https://github.com/NonceGeek/MoveDID/tree/main/did-aptos"
              target="_blank"
              rel="noreferrer"
            >
              Source Code
            </a>
            <a href={MODULE_URL} target="_blank" rel="noreferrer">
              Contract on Explorer
            </a>
          </li>
        </ul>
      </div>
      <AptosConnect />
    </nav>
  );
}
