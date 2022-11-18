const app = require('./controller/app.js');
const port = 3000;
const server = app.listen(port, ()=> {
    console.log("Web App hosted at http://localhost:3000");
})