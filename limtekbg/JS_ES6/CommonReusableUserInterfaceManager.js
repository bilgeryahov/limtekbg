/**
 * @file CommonReusableUserInterfaceManager.js
 *
 * Class which exposes management of common reusable user
 * interface elements.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

class CommonReusableUserInterfaceManager {

    /**
     * Enables/Disables the modal for custom error message.
     *
     * @param $enable
     *
     * @return void
     */

    static enableCustomErrorMessageModal($enable){

        let $customErrorMessagePlaceholder = $('CustomErrorMessagePlaceholder');

        if(!$customErrorMessagePlaceholder){

            console.error('CommonReusableUserInterfaceManager.enableCustomErrorMessageModal(): the CustomErrorMessagePlaceholder is' +
                'missing!');
            return;
        }

        if($enable){

            $customErrorMessagePlaceholder.style.display = 'block';
            return;
        }

        $customErrorMessagePlaceholder.style.display = 'none';
    }
}