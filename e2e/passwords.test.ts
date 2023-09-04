import { initSession, deleteSession, DEFAULT_CAPS } from "./helper"

describe("passwords", () => {
  let driver: WebdriverIO.Browser

  beforeEach(async () => {
    driver = await initSession(DEFAULT_CAPS)
  })

  afterEach(async () => {
    await deleteSession(driver)
  })

  describe("set passwords preferences", () => {
    it("should update autoFillPasswords", async () => {
      await driver.execute("iospref:passwords", { autoFillPasswords: true })
    })
  })
})

