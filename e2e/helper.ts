import type { Capabilities } from "@wdio/types"
import { remote } from "webdriverio"
import { node } from "appium/support"

const HOST = process.env.APPIUM_TEST_SERVER_HOST || "127.0.0.1"
const PORT = parseInt(String(process.env.APPIUM_TEST_SERVER_PORT), 10) || 4567
const PLATFORM_VERSION = process.env.PLATFORM_VERSION || "15.2"
const DEVICE_NAME = process.env.DEVICE_NAME || "iPhone 12 Pro"
const APP = "/Users/rerorero/Downloads/KickDebug.app" // TODO: fix app
const DEFAULT_CAPS = node.deepFreeze({
  alwaysMatch: {
    platformName: "iOS",
    "appium:platformVersion": PLATFORM_VERSION,
    "appium:deviceName": DEVICE_NAME,
    "appium:automationName": "XCUITest",
    "appium:app": APP,
  },
  firstMatch: [{}],
})

async function initSession(
  caps: Capabilities.RemoteCapability,
  remoteOpts = {}
): Promise<WebdriverIO.Browser> {
  return await remote({
    hostname: HOST,
    port: PORT,
    capabilities: caps,
    ...remoteOpts,
  })
}

async function deleteSession(driver: WebdriverIO.Browser) {
  await driver.deleteSession()
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export { initSession, deleteSession, delay, DEFAULT_CAPS, HOST, PORT }

