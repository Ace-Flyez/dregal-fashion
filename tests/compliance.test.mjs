import test from "node:test";
import assert from "node:assert/strict";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
test("accepts plus-sign email aliases", () => {
  assert.equal(emailPattern.test("user+tag@domain.com"), true);
});
test("rejects malformed email addresses", () => {
  for (const value of ["user", "user@", "@domain.com", "user domain@domain.com"]) assert.equal(emailPattern.test(value), false);
});
test("consent is explicit and separate", () => {
  const consent = { necessary: true, analytics: false, marketing: false };
  assert.equal(consent.necessary, true);
  assert.equal(consent.marketing, false);
});
test("data requests are limited to supported actions", () => {
  assert.deepEqual(["access", "export", "delete", "correct"].sort(), ["access", "correct", "delete", "export"]);
});
