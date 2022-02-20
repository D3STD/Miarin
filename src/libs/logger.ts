import chalk from 'chalk';

const success = ( message: string, target?: string ) => {
    console.log(chalk.green(`[✅] [${target ?? 'Client'}] [ ${chalk.gray(new Date().toLocaleString())} ] ${message}`));
}

const info = ( message: string, target?: string ) => {
    console.log(chalk.green(`[ℹ️] [${target ?? 'Client'}] [ ${chalk.gray(new Date().toLocaleString())} ] ${message}`));
}

const error = ( message: string, target?: string ) => {
    console.log(chalk.green(`[❌] [${target ?? 'Client'}] [ ${chalk.gray(new Date().toLocaleString())} ] ${message}`));
}

export {
    success,
    info,
    error
}