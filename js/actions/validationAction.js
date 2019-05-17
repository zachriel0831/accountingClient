export function isEmpty() {
    return {
        type: 'INPUT_EMPTY',
        payload: {
            error:'please input the value'
        }
    }

}