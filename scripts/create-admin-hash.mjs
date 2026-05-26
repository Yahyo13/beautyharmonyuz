import { hashPassword } from "../api/_security.js";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/create-admin-hash.mjs <password>");
  process.exit(1);
}

console.log(hashPassword(password));
