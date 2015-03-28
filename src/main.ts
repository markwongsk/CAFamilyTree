/// <reference path="../typings/angularjs/angular.d.ts" />

export module CAFamilyTree {

    export var cafamilytree = angular.module("datatable", []);
}

$(function() {
    angular.bootstrap(document, [CAFamilyTree.cafamilytree.name]);
});
