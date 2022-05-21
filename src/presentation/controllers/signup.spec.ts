import { SignUpController } from "./signup";

describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", () => {
    const sut = new SignUpController();
    const httprequest = {
      body: {
        email: "my_email@gmail.com",
        password: "my_password",
        passwordConfirmation: "my_password",
      },
    };
    const httpresponse = sut.handle(httprequest);
    expect(httpresponse.statusCode).toBe(400);
    expect(httpresponse.body).toEqual(new Error("Missing param name"));
  });

  test("should return 400 if no email is provided", () => {
    const sut = new SignUpController();
    const httprequest = {
      body: {
        name: "my_name",
        password: "my_password",
        passwordConfirmation: "my_password",
      },
    };
    const httpresponse = sut.handle(httprequest);
    expect(httpresponse.statusCode).toBe(400);
    expect(httpresponse.body).toEqual(new Error("Missing param email"));
  });
});
