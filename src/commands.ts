import { AppiumLogger, Driver } from "@appium/types"
import Page from "./pages/Page"
import SettingsPage from "./pages/SettingsPage"
import EnterPasscodePage from "./pages/EnterPasscodePage"
import PasswordsPage from "./pages/PasswordsPage"
import log from "./log/log"

const DEFAULT_PASSCODE = "1234"
const SETTINGS_BUNDLE_ID = "com.apple.Preferences"

export type CommandsOptions = {
  verifyDisplayedTimeoutSec: number
}

export class Commands {
  private log: AppiumLogger
  private driver: Driver
  private opts: CommandsOptions

  constructor(driver: Driver, opts: CommandsOptions = { verifyDisplayedTimeoutSec: 5 }) {
    this.log = log
    this.driver = driver
    this.opts = opts
  }

  async setPasswordsPreference(autoFillPasswords?: boolean, passcode?: string) {
    await this.withSettingsPage(async (settingsPage: SettingsPage) => {
      if (!passcode) {
        passcode = DEFAULT_PASSCODE
      }
      await settingsPage.tapPasswords()
      const enterPasscodePage = new EnterPasscodePage(this.driver)
      await this.verifyDisplayed(enterPasscodePage)
      await enterPasscodePage.enterPasscode(passcode)

      const passwordsPage = new PasswordsPage(this.driver)
      await this.verifyDisplayed(passwordsPage)
      if (autoFillPasswords !== undefined) {
        await passwordsPage.setAutoFillPasswords(autoFillPasswords)
      }
    })
  }

  private async withSettingsPage<T>(fn: (page: SettingsPage) => Promise<T>): Promise<T> {
    const [settingsPage, orgBundleId] = await this.gotoSettings()
    try {
      return await fn(settingsPage)
    } finally {
      await this.restoreApp(orgBundleId)
    }
  }

  private async gotoSettings(): Promise<[SettingsPage, string]> {
    const appInfo = await this.driver.executeCommand("execute", "mobile:activeAppInfo")
    this.log.info(`Original app info: ${JSON.stringify(appInfo)}`)

    await this.driver.executeCommand("activateApp", SETTINGS_BUNDLE_ID)
    const page = new SettingsPage(this.driver)
    await this.verifyDisplayed(page)
    return [page, appInfo.bundleId]
  }

  private async verifyDisplayed(page: Page) {
    await page.at(this.opts.verifyDisplayedTimeoutSec)
  }

  private async restoreApp(originalBundleId: string) {
    await this.driver.executeCommand("terminateApp", SETTINGS_BUNDLE_ID)
    await this.driver.executeCommand("activateApp", originalBundleId)
  }
}
