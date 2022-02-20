import * as liblog from '../libs/logger.js';

export const exec = ( client ) => {
	liblog.success( `Клиент ${client.user.tag} был успешно инициализирован` );
};