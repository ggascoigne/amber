import { Command } from '@oclif/command'

export default class Hello extends Command {
  async run() {
    console.log('hello world - maybe')
  }
}
