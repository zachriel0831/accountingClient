export default function reducer(
    state = {
        val: {
            val: '',
        },
        checked: false,
        error: null,
    }, action) {


    switch (action.type) {

        case 'INPUT_EMPTY': {
            return { ...state, checked: true ,error:action.payload};
        }
    }
    return state

}