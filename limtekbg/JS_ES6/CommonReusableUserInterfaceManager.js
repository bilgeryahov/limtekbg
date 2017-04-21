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
     * Enables/Disables the modal for custom message.
     *
     * @param $enable
     *
     * @return void
     */

    static enableCustomMessageModal($enable){

        let $customMessagePlaceholder = $('CustomMessagePlaceholder');

        if(!$customMessagePlaceholder){

            console.error('CommonReusableUserInterfaceManager.enableCustomMessageModal(): the CustomMessagePlaceholder is' +
                'missing!');
            return;
        }

        if($enable){

            $customMessagePlaceholder.style.display = 'block';
            return;
        }

        $customMessagePlaceholder.style.display = 'none';
    }
}