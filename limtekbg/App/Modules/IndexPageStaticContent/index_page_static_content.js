/**
 * @file index_page_static_content.js
 *
 * IndexPageStaticContent module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const IndexPageStaticContent = (function(){

    const Logic = {

        _templatePath: './Modules/IndexPageStaticContent/index_page_static_content.html',
        _placeholderName: 'IndexPageStaticContentPlaceholder',
        _templateFactory: null,

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            const $self = this;

            $self._templateFactory = new TemplateFactory(
                $self._templatePath, $self._placeholderName, {}
            );

            $self._templateFactory.initProcess();
        }
    };

    return{

        init(){

            Logic.init();
        }
    }
})();

document.addEvent('domready', function () {

    IndexPageStaticContent.init();
});