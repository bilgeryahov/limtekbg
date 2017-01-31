/**
 * @file ProductsLoader.js
 *
 * Module which loads the product categories from the database.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 - 2017 Bilger Yahov, all rights reserved.
 */

const ProductsLoader = {

	_productsTree: {},

	init(){

		const $self = this;

		// Make sure that FirebaseEngine is present.
		if(!FirebaseEngine){

			console.error('ProductsLoader.init(): FirebaseEngine is not present!');
			return;
		}

		$self.loadProducts();
	},

	loadProducts(){

		const $self = this;

		let $path = 'products/';
		let $extra = {

		};

		FirebaseEngine.firebaseGET(
			$path,
			$extra,
			function($error, $data){

				// If errors, log and stop.
				if($error){

					console.error($error);
					return;
				}

				// If no data, log and stop.
				if(!$data){

					console.log('ProductsLoader.loadProducts(): No data arrived for ' +
						$path);
					return;
				}

				/*
				 * At this point we have all the products from the database.
				 * Now it's time to construct the products tree.
				 */

				$self._productsTree = $data;
				$self.constructProductsTree();
			}
		);
	},

	constructProductsTree(){

		const $self = this;

		// If passed data is not an object, log and return;
		if(typeOf($self._productsTree) !== 'object'){

			console.error('ProductsLoader.constructProductsTree(): The _productsTree must be' +
				' an object');
			return;
		}

		let $traverse = function($object){

			// Check if this object has 'products_list' attribute.
			if(!$object.hasOwnProperty('products_list')){

				// If it does not, this means that we do not have to perform clean-up.
				return;
			}

			// Make sure that you clean up when you find a real product, not a sub category inside 'products_list'.
            for(let $member in $object['products_list']){

                if($object['products_list'].hasOwnProperty($member)){

                	// If it does not have 'diplay_name' it is a real product.
                    if(!$object['products_list'][$member].hasOwnProperty('display_name')){

                    	// Reset and return.
                        delete $object['products_list'];
                        return;
                    }
                }
            }

            // We have found sub-categories. Let's process them.
            Object.keys($object['products_list']).forEach(function($subCategory){

            	// Recursivelly calls itself.
            	$traverse($object['products_list'][$subCategory]);
            });
        };

		// Start for the entire products tree.
		for(let $member in $self._productsTree){

			if($self._productsTree.hasOwnProperty($member)){

				$traverse($self._productsTree[$member]);
			}
		}

		// Show me results.
		console.log($self._productsTree);
	}
};

document.addEvent('domready', function(){

	ProductsLoader.init();
});