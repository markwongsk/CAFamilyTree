define(["require", "exports"], function(require, exports) {
    (function (CAFamilyTree) {
        CAFamilyTree.cafamilytree = angular.module("datatable", []);
    })(exports.CAFamilyTree || (exports.CAFamilyTree = {}));
    var CAFamilyTree = exports.CAFamilyTree;

    $(function () {
        angular.bootstrap(document, [CAFamilyTree.cafamilytree.name]);
    });
});
