/**
 * @file DevelopmentHelpers.js
 *
 * Class which exposes functionality to make the development process easier.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 - 2017 Bilger Yahov, all rights reserved.
 */

class DevelopmentHelpers {

    /**
     * Constructs a Database/Storage path, based on a given array
     * of child nodes.
     *
     * @param $nodes
     *
     * @return {string}
     */

 static constructPath($nodes){

     // Return value.
     let $path = '';

     // Check if array.
     if(!$nodes[0]){

         console.error('DevelopmentHelpers.constructPath(): The passed parameter is not an array.');
         return $path;
     }

     // Add a slash after each child node.
     $nodes.forEach(function($childNode){

        $path += $childNode + '/';
     });

     return $path;
 }
}