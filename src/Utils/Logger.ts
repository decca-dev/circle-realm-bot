import chalk from "chalk";

export class Logger {
  public readonly src: string;

  constructor(src: string) {
    this.src = src.toUpperCase();
  }

  public info(message: string): void {
    console.log(
      `[${this.formatDate(new Date())}] (${chalk.bold(this.src)}) ${chalk.green(
        "INFO"
      )} - ${message}`
    );
  }

  public error(error: string | Error): void {
    let message = typeof error === "string" ? error : error.message;
    console.log(
      `[${this.formatDate(new Date())}] (${chalk.bold(this.src)}) ${chalk.red(
        "ERROR"
      )} - ${message}`
    );
  }

  public warn(message: string): void {
    console.log(
      `[${this.formatDate(new Date())}] (${chalk.bold(
        this.src
      )}) ${chalk.yellow("WARN")} - ${message}`
    );
  }

  public formatDate(date: Date): string {
    const hours = date.getHours().toString().padEnd(2, "0");
    const minutes = date.getMinutes().toString().padEnd(2, "0");
    const seconds = date.getSeconds().toString().padEnd(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
}
