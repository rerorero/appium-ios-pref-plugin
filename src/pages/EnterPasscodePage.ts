import Page from "./Page"

export default class EnterPasscodePage extends Page {
  async at(timeoutSec: number) {
    await this.findElementWithTimeout("accessibility id", "Passcode field", timeoutSec)
  }

  async enterPasscode(passcode: string) {
    const element = await this.driver.findElement("accessibility id", "Passcode field")
    await this.driver.executeCommand("click", element.ELEMENT)
    await this.driver.executeCommand("keys", passcode)
    const done = await this.findElementWithTimeout("accessibility id", "Done")
    await this.driver.executeCommand("click", done.ELEMENT)
  }
}

