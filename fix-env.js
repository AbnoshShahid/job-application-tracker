const fs = require('fs');
const content = `MONGODB_URI=mongodb+srv://271055396_db_user:exK5hwqmftFN4zXt@jobtracker-cluster.ys2hrjj.mongodb.net/jobtracker?retryWrites=true&w=majority
NEXTAUTH_SECRET=58ff2a6a51dc224b06f531270e02724b
NEXTAUTH_URL=http://localhost:3000
`;
fs.writeFileSync('.env.local', content);
console.log('Fixed .env.local');
