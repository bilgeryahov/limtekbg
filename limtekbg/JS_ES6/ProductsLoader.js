/**
 * @file ProductsLoader.js
 *
 * Module which deals with the functionality of the Products page.
 *
 * Tough story.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 - 2017 Bilger Yahov, all rights reserved.
 */

const ProductsLoader = (function(){

	/*
	 * Encapsulate the logic.
	 */

	const Logic = {

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

            // First show the user that the products tree is being constructed.
            TemplateProcessor.generateProductsTreeLoadingState();

            // Get me all products from the main end-point.
            let $pathNodes = ['products'];
            let $path = DevelopmentHelpers.constructPath($pathNodes);
            let $extra = {

            };

            FirebaseEngine.firebaseGET(
                $path,
                $extra,
                function($error, $data){

                    // If errors, log and stop.
                    if($error){

                        console.error($error);

                        // TODO: Notify the user that product categories cannot be fetched.

                        return;
                    }

                    // If no data, log and stop.
                    if(!$data){

                        console.log('ProductsLoader.loadProducts(): No data arrived for ' +
                            $path);

                        // TODO: Notify the user that product categories are not present.

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
			 */

            TemplateProcessor.generateProductsTree($self._productsTree);

            // Disable the go back button.
            $self.enableGoBackCategories(false);
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

                let $pathNodes = [$key, 'products_list'];
                let $path = DevelopmentHelpers.constructPath($pathNodes);
                $self._categoryToLoad += $path;

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

                        $self._categoryToLoad = $self._categoryToLoad.substring(0, $self._categoryToLoad.length-($path.length));
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

				/*
				 * Okay, no need for a DB call.
				 *
				 * Display the go back button also.
				 */

                TemplateProcessor.generateProductsTree($self._tempProductList);

                // Show the go back to main categories button.
                $self.enableGoBackCategories(true);

                // Do not show the products listed now, since you are focusing on sub-categories.
                $self.enableProductsListed(false);

                // Do not forget to stop here.
                return;
            }

			/*
			 * We load real products from the DB.
			 * At this point we are sure that there is a category in
			 * the attribute below. (We make sure for that in the caller function).
			 */

			let $pathNodes = ['products', $self._categoryToLoad];
			let $path = DevelopmentHelpers.constructPath($pathNodes);

			/*
			 * Interesting things happens here with constructing the path.
			 * Since the $self._categoryToLoad is also constructed with
			 * DevelopmentHelpers.constructPath, it also ends with a '/'.
			 * So when the path above gets constructed it adds one more '/'
			 * at the end.
			 *
			 * TODO: Fix at some point.
			 */

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

                        // TODO: Notify the user that products for this category cannot be fetched.

                        return;
                    }

                    // First make the products listed visible, since you are going to show real products.
                    $self.enableProductsListed(true);

					/*
					 * Attempt to show real products.
					 * If no data, the TemplateProcessor will show a message on the front-end.
					 */

                    return TemplateProcessor.generateProductsForCategory($data);
                }
            )
        },

        /**
         * Loads the main categories.
         * The idea is to show back the main categories after showing sub-ones.
         *
         * @return void
         */

        loadMainCategories(){

            const $self = this;

            // Make sure that you have what to load.
            if(Object.keys($self._productsTree).length !== 0 && $self._productsTree !== null
                && $self._productsTree !== undefined){

                TemplateProcessor.generateProductsTree($self._productsTree);

                // Do not show the go back button. No need.
                $self.enableGoBackCategories(false);

                // Do not show the products listed now. Let the user focus on the categories.
                $self.enableProductsListed(false);
            }
        },

        /**
         * Enables/Disables the go back to main categories button.
         *
         * @param $enable
         *
         * @return void
         */

        enableGoBackCategories($enable){

            const $self = this;

            let $goBackCategories = $('GoBackCategories');
            if(!$goBackCategories){

                console.error('ProductsLoader.enableGoBackCatgories(): GoBackCategories not found!');
                return;
            }

            if($enable){

                $goBackCategories.className = $goBackCategories.className.replace(' w3-hide', '');
            }
            else {

                // Hide if not hidden already.
                if($goBackCategories.className.indexOf('w3-hide') === -1){

                    $goBackCategories.className += ' w3-hide';
                }
            }
        },

        /**
         * Enables/Disables the products listed.
         *
         * @param $enable
         *
         * @return void
         */

        enableProductsListed($enable){

            const $self = this;

            const $productsPlaceholder = $('ProductsPlaceholder');

            if(!$productsPlaceholder){

                console.error('ProductsLoader.enableProductsListed(): ProductsPlaceholder not found!');
                return;
            }

            if($enable){

                $productsPlaceholder.className = $productsPlaceholder.className.replace(' w3-hide', '');
            }
            else {

                if($productsPlaceholder.className.indexOf('w3-hide') === -1){

                    $productsPlaceholder.className += ' w3-hide';
                }
            }
        },

        /**
         * Gets the image URLs for a product.
         *
         * @param $product
         *
         * @return void
         */

        loadImagesForProduct($product){

            const $self = this;

            // Make sure that there is something inside the category to load.
            if($self._categoryToLoad === '' || $self._categoryToLoad === undefined ||
                $self._categoryToLoad === null){

                console.error('ProductsLoader.loadImagesForProduct(): category to load not found!');
                return;
            }

            // Show the modal first and then go on.
            TemplateProcessor.generateProductImagesLoadingState();

            // Make a DB request to get the image names.
            let $pathNodes = ['products', $self._categoryToLoad, $product];
            let $path = DevelopmentHelpers.constructPath($pathNodes);

            let $extra = {};

            FirebaseEngine.firebaseGET(
                $path,
                $extra,
                function($error, $data){

                    // If errors, log and stop.
                    if ($error) {

                        console.error($error);
                        return $self.notifyNoProductImages();
                    }

                    // If no data, log and stop.
                    if (!$data) {

                        console.log('ProductsLoader.loadImagesForProduct(): No data arrived for ' +
                            $path);

                        // No images found.
                        return $self.notifyNoProductImages();
                    }

                    // Check if there are any images to load.
                    if(!$data.hasOwnProperty('images')){

                        // No images found.
                        return $self.notifyNoProductImages();
                    }

                    // At this point we know that there are images to load.
                    let $imageURLs = [];

                    let $callForURL = function($index){

                        // First check if the item exists in the array.
                        if(!$data['images'][$index]){

                            // Enough.
                            return $self.generateImagesFromURLs($imageURLs);
                        }

                        let $storagePathNodes = [$path, $data['images'][$index]];
                        let $storagePath = DevelopmentHelpers.constructPath($storagePathNodes);
                        FirebaseEngine.retrieveStorageItemURL($storagePath, function($error, $data){

                            if($error){

                                console.error($error);
                                return $self.notifyNoProductImages();
                            }

                            // At this point we have one of the URLs.
                            if($data !== null && $data !== undefined){

                                $imageURLs.push($data);
                            }

                            // Call for the next.
                            $callForURL($index+1);
                        })
                    };

                    // Call for the first one.
                    $callForURL(0);
                }
            );
        },

        /**
         * Calls a function that notifies the User that
         * there are no images for this product.
         *
         * @return function
         */

        notifyNoProductImages(){

            return TemplateProcessor.generateProductImages({});
        },

        /**
         * Sends the URLs of the fetched images to the
         * TemplateProcessor.
         *
         * @param $URLs
         *
         * @return fuunction
         */

        generateImagesFromURLs($URLs){

            return TemplateProcessor.generateProductImages($URLs);
        }
	};

	return{

		init(){

			Logic.init();
		},

        loadProducts(){

			Logic.loadProducts();
        },

        constructCategoryPath($category){

        	Logic.constructCategoryPath($category);
		},

		loadCategoryContent(){

        	Logic.loadCategoryContent();
		},

		loadMainCategories(){

			Logic.loadMainCategories();
		},

		enableGoBackCategories($enable){

			Logic.enableGoBackCategories($enable);
		},

		enableProductsListed($enable){

			Logic.enableProductsListed($enable);
		},

		loadImagesForProduct($product){

			Logic.loadImagesForProduct($product);
		},

		notifyNoProductImages(){

			Logic.notifyNoProductImages();
		},

		generateImagesFromURLs($URLs){

			Logic.generateImagesFromURLs($URLs);
		}
	}
})();

document.addEvent('domready', function(){

	ProductsLoader.init();
});