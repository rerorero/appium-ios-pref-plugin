import { AppiumLogger, Driver, Element } from "@appium/types"
import {errors} from 'appium/driver';
import log from "../log/log"

export default abstract class Page {
  protected log: AppiumLogger
  protected driver: Driver
  protected PREDICATE_STRATEGY = "-ios predicate string"

  constructor(driver: Driver) {
    this.log = log;
    this.driver = driver
  }

  abstract at(timeoutSec: number): Promise<void>

  protected async findWithTimeout<T>(func: () => Promise<T>, timeoutSec: number, intervalMillis = 500): Promise<T> {
    const startTime = Date.now()
    let lastError: Error | undefined

    while (Date.now() - startTime < timeoutSec * 1000) {
      try {
        return await func()
      } catch (e) {
        if (e instanceof errors.NoSuchElementError) {
          log.info("Element not found, retrying...")
          lastError = e
          await new Promise((resolve) => setTimeout(resolve, intervalMillis))
        } else {
          log.info("Error while finding element", e)
          throw e
        }
      }
    }

    log.info("Element not found after timeout", lastError)
    if (lastError) {
      throw lastError
    } else {
      throw new errors.NoSuchElementError()
    }
  }

  protected async findElementWithTimeout(strategy: string, selector: string, timeoutSec = 5): Promise<Element> {
    log.info(`Finding element with strategy ${strategy} and selector ${selector}`)
    const x = await this.findWithTimeout(async () => {
      return await this.driver.findElement(strategy, selector)
    }, timeoutSec)
    return x
  }

  protected booleanValueToSwitchValue(value: boolean): string {
    return value ? "1" : "0"
  }
}
