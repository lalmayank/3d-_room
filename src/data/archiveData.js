export const archivePages = Array.from({ length: 16 }).map((_, i) => {
  const pageNum = i + 1;
  const padNum = pageNum.toString().padStart(2, '0');
  
  const subjects = [
    { title: "Network Operations Chief", desc: "Monitors subterranean telemetry and dark-fiber links. Primary architect of the cellar proxy relays.", vector: "@oasis.core.01", code: `OMEGA-77-ECHO-${padNum}`, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    { title: "Binary Forensics Officer", desc: "Specializes in static assembly audits, decompilation pipelines, and scrubbing telemetry logs.", vector: "@mirage.phantom.02", code: `SIGMA-42-TANGO-${padNum}`, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
    { title: "Cryptographic Vault Supervisor", desc: "Administers rotary locking primitives and acoustic perimeter decoders throughout the lower facility.", vector: "@acm.crypta.03", code: `DELTA-99-SIERRA-${padNum}`, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
    { title: "Hardware Security Analyst", desc: "Investigates FPGA logic probes and bus analyzers attached to the eastern terminal racks.", vector: "@acm.recon.04", code: `KAPPA-18-BRAVO-${padNum}`, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" },
    { title: "Heist Recon Specialist", desc: "Mapped subterranean sewer lines and 19th-century cellar foundations prior to the annual keynote.", vector: "@acm.phantom.05", code: `EPSILON-33-ZULU-${padNum}`, img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80" },
    { title: "Signal Intercept Warden", desc: "Dispatched to triangulate high-frequency burst transmissions detected near the wooden bookcase.", vector: "@oasis.sentinel.06", code: `THETA-61-VICTOR-${padNum}`, img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80" },
    { title: "Sub-Level Logistics Officer", desc: "Handled contraband transport from the northern rail corridor to the vault storage benches.", vector: "@acm.vault.07", code: `LAMBDA-84-ALPHA-${padNum}`, img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80" },
    { title: "Autonomous Script Overseer", desc: "Deployed recursive scraper bots to monitor institutional surveillance feeds across city sectors.", vector: "@oasis.observer.08", code: `ZETA-12-ROMEO-${padNum}`, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" },
    { title: "Archive Custodian", desc: "Maintains filing records and ensures classified manifests remain sealed behind dual keys.", vector: "@acm.records.09", code: `PSI-55-CHARLIE-${padNum}`, img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" },
    { title: "Perimeter Drone Operator", desc: "Conducts low-altitude reconnaissance over external courtyard access points during night cycles.", vector: "@mirage.ops.10", code: `CHI-88-DELTA-${padNum}`, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
    { title: "Deep-Storage Cryptographer", desc: "Designs zero-knowledge proofs and rolling key schedules for the master council evidence vault.", vector: "@acm.crypt.11", code: `MU-27-FOXTROT-${padNum}`, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
    { title: "Ventilation Acoustic Scout", desc: "Mapped acoustic resonances within air ducts to identify perimeter microphone locations.", vector: "@oasis.scout.12", code: `NU-73-GOLF-${padNum}`, img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80" },
    { title: "Electromagnetic Warfare Analyst", desc: "Monitored Faraday cage integrity around the central server rack during the high-voltage test.", vector: "@acm.emw.13", code: `XI-90-HOTEL-${padNum}`, img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80" },
    { title: "Counter-Surveillance Handler", desc: "Neutralized optical sensors and planted diversionary smoke canisters in the east corridor.", vector: "@mirage.agent.14", code: `RHO-41-INDIA-${padNum}`, img: "https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=400&q=80" },
    { title: "Evidence Board Archivist", desc: "Curates pinned polaroids, news clippings, and red twine connections on the main corkboard.", vector: "@acm.curator.15", code: `TAU-66-JULIET-${padNum}`, img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
    { title: "Cellar Mastermind", desc: "Supreme coordinator of the ACM Heist. Directs operations from behind the secure frosted glass pane.", vector: "@council.prime.16", code: `OMEGA-00-MASTER-${padNum}`, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" }
  ];

  const sub = subjects[i];

  return {
    id: `page-${pageNum}`,
    ref: `10863-OASIS-${padNum}`,
    title: `Incident Report Form #${padNum}`,
    role: sub.title,
    imageUrl: sub.img,
    igVector: sub.vector,
    liVector: `/in/acm-dossier-10863-${padNum}`,
    encryptionKey: sub.code,
    status: i % 3 === 0 ? "RESOLVED" : i % 2 === 0 ? "ACTIVE TARGET" : "MONITORED",
    classified: i % 2 === 0,
    physicalDesc: sub.desc,
    narrative: [
      `Surveillance indicates routine deployment of CSS protocols across all observed environments. Subject has actively overridden legacy systems, demonstrating efficiency and strict coding mandates.`,
      `Intercepted documentation reveals structural constraints: interfaces must adhere to a strict visual KPI matrix. Any deviation from these exact metrics is immediately reverted by the subject without hesitation.`,
      `Cross-referencing communication logs with external entities. These interactions have been flagged and forwarded for secondary review under the economics directive.`
    ]
  };
});
