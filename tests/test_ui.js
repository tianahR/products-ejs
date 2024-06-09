// Function Testing for Rendered HTML

import { expect, use} from "chai";
import chaiHttp from "chai-http";


import { app, server } from "../app.js";

const chai = use(chaiHttp);
let request = chai.request;

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
