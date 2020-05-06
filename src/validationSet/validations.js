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


        case 'type':
            result = _.isEmpty(values);

            if (result) {

                return false;
            }
            return true;

        case 'amount':
            result = _.isEmpty(values);

            if (result) {

                return false;
            }
            return true;

        case 'category':
            result = _.isEmpty(values);

            if (result) {

                return false;
            }
            return true;

        case 'date':
            result = _.isEmpty(values);

            if (result) {

                return false;
            }
            return true;
        case 'remark':
            //  result = _.isEmpty(values);

            // if (result) {

            //     return false;
            // }
            return true;

        default:
            return true;

    }


});

export default validateThis;