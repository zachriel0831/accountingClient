export default function reducer(
    state = {
        ntdTransfer_Props: {
        },
        fetching: false,
        fetched: false,
        error: null,
    }, action) {


    switch (action.type) {
        case 'NTDTRANSFER_SAVING': {

            return { ...state, fetching: true, fetched: false, };
        }
        case 'NTDTRANSFER_SAVING_REJECTED': {

            return { ...state, fetching: false, fetched: true, error: action.payload };
        }
        case 'NTDTRANSFER_SAVING_FULFILLED': {

            return { ...state, ntdTransfer_Props: action.payload, fetching: false, fetched: true, };
        }
    }
    return state

}