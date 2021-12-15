var {IgApiClient} =  require('instagram-private-api');
var { get } = require('request-promise'); // request is already declared as a dependency of the library

const fs = require('fs');
const express = require('express')
const app = express()
const port = 3000;
const ig = new IgApiClient();
bot = async () => {
    //instagram credentials
    const igUsername = "presidenciaveisorg";
    const igPassword = "fafa9944";
    //instagram session handling
    function saveSession(data) {
        fs.writeFileSync('./igSession.dat', JSON.stringify(data));
        return data;
    }
    
    function checkSession() {
        return fs.existsSync('./igSession.dat');
    }

    function loadSession() {
        return JSON.parse(fs.readFileSync('./igSession.dat').toString());
    }
    ig.state.generateDevice(igUsername);
    ig.request.end$.subscribe(async () => {
        const serialized = await ig.state.serialize();
        delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
        saveSession(serialized);
    });
    if (checkSession()) {
        // import state accepts both a string as well as an object
        // the string should be a JSON object
        await ig.state.deserialize(loadSession());
    }
    const auth = await ig.account.login(igUsername, igPassword);

}
bot();

app.get('/tag/:name', async (req, res) => {
    var tag = await ig.tag.search(req.params.name);
    res.json(tag.results);
})

app.get('/user/:name', async (req, res) => {
    const userID = await ig.user.getIdByUsername(req.params.name);
    const userInfo = await ig.user.info(userID);
    console.log(userInfo);
    res.json(userInfo);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})