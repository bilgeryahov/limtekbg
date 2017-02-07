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

	// The general products tree, set when the page loads.
	_productsTree: {},

	// Category which needs to be loaded after user clicks.
	_categoryToLoad: '',

	// Decide if the category has been found in the tree.
	_categoryToLoadFound: false,

	// If it has products list (if it has sub-categories).
	_hasProductsList: false,

	// Store the products list here (the sub-categories if any).
	_tempProductList: {},

    /**
	 * Initializes the main functionality.
	 * Makes the defensive checks for the external modules used.
	 *
	 * @return void
     */

	init(){

		const $self = this;

		// Make sure that FirebaseEngine is present.
		if(!FirebaseEngine){

			console.error('ProductsLoader.init(): FirebaseEngine is not present!');
			return;
		}

		// Make sure that the TemplateProcessor is present.
        if(!TemplateProcessor){

            console.error('ProductsLoader.init(): TemplateProcessor is not present!');
            return;
        }

        // Get me the products tree.
		$self.loadProducts();
	},

    /**
	 * Loads all the products from the database. The idea
	 * is to construct the products tree.
	 *
	 * @return void
     */

	loadProducts(){

		const $self = this;

		// Get me all products from the main end-point.
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

    /**
	 * Constructs the products tree based on the information it got from
	 * the Firebase Real Time Databse.
	 * Cleans up all the product categories which are filled in with real products.
	 * Leaves only the ones which have sub categories inside.
	 *
	 * @return void
     */

	constructProductsTree(){

		const $self = this;

		// Actually to make sure that there is info in the products tree.
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

		/*
		 * Call for generating the first (main) products tree.
		 * Pass true for the second parameter, since we want
		 * the user to think that we are smart. Thanks.
		 */

		TemplateProcessor.generateProductsTree($self._productsTree, true);
	},

    /**
	 * Constructs the path for a given category by traversing the products tree.
	 * Makes sure that if there are sub-categories, they get saved.
	 *
     * @param $category
	 *
	 * @return void
     */

	constructCategoryPath($category){

		/*
		 * Check for this category in the products tree.
		 * -> If it does not have 'products_list' attribute
		 * it means that you can make a GET request, to
		 * fetch the products for it.
		 *
		 * -> If it does have 'products_list' attribute
		 * it means that it has sub categories which need to be shown.
		 */

		const $self = this;

		// Refresh all the attributes that are going to be used.
		$self._categoryToLoad = '';
		$self._categoryToLoadFound = false;
		$self._hasProductsList = false;
		$self._tempProductList = {};

        let $traverse = function($object, $key){

            // Check if there is something already found.
        	if($self._categoryToLoadFound){

                // If yes, stop the process.
        		return;
			}

			// Start constructing the path.
			$self._categoryToLoad += $key + '/products_list/';

			// Check if you found what you are looking for.
			if($key === $category){

				// Say that you have found something.
				$self._categoryToLoadFound = true;

                // Check if this has products list
                if($object.hasOwnProperty('products_list')){

                	// Need the later to decide if there is a need for a Firebase DB call.
                    $self._hasProductsList = true;
                    $self._tempProductList = $object['products_list'];
                }
			}
			else{

				/*
				 * You haven't found what you are looking for, check if you can
				 * at least traverse this one.
				 */

				if($object.hasOwnProperty('products_list')){

					/*
					 * You can traverse it, since it has 'products_list' attribute.
					 * This means that it has sub categories.
					 */

                    Object.keys($object['products_list']).forEach(function($subCategory){

                        // Recursivelly calls itself.
                        $traverse($object['products_list'][$subCategory], $subCategory);
                    });
				}

                // Make sure that you remove parts from the path, ONLY if you haven't found anything.
                if(!$self._categoryToLoadFound){

                    $self._categoryToLoad = $self._categoryToLoad.substring(0, $self._categoryToLoad.length-('/products_list/'.length));
                    $self._categoryToLoad = $self._categoryToLoad.substring(0, $self._categoryToLoad.length - $key.length);
                }
			}
        };

        // Start for the entire products tree.
        for(let $member in $self._productsTree){

        	// Check if there is something already found.
            if($self._categoryToLoadFound){

            	// If yes, stop the process.
                break;
            }

            if($self._productsTree.hasOwnProperty($member)){

            	// Traverse the category.
                $traverse($self._productsTree[$member], $member);
            }
        }

        // At this point we consider that we have found the category in the tree.
        if($self._categoryToLoad !== '' || $self._categoryToLoad !== undefined || $self._categoryToLoad !== null){

        	// Show me the content for this category. Sub-categories or real proructs.
            $self.loadCategoryContent();
		}
	},

    /**
	 * Loads the content of a category or sub-category.
	 * Depending on if it has sub-categories or not, decides to make
	 * a DB request or not.
	 *
     * @return {*}
     */

	loadCategoryContent(){

		const $self = this;

		// Check if you need a Firebase call or you have sub-categories (which are already stored).
		if($self._hasProductsList){

			// Okay, no need for a DB call.
			// Here we load a category content, so no waiting.
			return TemplateProcessor.generateProductsTree($self._tempProductList, false);
		}

		/*
		 * We load real products from the DB.
		 * At this point we are sure that there is a category in
		 * the attribute below. (We make sure for that in the caller function).
		 */

		let $path = 'products/' + $self._categoryToLoad;

		// No extra parameters.
		let $extra = {};

		// Fire the request.
		FirebaseEngine.firebaseGET(
			$path,
			$extra,
            function($error, $data){

                // If errors, log and stop.
                if($error){

                    console.error($error);
                    return;
                }

                // If no data, the TemplateProcessor will show a message on the front-end.
				return TemplateProcessor.generateProductsForCategory($data);
            }
		)
	}
};

document.addEvent('domready', function(){

	ProductsLoader.init();
});