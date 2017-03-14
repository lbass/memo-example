const ErrorCodeSet = {
    'memo.001': { httpCode: 403, message: 'not login user' },
    'memo.002': { httpCode: 403, message: 'contents is empty' },
    'memo.003': { httpCode: 403, message: 'not found resource' },
    'memo.004': { httpCode: 403, message: 'permission failure' }
};

class ErrorMessageHandler {
    static handleError(error, res, result) {
        if(error) {
            let errorSet = ErrorCodeSet[error.message];

            if(errorSet) {
                return res.status(errorSet.httpCode).json({ error: errorSet.message });
            } else {
                return res.status(500).json({ error: error.message });
            }
        }
        return res.status(200).json(result);
    }
}

export default ErrorMessageHandler;
