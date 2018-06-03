const chai = require("chai");
const assert = chai.assert;


const app = require("../app");


describe("Testing login",()=>{
    it("Testing if user is logged in from the start", () => {
        var isLoggedIn = app.isLoggedIn;
    assert.equal(isLoggedIn, false)
    })


    it("Testing if user gets a session before login", () => {
        var session = app.sessionLogin();
    assert.equal(session, undefined)
    })
})