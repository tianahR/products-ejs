// Function Testing for An API


import { expect, use} from "chai";
import chaiHttp from "chai-http";


import { app, server } from "../app.js";

const chai = use(chaiHttp);
let request = chai.request;

describe("test multiply api", function () {
    after(() => {
      server.close();
    });
    it("should multiply two numbers", (done) => {
          request(app).get("/multiply")
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