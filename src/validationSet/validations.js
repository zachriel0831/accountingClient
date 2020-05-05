import _ from 'lodash';

const validateThis = ((values, type) => {
    let result;

    switch (type) {
        case 'id':
            result = _.isEmpty(values);

            if (result) {

                return false;
            }

            return true;
            break;


        case 'type':
            result = _.isEmpty(values);

            if (result) {

                return false;
            }
            return true;

            break;

        case 'amount':
            result = _.isEmpty(values);

            if (result) {

                return false;
            }
            return true;

            break;

        case 'category':
            result = _.isEmpty(values);

            if (result) {

                return false;
            }
            return true;

            break;

        case 'date':
            result = _.isEmpty(values);

            if (result) {

                return false;
            }
            return true;

            break;

        case 'remark':
            //  result = _.isEmpty(values);

            // if (result) {

            //     return false;
            // }
            return true;

            break;

        default:
            return true;
            break

    }


});

export default validateThis;