import { BasePlugin } from "appium/plugin"
import { NextPluginCallback, Driver, StringRecord } from "@appium/types"
import { Commands } from "./commands"
import log from "./log/log"

export class IOSPrefPlugin extends BasePlugin {
  constructor(name: string, cliArgs = {}) {
    super(name, cliArgs)
  }

  static executeMethodMap = {
    "iospref:passwords": {
      command: "setPasswordsPreference",
      params: {
        optional: ["autoFillPasswords", "passcode"],
      },
    },
  } as const

  async execute(
    next: NextPluginCallback,
    driver: Driver,
    script: string,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    args: readonly [StringRecord<unknown>] | readonly any[]
  ) {
    return await this.executeMethod(next, driver, script, args)
  }

  async setPasswordsPreference(
    next: NextPluginCallback,
    driver: Driver,
    autoFillPasswords?: boolean,
    passcode?: string
  ) {
    await this.newCommands(driver).setPasswordsPreference(
      autoFillPasswords,
      passcode
    )
  }

  private newCommands(driver: Driver): Commands {
    return new Commands(driver)
  }
}
