import Page from "./Page"

export default class SettingsPage extends Page {
  async at(timeoutSec: number) {
    await this.findElementWithTimeout("accessibility id", "Settings", timeoutSec)
  }

  async tapPasswords() {
    const element = await this.driver.findElement("accessibility id", "Passwords")
    await this.driver.executeCommand("click", element.ELEMENT)
  }
}
