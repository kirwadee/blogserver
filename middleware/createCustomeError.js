
export const createCustomError = (enteredStatus, enteredMessage) => {
    const errorObject = new Error()
    errorObject.status = enteredStatus;
    errorObject.message = enteredMessage

    return errorObject
}




