import Page from "./Page"

export default class PasswordsPage extends Page {
  async at(timeoutSec: number) {
    await this.findElementWithTimeout("accessibility id", "Passwords", timeoutSec)
  }

  async setAutoFillPasswords(enabled: boolean) {
    const autoFillPasswords = await this.driver.findElement(this.PREDICATE_STRATEGY, this.autoFillPasswordsSwitchPredicateString())
    const attr = await this.driver.executeCommand("getAttribute", "value", autoFillPasswords.ELEMENT)
    if (this.booleanValueToSwitchValue(enabled) === attr) {
      this.log.info(`AutoFill Passwords is already ${enabled}`)
      return
    }
    await this.driver.executeCommand("click", autoFillPasswords.ELEMENT)
    // ensure the switch is in the desired state
    await this.findElementWithTimeout(this.PREDICATE_STRATEGY, this.autoFillPasswordsSwitchPredicateString(this.booleanValueToSwitchValue(enabled)))
  }

  private autoFillPasswordsSwitchPredicateString(value?: string) {
    const predicate =`type == "XCUIElementTypeSwitch" AND name == "AutoFill Passwords"`
    if (value) {
      return `${predicate} AND value == "${value}"`
    }
    return predicate
  }
}

