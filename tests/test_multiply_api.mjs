// Function Testing for An API


import { expect, use} from "chai";
import chaiHttp from "chai-http";


import { app, server } from "../app.js";

const chai = use(chaiHttp);
let request = chai.request;



// for registration and logon test

import { factory, seed_db } from "../util/seed_db.js"

//const faker = require("@faker-js/faker").fakerEN_US;
import {faker, fakerEN_US} from "@faker-js/faker"

//const User = require("../models/User.js");
import User from "../models/User.js";

///-------------------

describe("test multiply api", function () {
    after(() => {
      server.close();
    });
    it("should multiply two numbers", (done) => {
          chai.request(app).get("/multiply")
          .query({first: 7, second: 6})
          .send()
          .end((err,res)=> {
          expect(err).to.equal(null)          
          expect(res).to.have.status(200)
          expect(res).to.have.property("body")
          expect(res.body).to.have.property("result")
          expect(res.body.result).to.equal(42)
          done()
        })
    })
})


// the test for registration and logon doesn't work in a separate file 

describe("tests for registration and logon", function () {
  after(() => {
    server.close();
  });
  it("should get the registration page", (done) => {
    request(app)
      .get("/sessions/register")
      .send()
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.have.property("text");
        expect(res.text).to.include("Enter your name");
        const textNoLineEnd = res.text.replaceAll("\n", "");
        const csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd);
        expect(csrfToken).to.not.be.null;
        this.csrfToken = csrfToken[1];
        expect(res).to.have.property("headers");
        expect(res.headers).to.have.property("set-cookie");
        const cookies = res.headers["set-cookie"];
        const csrfCookie = cookies.find((element) =>
          element.startsWith("csrfToken"),
        );
        expect(csrfCookie).to.not.be.undefined;
        const cookieValue = /csrfToken=(.*?);\s/.exec(csrfCookie);
        this.csrfCookie = cookieValue[1];
        done();
      });
  });

  it("should register the user", async () => {
      this.password = faker.internet.password();
      this.user = await factory.build("user", { password: this.password });

      const dataToPost = {
        name: this.user.name,
        email: this.user.email,
        password: this.password,
        password1: this.password,
        _csrf: this.csrfToken,
      };

      try 
      {
            const request = chai
              .request(app)
              .post("/sessions/register")
              .set("Cookie", `csrfToken=${this.csrfCookie}`)
              .set("content-type", "application/x-www-form-urlencoded")
              .send(dataToPost);

            const res = await request;
            console.log("got here");
            expect(res).to.have.status(200);
            expect(res).to.have.property("text");
            expect(res.text).to.include("Products List");

            let newUser = await User.findOne({ email: this.user.email });
            expect(newUser).to.not.be.null;
            console.log(newUser);

      } catch (err) {
            console.log(err);
            expect.fail("Register request failed");
    }
  });


  it("should log the user on", async () => {

    const dataToPost = {
      email: this.user.email,
      password: this.password,
      _csrf: this.csrfToken,
    };

    

    try {

          // console.log("data to post", dataToPost);

          const request = chai
            .request(app)
            .post("/sessions/logon")
            .set("Cookie", `csrfToken=${this.csrfCookie}`)
            .set("content-type", "application/x-www-form-urlencoded")
            .redirects(0)
            .send(dataToPost);

          const res = await request;
          expect(res).to.have.status(302);
          expect(res.headers.location).to.equal('/')
          const cookies = res.headers["set-cookie"];

          this.sessionCookie = cookies.find((element) =>
          element.startsWith("connect.sid"),
          );
          expect(this.sessionCookie).to.not.be.undefined;
    } catch (err) {

      console.log(err);
      expect.fail("Logon request failed");
    }
  });
  
  it("should get the index page", (done)=>{
    chai.request(app).get("/")
    .set('Cookie',this.sessionCookie)
    .send()
    .end((err,res)=>{
        expect(err).to.equal(null)
        expect(res).to.have.status(200)
        expect(res).to.have.property("text")
        expect(res.text).to.include(this.user.name)
        done()
    }) 
  });

//   test for the logoff


});

// Function Testing for Rendered HTML
describe("test getting a page", function () {
  after(() => {
    server.close();
  });
  it("should get the index page", (done) => {
    request(app)
      .get("/")
      .send()
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.have.property("text");
        expect(res.text).to.include("Click this link");
        done();
      });
  });
});