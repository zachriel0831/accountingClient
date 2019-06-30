import React from 'react';

// import NtdTransfer_1 from '../../pages/transfer/NtdTransfer_1'
// import NtdTransfer_2 from '../../pages/transfer/NtdTransfer_2'
// import NtdTransfer_3 from '../../pages/transfer/NtdTransfer_3'
// import NtdTransfer_4_Rst from '../../pages/transfer/NtdTransfer_4_Rst'

import Home from '../../pages/home/Home'
import LogOutPage from '../../pages/logout/LogOutPage'
import Login from '../../pages/login/Login'
import RegisterPage from '../../pages/register/RegisterPage'

module.exports = {
    '/Home':Home,
    
    // '/NtdTransfer_1':NtdTransfer_1,
    // '/NtdTransfer_2':NtdTransfer_2,
    // '/NtdTransfer_3':NtdTransfer_3,
    // '/NtdTransfer_4_Rst':NtdTransfer_4_Rst,

    '/Register':RegisterPage,
    '/Login':Login,
    '/LogOut':LogOutPage,

}