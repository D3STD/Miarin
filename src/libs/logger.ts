import chalk from 'chalk';

const success = ( message: string, target?: string ) => {
    console.log(chalk.green(`[✅] [${target ?? 'Client'}] [ ${chalk.gray(new Date().toLocaleString())} ] ${message}`));
}

const info = ( message: string, target?: string ) => {
    console.log(chalk.green(`[ℹ️] [${target ?? 'Client'}] [ ${chalk.gray(new Date().toLocaleString())} ] ${message}`));
}

const error = ( message: string, error: Error, target?: string ) => {
    console.log(chalk.green(`[❌] [${target ?? 'Client'}] [ ${chalk.gray(new Date().toLocaleString())} ] ${message}\n${chalk.red(error.stack)}`));
}

export {
    success,
    info,
    error
}