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

	// Products will be stored as a tree structure.
	_productsTree: {},

	// Used to store the path to the particular category(sub-category)
	_steps: '',

	// When does it need to stop processing (searching) for not processed paths.
	_stepsStop: false,

    /**
	 * Fetches the main categories from path 'products'.
	 * Calls for sub categories to be fetched.
	 *
	 * @return void
     */

	init: function(){

		const $self = this;

		// Check for the FirebaseEngine.
		if(!FirebaseEngine){

			console.error('ProductsLoader.init(): FirebaseEngine is not present!');
			return;
		}

		// Make sure that 'products' path exists.
		$self._productsTree = {
			products:{

			}
		};

		// Make the request for the main categories inside 'products' path.
		let $path  = 'products/';
		let $extra = {
			shallow: true,
			products_load: true
		};

		FirebaseEngine.firebaseGET(
			$path,
			$extra,
			function($error, $data){

				if($error){

					console.error($error);
					return;
				}

				if($data === null){

                    console.error('ProductsLoader.init(): The data arrived for the first(major)' +
						' categories is null!');
                    return;
				}

				// Update the products tree.
				$self._productsTree['products'] = $data;

				// Prepare for processing new paths.
				$self.prepareNewRoundProcessing();
            }
		);
    },

    /**
	 * Prepares new round of processing. Refreshes all attributes needed
	 * and finds a path for processing. If cannot find anything, means that
	 * all paths are processed.
	 *
	 * @return void
     */

	prepareNewRoundProcessing: function(){

		const $self = this;

		// Refresh attributes.
        $self._stepsStop = false;
        $self._steps = '';

        // Find me not-processed paths.
        $self.findPathToProcess($self._productsTree);

        // Found a not-processed path.
        if($self._steps !== ''){

        	// Start processing.
            $self.processPath();
		}
		else{

        	// Done. All paths processed.
        	console.log($self._productsTree);
		}
    },

    /**
	 * Makes a database call with a new not-processed path.
	 * Based on the data that receives, updates the products tree.
	 *
	 * @return void
     */

	processPath: function(){

		const $self = this;

		// Before calling this function, we are sure that there is a new path to process.
		let $path = $self._steps;
        let $extra = {
            shallow: true,
            products_load: true
        };

        FirebaseEngine.firebaseGET(
        	$path,
			$extra,
            function($error, $data){

                if($error){

                    console.error($error);
                    return;
                }

                // No data arrived for this path.
                if($data === null){

                	// Pass empty object instead of null.
                    $self.placeData({});
				}
				else{

                	// Let's check if data consists of IDs or sub categories.
                	let $placeSubCategories = false;

                	Object.keys($data).forEach(function($element){

                		if(isNaN($element)){

                			// Not a number, so we do have new sub categories.
                			$placeSubCategories = true;
						}
                    });

                	if($placeSubCategories){

                		$self.placeData($data);
					}
					else{

                		// In case of IDs, pass an empty object.
                		$self.placeData({});
					}
				}

				// Go on with a new processing round.
                $self.prepareNewRoundProcessing();
            }
		);
    },

    /**
	 * Traverses the whole products tree and finds where
	 * the particular data piece should go.
	 *
	 * Works based on the path, that just got processed.
	 *
     * @param $data
	 *
	 * @return void
     */

	placeData: function($data){

        const $self = this;

        /*
         * The path consists of:
         * 	category names,
         * 	'products_list'
         * 	/-es
         *
         * We need to remove the last / and all the 'products_list'.
         */

        let $pathArray = $self._steps.split('/');

        // Remove the last /.
        $pathArray.splice($pathArray.length-1, 1);

        // Remove all the 'products_list'.
        for(let $i = $pathArray.length - 1; $i >= 0; $i--){

        	if($pathArray[$i] === 'products_list'){

        		$pathArray.splice($i, 1);
			}
		}

		/*
		 * Traverses the object passed and finds where
		 * the particular array element occurs.
		 *
		 * When finds what needed, attaches the data on it.
		 */

    	let $traverse = function($objectToTraverse, $indexArrayElement){

    		for(let $member in $objectToTraverse){

    			if($objectToTraverse.hasOwnProperty($member)){

    				if($member === $pathArray[$indexArrayElement]){

    					if(typeof $objectToTraverse[$member] === 'object'
							&& $pathArray[$indexArrayElement+1] !== undefined){

    						// Go deeper because we still have categories(sub-categories) in the path.
    						$traverse($objectToTraverse[$member], $indexArrayElement+1);
						}
						else{

    						// Okay, we have found it.
    						$objectToTraverse[$member] = $data;
						}
					}
				}
			}
        };

    	// Start traversing from the 0th array element, the whole products tree.
    	$traverse($self._productsTree, 0);
    },

    /**
	 * Searches for not processed paths in the passed parameter.
	 *
     * @param $processAble
	 *
	 * @return void
     */

	findPathToProcess: function($processAble){

		const $self = this;

		// Do I need to stop?
		if($self._stepsStop){

			// Yes.
			return;
		}

		// If not, let me find a suitable path.
		for(let $member in $processAble){

			// Make sure that you do not have to stop.
			if($processAble.hasOwnProperty($member) && !$self._stepsStop){

				// Make sure that you traverse only objects.
				if(typeof($processAble[$member]) === 'object'){

					// Check if something has been added.
                    if($self._steps === ''){

                    	// If not, make sure that for 'products' you do not add....
                    	if($member === 'products'){

                            $self._steps = $member + '/';
						}
						else{

                    		// ... 'products_list'
                            $self._steps = $member + '/products_list/';
						}
                    }
                    else{

                    	// Okay, it is not your first time, going deeper bitch!
                        $self._steps += $member + '/products_list/';
                    }

                    // Start it.
                    $self.findPathToProcess($processAble[$member]);

                    // Make sure that you remove parts from the path, ONLY if you haven't found anything.
                    if(!$self._stepsStop){

                    	$self._steps = $self._steps.substring(0, $self._steps.length-('/products_list/'.length));
                        $self._steps = $self._steps.substring(0, $self._steps.length - $member.length);
					}
                }
				else if($processAble[$member] === 'not_processed'){

					// Okay, we have found a not processed path.
					$self._steps += $member + '/products_list/';
					$self._stepsStop = true;
				}
			}
		}
    }
};

document.addEvent('domready', function(){

	ProductsLoader.init();
});